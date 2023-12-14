import random
from typing import List


class Maze:
    """
    This class generates and represents mazes created with the randomized DFS
    """

    def __init__(self, rows, cols):
        """
        This method initializes a Maze object with the specified
        number of rows and columns. It creates a grid of Cells and links them together
        to form the maze structure. The input parameters `rows` and `cols` should be
        positive integers representing the dimensions of the maze.

        :param rows: Number of rows in the maze
        :param cols: Number of columns in the maze
        """

        self.rows = rows
        self.cols = cols

        self._cell_grid = [[Cell() for c in range(cols)] for r in range(rows)]
        self.all_cells = []

        # Link all the rows together
        for row in self._cell_grid:
            for c in range(len(row)):
                self.all_cells.append(row[c])  # Save a ref to all cells
                if c > 0:
                    row[c].west = row[c - 1]
                if c < len(row) - 1:
                    row[c].east = row[c + 1]

        # Link all the columns together
        for c in range(self.cols):
            for r in range(self.rows):
                if r > 0:
                    self._cell_grid[r][c].north = self._cell_grid[r - 1][c]
                if r < self.rows - 1:
                    self._cell_grid[r][c].south = self._cell_grid[r + 1][c]

        self._generate()

    def _generate(self):
        """
        Links the Maze's cells together in a random maze formation
        """
        initial_cell = self._get_random_unvisited()
        initial_cell.visited = True

        stack = [initial_cell]
        while len(stack):
            current_cell = stack.pop()
            unvisited_neigbors = current_cell.unvisited_neighbors
            if len(unvisited_neigbors):
                stack.append(current_cell)
                new_cell = random.choice(unvisited_neigbors)
                current_cell.break_down_walls(new_cell)
                new_cell.visited = True
                stack.append(new_cell)

    def _get_random_unvisited(self) -> "Cell":
        """
        Get a random unvisited cell in the grid
        :return: A random unvisited Cell
        """
        return random.choice(
            [cell for cell in self.all_cells if cell is not None and not cell.visited]
        )

    def __str__(self):
        """Get the string representation of the grid of cells for the maze"""
        return "\n".join(
            ["".join([str(col) for col in row]) for row in self._cell_grid]
        )

    @property
    def hex_grid(self):
        """Return the 2d array of hex values that represents the maze"""
        return [[str(col) for col in row] for row in self._cell_grid]


class Cell:
    """
    This class represents a cell in a maze.
    """

    def __init__(self):
        self.wall_north = self.wall_east = self.wall_south = self.wall_west = True
        self.north = self.south = self.east = self.west = None
        self.visited = False

    @property
    def unvisited_neighbors(self) -> List["Cell"]:
        """
        Return a list of unvisited neighbors of the Cell.

        :return: A list of unvisited neighbors of the Cell.
        :rtype: List[Cell]
        """
        return [
            c
            for c in [self.north, self.south, self.east, self.west]
            if c is not None and not c.visited
        ]

    def break_down_walls(self, cell):
        """
        Breaks down walls between a cell and a neighboring cells.

        :param cell: The neighboring cell to break down walls with.
        :return: None

        Raises:
            Exception: If a non-neighboring cell is provided.
        """
        if cell == self.north:
            self.wall_north = False
            cell.wall_south = False
        elif cell == self.south:
            self.wall_south = False
            cell.wall_north = False
        elif cell == self.east:
            self.wall_east = False
            cell.wall_west = False
        elif cell == self.west:
            self.wall_west = False
            cell.wall_east = False
        else:
            raise Exception("Non-neighboring cell provided")

    def __str__(self):
        """
        Return a string representation of the Cell object in hexadecimal

        :return: The hexadecimal string representation of the Cell object.
        """
        return str(
            hex(
                int(
                    (
                        f"{1 if self.wall_north else 0}{1 if self.wall_east else 0}"
                        f"{1 if self.wall_south else 0}{1 if self.wall_west else 0}"
                    ),
                    2,
                )
            )[2:]
        )
