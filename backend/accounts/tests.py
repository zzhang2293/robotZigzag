import random
import string

from django.contrib.auth.models import User
from hypothesis import given, settings, assume
from hypothesis.extra.django import TestCase
from hypothesis.strategies import text, emails, composite, lists
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from accounts.models import Profile
from accounts.serializers import ProfileSerializer

django_alphabet = string.ascii_letters + string.digits  # + string.punctuation


@composite
def user_profiles_auth(draw):
    """Generate user profiles linked to user accounts"""
    username = draw(text(min_size=1, max_size=16, alphabet=django_alphabet))
    password = draw(text(min_size=1, max_size=16, alphabet=django_alphabet))

    if User.objects.filter(username=username):
        assume(False)

    user = User.objects.create_user(username, password=password)
    user.save()

    user.profile.display_name = draw(
        text(
            max_size=Profile._meta.get_field("display_name").max_length,
            alphabet=django_alphabet,
        )
    )
    user.profile.save()
    return user.profile, username, password


@composite
def user_profiles(draw):
    """Generate user profiles linked to user accounts"""
    return draw(user_profiles_auth())[0]


class ProfileTest(TestCase):
    """Unit tests for the accounts app"""

    @settings(deadline=1000, max_examples=10)
    @given(
        username=text(min_size=1, max_size=User._meta.get_field("username").max_length),
        email=emails(),
        password=text(min_size=1, max_size=User._meta.get_field("password").max_length),
    )
    def test_profile_creation(self, username, email, password):
        """Check if a profile is created and linked when a user is created."""
        test_user = User.objects.create_user(
            username=username, email=email, password=password
        )
        self.assertIsNotNone(test_user.profile)
        self.assertTrue(isinstance(test_user.profile, Profile))

    @given(profile=user_profiles())
    def test_profile_string(self, profile: Profile):
        """Test that the profile can correctly be represented as a string"""
        self.assertEqual(
            str(profile),
            f"{profile.user.username} ({profile.display_name})"
            if profile.display_name
            else profile.user.username,
        )

    def test_profile_serializer_gives_username_as_display_name(self):
        user = User.objects.create_user("test_user")
        user.save()
        profile = user.profile
        self.assertEqual("test_user", ProfileSerializer(profile).data["display_name"])

    def test_profile_serializer_gives_display_name_as_display_name(self):
        user = User.objects.create_user("test_user")
        user.save()
        profile = user.profile
        profile.display_name = "test_name"
        profile.save()
        self.assertEqual("test_name", ProfileSerializer(profile).data["display_name"])


class AccountTests(APITestCase, TestCase):
    @settings(deadline=None)
    @given(user_profiles_auth())
    def test_get_token(self, profile_data):
        """
        Test obtaining a token for valid users
        """
        profile, username, password = profile_data
        data = {
            "username": username,
            "password": password,
        }
        url = reverse("login")
        response = self.client.post(url, data, follow=True, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)

    def test_my_profile_url(self):
        self.assertEqual("/backend/profiles/me/", reverse("profile-my_profile"))

    def test_my_profile_not_auth(self):
        """
        Users should not be able to see their profile if they are not logged in
        """
        response = self.client.get(
            reverse("profile-my_profile"), format="json", follow=True
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @settings(max_examples=5)
    @given(profile=user_profiles())
    def test_my_profile_auth(self, profile: Profile):
        """
        Users should be able to view their profile when logged in
        """
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

        response = self.client.get(
            reverse("profile-my_profile"), format="json", follow=True
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @given(profile=user_profiles())
    def test_my_profile_data(self, profile: Profile):
        """Test that the my_profile page displays the correct information"""
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get(
            reverse("profile-my_profile"), format="json", follow=True
        )
        self.assertDictEqual(
            response.data,
            {
                "id": profile.pk,
                "user": profile.user.pk,
                "display_name": profile.display_name or profile.user.username,
                "status": profile.status,
            },
        )

    @settings(deadline=1000, max_examples=10)
    @given(lists(user_profiles(), min_size=1, max_size=500))
    def test_recently_online_count_logins(self, profiles):
        """Test that all created tokens are counted"""
        token = None
        for p in profiles:
            token = Token.objects.create(user=p.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

        response = self.client.get(
            reverse("profile-online"), format="json", follow=True
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, len(profiles))

    @settings(deadline=1000, max_examples=10)
    @given(lists(user_profiles(), min_size=2, max_size=100))
    def test_recently_online_do_not_count_logouts(self, profiles):
        """Test that when users log out they are not counted"""
        token_ = None
        for p in profiles:
            token_ = Token.objects.create(user=p.user)

        logout_choices = random.sample(
            profiles[:-1], k=random.randint(1, len(profiles) - 1)
        )
        for logouts in logout_choices:
            token = Token.objects.filter(user=logouts.user).first()
            self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
            self.assertEqual(
                self.client.post(
                    reverse("logout"),
                    format="json",
                    follow=True,
                ).status_code,
                status.HTTP_204_NO_CONTENT,
            )

        self.client.credentials(HTTP_AUTHORIZATION="Token " + token_.key)
        response = self.client.get(
            reverse("profile-online"), format="json", follow=True
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, len(profiles) - len(logout_choices))

    @given(
        profile=user_profiles(),
        new_display_name=text(
            max_size=Profile._meta.get_field("display_name").max_length,
            min_size=1,
            alphabet=django_alphabet,
        ),
    )
    def test_update_user_profile(self, profile: Profile, new_display_name: str):
        """Test that the my_profile endpoint correctly update the profile"""
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            reverse("profile-my_profile"),
            data={"display_name": new_display_name},
            format="json",
            follow=True,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK, "Request failed")
        self.assertEqual(
            response.data["display_name"],
            new_display_name,
            "Failed to respond with new display name",
        )
        profile.refresh_from_db()
        self.assertEqual(
            profile.display_name, new_display_name, "Failed to update the database"
        )
