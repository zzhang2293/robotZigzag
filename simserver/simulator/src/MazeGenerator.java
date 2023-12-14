
import java.util.Random;

public class MazeGenerator {

    public static int[][] generateRandomArray(int rows, int columns) {
        int[][] array = new int[rows][columns];
        Random random = new Random();

        // Populate the array with random 0s and 1s
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                array[i][j] = random.nextInt(2); // 0 or 1
            }
        }

        // Ensure 1s are adjacent to at least one other 1
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < columns; j++) {
                if (array[i][j] == 0) {
                    // Check adjacent cells
                    if (hasAdjacentZero(array, i, j, rows, columns)) {
                        array[i][j] = 1;
                    }
                }
            }
        }

        return array;
    }

    public static boolean hasAdjacentZero(int[][] array, int row, int col, int rows, int columns) {
        // Check if there is a zero in any adjacent cell
        int[][] directions = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        for (int[] dir : directions) {
            int newRow = row + dir[0];
            int newCol = col + dir[1];
            if (newRow >= 1 && newRow < rows && newCol >= 1 && newCol < columns) {
                if (array[newRow][newCol] == 0) {
                    return true;
                }
            }
        }
        return false;
    }

    public static void printArray(int[][] array) {
        for (int[] row : array) {
            for (int num : row) {
                System.out.print(num + " ");
            }
            System.out.println();
        }
    }
}
