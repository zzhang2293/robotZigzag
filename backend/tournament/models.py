from django.db import models


class Tournament(models.Model):
    """Represents a tournament where many players can submit solutions to a common
    maze with a common robot."""

    name = models.CharField(max_length=64)
    """The tournament name"""

    start = models.DateTimeField()
    """The start datetime of the tournament"""

    stop = models.DateTimeField()
    """The stop datetime of the tournament"""

    robot_configuration = models.ForeignKey(
        "maze.RobotConfiguration", models.SET_NULL, null=True, blank=True
    )
    """The robot configuration to use in the tournament"""

    maze_configuration = models.ForeignKey(
        "maze.MazeConfiguration", models.SET_NULL, null=True, blank=True
    )
    """The maze configuration to use in the tournament"""

    def __str__(self):
        return self.name

    @classmethod
    def create(
        cls, name, start, stop, robot_configuration=None, maze_configuration=None
    ):
        """Create and save a new Tournament object"""
        if stop < start:
            raise Exception("The stop value must be greater than the start value.")
        c = cls(
            name=name,
            start=start,
            stop=stop,
            robot_configuration=robot_configuration,
            maze_configuration=maze_configuration,
        )
        c.save()
        return c
