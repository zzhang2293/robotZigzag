import java.util.ArrayList;
import java.util.Random;

/**
 * This class is another method of generating mazes for our Simulator service.
 * This method takes a JSONObject and reads a hex-maze.
 * 
 * @see Maze
 */
public class MazeGenerator4 {
	private static final String INPUT_FILE = "/app/Volume/simservicein.txt";
	private static final String OUTPUT_FILE = "/app/Volume/simserviceout.txt";
	public static PlaintextCommunicator in;
	static Random random = new Random();

	private static char[][] mazeRep;
	private static int[][] coordinates;

	/**
	 * Populate fields mazeRep and coordinates with appropriate values according to
	 * STDIN. The format of the input is as follows: [number of rows] [number of
	 * columns] [maze representation in 0's and 1's] [start x coordinate] [start y
	 * coordinate] [goal x coordinate] [goal y coordinate]
	 */
	public static void generateMaze() {
		in = new PlaintextCommunicator(INPUT_FILE, OUTPUT_FILE);
		ArrayList<String> data = in.readFrom();
		int rows = Integer.parseInt(data.remove(0));
		int cols = Integer.parseInt(data.remove(0));
		mazeRep = new char[rows][cols];
		for (int i = 0; i < rows; i++) {
			String row = data.remove(0);
			for (int j = 0; j < cols; j++) {
				char cellRep = row.charAt(j);
				mazeRep[i][j] = cellRep;
			}
		}
		coordinates = new int[2][2];
		coordinates[0][1] = Integer.parseInt(data.remove(0));
		coordinates[0][0] = Integer.parseInt(data.remove(0));
		coordinates[1][1] = Integer.parseInt(data.remove(0));
		coordinates[1][0] = Integer.parseInt(data.remove(0));
	}

	/**
	 * Getter for the maze representation 2D array stored within this class
	 */
	public static char[][] getMazeRep() {
		return mazeRep;
	}

	/**
	 * Getter for the coordinates 2D array stored within this class
	 */
	public static int[][] getCoords() {
		return coordinates;
	}

	/**
	 * Basic general print method for visualizing 2D int arrays.
	 */
	public static void printArray(int[][] array) {
		for (int[] row : array) {
			for (int num : row) {
				System.out.print(num + " ");
			}
			System.out.println();
		}
	}
}
