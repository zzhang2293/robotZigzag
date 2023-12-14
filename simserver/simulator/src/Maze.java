
import java.util.Random;

/**
 * This class is a representation of the Maze using Cell objects with which the
 * RobotController can interact. Each Maze instance is randomly generated and
 * un-editable after creation.
 * 
 * @see Cell
 * @see RobotController
 */
public class Maze {

	private int[][] mazeRepresentation; // Received from backend
	private char[][] hexMazeRep;
	private int[] goalCoords = new int[2]; // Received from backend
	private int[] startCoords = new int[2]; // Received from backend
	private Cell[][] maze;

	private Random random = new Random();

	/**
	 * Constructs a maze object of size rows x cols. Generates 2D int array
	 * representation of maze. Generates coordinates for start and goal cells.
	 * Converts prior information to framework that RobotController class can
	 * interact properly with.
	 * 
	 * @see RobotController
	 */
	public Maze(int rows, int cols) {
		// Generate necessary values to convert
//		mazeRepresentation = MazeGenerator2.generateRandomArray(rows, cols);
//		int[][] coordinates = MazeGenerator2.generateCoords(mazeRepresentation); //Moving coordinate generator to the maze generator class
		MazeGenerator3.generateMaze();
		mazeRepresentation = MazeGenerator3.getMazeRep();
		int[][] coordinates = MazeGenerator3.getCoords(); // Moving coordinate generator to the maze generator class
		startCoords = coordinates[0];
		goalCoords = coordinates[1];
		// generateCoords();

		// Convert to representation ready for user-submitted robot code
		maze = convertArrayToCells(mazeRepresentation);

		// Display maze to console
		System.out.println("CellMaze: ");
		printMaze(maze);
	}

	public Maze() { // Generates hexMaze
		MazeGenerator4.generateMaze();
		hexMazeRep = MazeGenerator4.getMazeRep();
		int[][] coordinates = MazeGenerator4.getCoords();
		startCoords = coordinates[0];
		goalCoords = coordinates[1];
		maze = convertArrayToCells(hexMazeRep);
	}

	/**
	 * Generates random coordinates within the 2D space defined by
	 * mazeRepresentation and accordingly populates corresponding instance variable
	 * arrays. Assumes (0, 0) is the top left corner. Ensures goal and start
	 * coordinates are not the same.
	 */
	@SuppressWarnings("unused")
	private void generateCoords() {
		// Generate random start coordinates, ensuring that the start is located on an
		// empty space.
		do {
			startCoords[0] = random.nextInt(mazeRepresentation.length);
			startCoords[1] = random.nextInt(mazeRepresentation[0].length);
		} while (mazeRepresentation[startCoords[0]][startCoords[1]] == 0);

		// Generate random goal coordinates, ensuring that the goal is located on an
		// empty space and is distinct from the start.
		do {
			goalCoords[0] = random.nextInt(mazeRepresentation.length);
			goalCoords[1] = random.nextInt(mazeRepresentation[0].length);
		} while (mazeRepresentation[goalCoords[0]][goalCoords[1]] == 0
				|| (startCoords[0] == goalCoords[0] && startCoords[1] == goalCoords[1]));

		System.out.println("START: (" + startCoords[0] + ", " + startCoords[1] + ")");
		System.out.println("GOAL: (" + goalCoords[0] + ", " + goalCoords[1] + ")");
	}

	/**
	 * Converts a 2D array of integers to its corresponding 2D array of cells.
	 * Parameter mazeRep must be a 2D array of zeros and ones where 0 represents a
	 * wall and 1 represents an empty space.
	 * 
	 * @param mazeRep 2D array of zeros and ones
	 * @return a 2D cell array directly corresponding to mazeRep
	 */
	private Cell[][] convertArrayToCells(int[][] mazeRep) {
		// Create cell array to return
		Cell[][] newMaze = new Cell[mazeRep.length][mazeRep[0].length];

		// Populate new cell array with cells at locations designated by mazeRep
		for (int i = 0; i < newMaze.length; i++) {
			for (int j = 0; j < newMaze[i].length; j++) {
				if (mazeRep[i][j] == 1) {
					Cell newCell = new Cell();
					newMaze[i][j] = newCell;
					newCell.coordinates[1] = i;
					newCell.coordinates[0] = j;
				}
			}
		}

		// Connect all adjacent cells to make bi-directional graph
		for (int i = 0; i < newMaze.length; i++) {
			for (int j = 0; j < newMaze[i].length; j++) {
				Cell curCell = newMaze[i][j];
				if (curCell != null) {
					// Connect north cell
					if (i - 1 > 0) {
						curCell.setNorthCell(newMaze[i - 1][j]);
					}
					// Connect east cell
					if (j + 1 < newMaze.length) {
						curCell.setEastCell(newMaze[i][j + 1]);
					}
					// Connect south cell
					if (i + 1 < newMaze.length) {
						curCell.setSouthCell(newMaze[i + 1][j]);
					}
					// Connect west cell
					if (j - 1 > 0) {
						curCell.setWestCell(newMaze[i][j - 1]);
					}
				}
			}
		}

		// Set goal location according to generated goalCoords[]
		if (newMaze[goalCoords[0]][goalCoords[1]] != null) {
			try {
				newMaze[goalCoords[0]][goalCoords[1]].setGoal(true);
			} catch (IllegalActionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return newMaze;
	}

	// HexMazerep
	private Cell[][] convertArrayToCells(char[][] mazeRep) {
		// Create cell array to return
		Cell[][] newMaze = new Cell[mazeRep.length][mazeRep[0].length];

		// Populate new cell array with cells at locations designated by mazeRep
		for (int i = 0; i < newMaze.length; i++) {
			for (int j = 0; j < newMaze[i].length; j++) {
				// Fill maze with cells
				Cell newCell = new Cell();
				newMaze[i][j] = newCell;
				newCell.coordinates[1] = i;
				newCell.coordinates[0] = j;
			}
		}

		// TODO: Connect cells based on hex values in mazeRep
		for (int i = 0; i < newMaze.length; i++) {
			for (int j = 0; j < newMaze[i].length; j++) {
				String binaryString = hexToBinary("" + mazeRep[i][j]);
				Cell currCell = newMaze[i][j];

				if (binaryString.charAt(3) != '1' && j - 1 >= 0) {
					currCell.setWestCell(newMaze[i][j - 1]);
				}
				if (binaryString.charAt(2) != '1' && i + 1 < newMaze.length) {
					currCell.setSouthCell(newMaze[i + 1][j]);
				}
				if (binaryString.charAt(1) != '1' && j + 1 < newMaze[i].length) {
					currCell.setEastCell(newMaze[i][j + 1]);
				}
				if (binaryString.charAt(0) != '1' && i - 1 >= 0) {
					currCell.setNorthCell(newMaze[i - 1][j]);
				}
			}
			//System.out.println();
		}

		// Set goal location according to generated goalCoords[]
		if (newMaze[goalCoords[0]][goalCoords[1]] != null) {
			try {
				newMaze[goalCoords[0]][goalCoords[1]].setGoal(true);
			} catch (IllegalActionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return newMaze;
	}

	/**
	 * Converts hexadecimal string to its binary string representation equivalent.
	 * 
	 * @param hex hexadecimal string
	 * @return binary string representation of passed in hex string
	 */
	private String hexToBinary(String hex) {
		int i = Integer.parseInt(hex, 16);
		String bin = Integer.toBinaryString(i);
		bin = leftPadding(bin, '0', 4);
		return bin;
	}

	/**
	 * Pads input string with given character to the left to fit within L characters
	 * 
	 * @param input String to pad
	 * @param ch    Character to pad with
	 * @param L     Desired length
	 * @return Padded string
	 */
	public static String leftPadding(String input, char ch, int L) {

		String result = String

				// First left pad the string
				// with space up to length L
				.format("%" + L + "s", input)

				// Then replace all the spaces
				// with the given character ch
				.replace(' ', ch);

		// Return the resultant string
		return result;
	}

	/**
	 * Getter for the cell on which the robot will be spawned in the maze.
	 * 
	 * @return Robot's beginning Cell object
	 */
	public Cell getStartCell() {
		return maze[startCoords[0]][startCoords[1]];
	}

	/**
	 * Prints an ASCII visualization of the maze this particular instance
	 * represents. 0's for walls, 1's for empty spaces, S for start, G for goal.
	 */
	@Deprecated
	private void printMaze(Cell[][] maze) {
		for (int i = 0; i < maze.length; i++) {
			for (int j = 0; j < maze[i].length; j++) {
				String toPrint = "";
				if (i == startCoords[0] && j == startCoords[1]) {
					toPrint = "S ";
				} else if (maze[i][j] != null && i == goalCoords[0] && j == goalCoords[1]) {
					toPrint = "G ";
				} else {
					toPrint = (maze[i][j] != null) ? "1 " : "0 ";
				}
				System.out.print(toPrint);
			}
			System.out.println();
		}
		System.out.println("---------------------");
	}

//	private void printMaze(RobotController rc) {
//		for (int i = 0; i < maze.length; i++) {
//			for (int j = 0; j < maze[i].length; j++) {
//				String toPrint = "";
//				if (rc.getCurrentCell().equals(maze[i][j])) {
//					toPrint = "R ";
//				} else if (i == startCoords[0] && j == startCoords[1]) {
//					toPrint = "S ";
//				} else if (i == goalCoords[0] && j == goalCoords[1]) {
//					toPrint = "G ";
//				} else {
//					toPrint = (maze[i][j] != null) ? "1 " : "0 ";
//				}
//				System.out.print(toPrint);
//			}
//			System.out.println();
//		}
//		System.out.println("---------------------");
//	}

}
