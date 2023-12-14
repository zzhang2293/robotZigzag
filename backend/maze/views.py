import random

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from maze import models
from maze import serializers
from maze.generator import Maze


class RunResultViewSet(viewsets.ModelViewSet):
    """
    This class is a ViewSet for managing the RunResult model.
    It allows users to perform various CRUD operations on RunResult objects.
    """

    queryset = models.RunResult.objects.all()
    serializer_class = serializers.RunResultSerializer
    permission_classes = [IsAuthenticated]


class MazeConfigurationViewSet(viewsets.ModelViewSet):
    """
    This class represents a ViewSet for the MazeConfiguration model in
    the Maze application.
    """

    queryset = models.MazeConfiguration.objects.all()
    serializer_class = serializers.MazeConfigurationSerializer

    @action(detail=False, url_name="random_maze")
    def random(self, request):
        """Get a new random maze configuration. It is not saved into the database."""
        size = random.randint(5, 15)
        maze_data = Maze(size, size)
        maze = models.MazeConfiguration()
        maze.start_row, maze.start_col = 0, 0
        maze.end_row, maze.end_col = size - 1, size - 1
        maze.level_configuration = maze_data.hex_grid
        maze.save()  # Include this to save it in the database
        maze_ser = self.serializer_class(maze).data
        return Response(maze_ser)


class RobotConfigurationViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for managing robot configurations. This ViewSet handles CRUD operations
    for the RobotConfiguration model."""

    queryset = models.RobotConfiguration.objects.all()
    serializer_class = serializers.RobotConfigurationSerializer


class SnippetViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.SnippetSerializer
    queryset = models.Snippet.objects.all().order_by("-last_used")
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(profile__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(profile=self.request.user.profile)
