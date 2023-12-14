

import java.util.Scanner;
import java.util.Random;

/**
 * This class is another method of generating mazes for our Simulator service.
 * This method takes formatted input from stdin and uses it to make a maze.
 * 
 * @see Maze
 */
public class MazeGenerator3 {

	static Scanner in = new Scanner(System.in);
	static Random random = new Random();

	private static int[][] mazeRep;
	private static int[][] coordinates;

	/**
	 * Populate fields mazeRep and coordinates with appropriate values according to
	 * STDIN. The format of the input is as follows: 
	 * [number of rows] [number of columns]
	 * [maze representation in 0's and 1's]
	 * [start x coordinate] [start y coordinate]
	 * [goal x coordinate] [goal y coordinate]
	 */
	public static void generateMaze() {
		int rows = in.nextInt();
		int cols = in.nextInt();
		mazeRep = new int[rows][cols];
		for (int i = 0; i < rows; i++) {
			for (int j = 0; j < cols; j++) {
				mazeRep[i][j] = in.nextInt();
			}
		}
		coordinates = new int[2][2];
		coordinates[0][1] = in.nextInt();
		coordinates[0][0] = in.nextInt();
		coordinates[1][1] = in.nextInt();
		coordinates[1][0] = in.nextInt();
	}

	/**
	 * Getter for the maze representation 2D array stored within this class
	 */
	public static int[][] getMazeRep() {
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
