from rest_framework import serializers

from maze import models


class RunResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RunResult
        fields = ["id", "tournament", "duration", "did_win", "timestamp", "profile"]


class MazeConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MazeConfiguration
        fields = "__all__"


class RobotConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.RobotConfiguration
        fields = "__all__"


class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Snippet
        fields = "__all__"
