from django.contrib.auth.models import User
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from rest_framework.authtoken.models import Token


class OnlineUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    count = models.IntegerField(default=0)


@receiver(post_save, sender=Token)
def reset_online_after_login(sender, instance, **kwargs):
    """Each time a new token is created make sure that
    there are no associated online user objects"""
    online_user = OnlineUser.objects.filter(user=instance.user)
    if online_user:
        online_user.delete()


@receiver(post_delete, sender=Token)
def reset_online_after_logout(sender, instance, **kwargs):
    """Each time a token is deleted make sure that
    there are no associated online user objects"""
    online_user = OnlineUser.objects.filter(user=instance.user)
    if online_user:
        online_user.delete()
