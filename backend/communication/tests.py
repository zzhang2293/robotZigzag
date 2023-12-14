from hypothesis import given, settings
from hypothesis.extra.django import TestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from accounts.models import Profile
from accounts.tests import user_profiles
from maze.models import MazeConfiguration


def make_maze():
    m = MazeConfiguration()
    m.name = ""
    m.start_row = 3
    m.start_col = 3
    m.end_row = 4
    m.end_col = 4
    m.level_configuration = [
        ["b", "8", "c", "9", "e"],
        ["9", "6", "3", "6", "d"],
        ["5", "9", "a", "a", "6"],
        ["5", "3", "c", "b", "c"],
        ["3", "a", "2", "a", "6"],
    ]
    m.save()
    return m.pk


class CommunicationTests(APITestCase, TestCase):
    @given(profile=user_profiles())
    def test_receive_post_ok(self, profile: Profile):
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            reverse("receive_file"),
            {
                "maze_id": make_maze(),
                "user_code": "",
            },
            format="json",
            follow=True,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.json(),
            {
                "status": "ok",
                "telemetry": [
                    {"direction": "up", "time": 0, "x": 1, "y": 2},
                    {"direction": "left", "time": 1, "x": 4, "y": 5},
                ],
                "total_time": 1,
                "did_win": True,
            },
        )

    @given(profile=user_profiles())
    def test_receive_post_infinte_loop(self, profile: Profile):
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            reverse("receive_file"),
            {
                "maze_id": make_maze(),
                "user_code": "loop",
            },
            format="json",
            follow=True,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.json(),
            {"status": "error", "details": "Infinite loop"},
        )

    @settings(deadline=20000, max_examples=1)
    @given(profile=user_profiles())
    def test_receive_post_timeout(self, profile: Profile):
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            reverse("receive_file"),
            {
                "maze_id": make_maze(),
                "user_code": "timeout",
            },
            format="json",
            follow=True,
        )

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    @given(profile=user_profiles())
    def test_receive_post_error_in_code(self, profile: Profile):
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            reverse("receive_file"),
            {
                "maze_id": make_maze(),
                "user_code": "error",
            },
            format="json",
            follow=True,
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.json(),
            {"status": "error", "details": "Error details"},
        )

    @given(profile=user_profiles())
    def test_receive_post_no_content(self, profile: Profile):
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            reverse("receive_file"),
            format="json",
            follow=True,
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @given(profile=user_profiles())
    def test_receive_get_rejected(self, profile: Profile):
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get(
            reverse("receive_file"),
            follow=True,
        )

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
