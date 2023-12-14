from django.db import models

from accounts.models import Profile


class RunResult(models.Model):
    """RunResults store the configuration and outcome of a single user submission."""

    timestamp = models.DateTimeField()
    """This is the time the entry was submitted"""
    duration = models.IntegerField(
        help_text="The duration of the robot execution in simulator ticks"
    )
    """The duration of the robot execution in simulator ticks"""
    did_win = models.BooleanField()
    """Did the robot successfully finish the maze"""
    run_error = models.CharField(max_length=512)
    """Did the robot have an error."""
    result_data = models.JSONField(
        help_text="JSON data from the simulation with the resulting moves"
    )
    """JSON data from the simulation with the resulting moves"""

    profile = models.ForeignKey("accounts.Profile", models.CASCADE)
    """The associated user profile for this run"""

    robot_configuration = models.ForeignKey(
        "RobotConfiguration", models.SET_NULL, null=True, blank=True
    )
    """The associated robot configuration for this run"""

    maze_configuration = models.ForeignKey(
        "MazeConfiguration", models.SET_NULL, null=True, blank=True
    )
    """The associated maze configuration for this run"""

    tournament = models.ForeignKey(
        "tournament.Tournament",
        models.SET_NULL,
        null=True,
        blank=True,
        related_name="run_results",
    )
    """The associated tournament for this run"""

    def __str__(self):
        return f"Run at {self.timestamp} by {self.profile}"


class RobotConfiguration(models.Model):
    """Stores the configuration of a robot so that it can be referenced or re-used."""

    name = models.CharField(max_length=32)
    """The robot configuration name"""

    def __str__(self):
        return self.name or f"Robot {self.pk}"


class MazeConfiguration(models.Model):
    """Stores the configuration of a maze so that it can be referenced or re-used."""

    name = models.CharField(max_length=32, blank=True, default="")
    """The maze configuration name"""
    start_row = models.IntegerField()
    """Row of robot start position in the maze"""
    start_col = models.IntegerField()
    """Column of robot start position in the maze"""
    end_row = models.IntegerField()
    """Row of robot finish position in the maze"""
    end_col = models.IntegerField()
    """Column of robot finish position in the maze"""
    level_configuration = models.JSONField(
        help_text="A JSON object representing the rows and columns of the maze"
    )
    """A JSON object representing the rows and columns of the maze"""

    def __str__(self):
        return self.name or f"Maze {self.pk}"


class Snippet(models.Model):
    """
    Represents a snippet of code saved by the user to be used later
    """

    name = models.CharField(max_length=32, blank=True, default="")
    """Name of the snippet"""
    profile = models.ForeignKey(to=Profile, on_delete=models.CASCADE)
    """Profile the snippet belongs to"""
    content = models.TextField()
    """Content of the snippet"""
    last_used = models.DateTimeField(auto_now=True)
    """Last time this snippet was used"""

    class Meta:
        """Meta options for the snippet to require that the name of each snippet be
        unique for each profile"""

        constraints = [
            models.UniqueConstraint(
                fields=["name", "profile"], name="%(app_label)s_%(class)s_unique"
            )
        ]
