from datetime import datetime, timedelta

import pytz
from accounts import models
from accounts import serializers
from rest_framework import viewsets, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response


class ProfileViewSet(viewsets.ModelViewSet):
    """
    This is the ViewSet to provide CRUD operations to profiles
    """

    queryset = models.Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["get", "post"], url_name="my_profile")
    def me(self, request):
        """Return the current logged-in user's profile if it is a get request"""
        if request.method == "GET":
            profile_data = self.serializer_class(
                self.queryset.get(user=request.user)
            ).data
            return Response(profile_data)
        if request.method == "POST":
            profile = self.queryset.get(user=request.user)
            profile.display_name = request.data["display_name"]
            profile.save()
            return Response(self.serializer_class(profile).data)

    @action(detail=False, url_name="online")
    def online(self, request):
        """
        Return how many users are currently online.
        Online is defined as both being logged in and having logged in within 24 hours
        """
        return Response(
            len(
                Token.objects.filter(
                    created__gt=(
                        datetime.now(tz=pytz.timezone("America/New_York"))
                        - timedelta(hours=24)
                    )
                )
            )
        )
