import random

from hypothesis import given
from hypothesis.extra.django import TestCase
from hypothesis.extra.django import from_model
from hypothesis.strategies import dictionaries
from hypothesis.strategies import text
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from accounts.models import Profile
from accounts.tests import user_profiles
from maze.generator import Cell, Maze
from maze.models import RunResult, MazeConfiguration, RobotConfiguration


class MazeTest(TestCase):
    """Unit tests for the maze app"""

    @given(
        from_model(
            RunResult,
            profile=user_profiles(),
            result_data=dictionaries(keys=text(max_size=20), values=text(max_size=20)),
        )
    )
    def test_run_result_string(self, run_result: RunResult):
        """Checks that RunResults correctly convert into strings"""
        self.assertEqual(
            str(run_result), f"Run at {run_result.timestamp} by {run_result.profile}"
        )

    @given(
        from_model(
            MazeConfiguration,
            level_configuration=(dictionaries(keys=text(), values=text())),
        )
    )
    def test_maze_configuration_string(self, maze_configuration: MazeConfiguration):
        """Checks that MazeConfigurations correctly convert into strings"""
        self.assertEqual(
            str(maze_configuration),
            maze_configuration.name or f"Maze {maze_configuration.pk}",
        )

    @given(from_model(RobotConfiguration))
    def test_robot_configuration_string(self, robot_configuration: RobotConfiguration):
        """Checks that RobotConfigurations correctly convert into strings"""
        self.assertEqual(
            str(robot_configuration),
            robot_configuration.name or f"Robot {robot_configuration.pk}",
        )


class MazeGenTest(TestCase):
    """Testing for the maze generator"""

    def test_cell_starts_unvisited(self):
        """This method is used to test if a cell starts as unvisited"""
        self.assertFalse(Cell().visited)

    def test_cell_unvisited_neighbors(self):
        """Test that the unvisited neighbors lists unvisited neighbors"""
        cell = Cell()
        cell.north = Cell()
        cell.south = Cell()
        cell.east = Cell()
        cell.west = Cell()

        self.assertEqual(len(cell.unvisited_neighbors), 4)
        cell.north.visited = (
            cell.south.visited
        ) = cell.east.visited = cell.west.visited = True
        self.assertEqual(len(cell.unvisited_neighbors), 0)

    def test_cell_starts_all_walls(self):
        """Test that a cell has all its walls up by default"""
        cell = Cell()
        self.assertTrue(cell.wall_north)
        self.assertTrue(cell.wall_south)
        self.assertTrue(cell.wall_east)
        self.assertTrue(cell.wall_west)

    def test_cell_break_down_walls_north(self):
        """Test removing the north wall"""
        cell = Cell()
        cell.north = Cell()

        cell.break_down_walls(cell.north)
        self.assertFalse(cell.wall_north)
        self.assertFalse(cell.north.wall_south)

    def test_cell_break_down_walls_south(self):
        """Test removing the south wall"""
        cell = Cell()
        cell.south = Cell()

        cell.break_down_walls(cell.south)
        self.assertFalse(cell.wall_south)
        self.assertFalse(cell.south.wall_north)

    def test_cell_break_down_walls_east(self):
        """Test removing the east wall"""
        cell = Cell()
        cell.east = Cell()

        cell.break_down_walls(cell.east)
        self.assertFalse(cell.wall_east)
        self.assertFalse(cell.east.wall_west)

    def test_cell_break_down_walls_west(self):
        """Test removing the west wall"""
        cell = Cell()
        cell.west = Cell()

        cell.break_down_walls(cell.west)
        self.assertFalse(cell.wall_west)
        self.assertFalse(cell.west.wall_east)

    def test_cell_break_down_non_neighbor(self):
        """Test that breaking down the wall with a non-neighboring
        cell raises an exception"""
        cell = Cell()
        # Break down walls with self
        self.assertRaises(Exception, cell.break_down_walls, cell)
        # Break down walls with unrelated cell
        self.assertRaises(Exception, cell.break_down_walls, Cell())

    def test_maze_str(self):
        """Test the string representation of a maze"""
        random.seed(1)
        maze = Maze(5, 5)
        self.assertEqual(str(maze), "9aacd\n5bc36\n594bc\n36594\nba267")


class APITests(APITestCase, TestCase):
    def test_random_maze_url(self):
        """Test that the random maze url is correct"""
        self.assertEqual(
            "/backend/maze_configurations/random/",
            reverse("maze_configurations-random_maze"),
        )

    @given(profile=user_profiles())
    def test_new_random_maze(self, profile: Profile):
        """
        Test generating a new random maze
        """
        token = Token.objects.create(user=profile.user)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

        random.seed(1)
        response = self.client.get(
            reverse("maze_configurations-random_maze"), format="json", follow=True
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": response.data["id"],
                "name": "",
                "start_row": 0,
                "start_col": 0,
                "end_row": 6,
                "end_col": 6,
                "level_configuration": [
                    ["d", "9", "8", "a", "c", "9", "c"],
                    ["5", "5", "3", "c", "3", "6", "5"],
                    ["5", "1", "e", "3", "8", "c", "7"],
                    ["1", "6", "9", "c", "7", "3", "c"],
                    ["5", "9", "6", "3", "a", "c", "5"],
                    ["5", "7", "b", "a", "c", "5", "5"],
                    ["3", "a", "a", "a", "6", "3", "6"],
                ],
            },
        )
