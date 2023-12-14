from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    """Profiles contain app-specific user data and are associated with a single
    :model:`auth.User` object"""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    """The :model:`auth.User` associated with this profile."""

    display_name = models.CharField(max_length=32, default="", blank=True)
    """Optional display name to use instead of their username"""

    status = models.CharField(
        choices=(
            ("user", "user"),
            ("admin", "admin"),
        ),
        max_length=30,
        default="user",
    )

    def __str__(self):
        return (
            f"{self.user.username} ({self.display_name})"
            if self.display_name
            else self.user.username
        )


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Creates a profile any time a new :model:`auth.User` is created"""
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Saves a profile any time a new :model:`auth.User` is saved"""
    instance.profile.save()
