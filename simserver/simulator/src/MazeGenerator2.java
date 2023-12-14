
import java.util.Random;
import java.util.Stack;

public class MazeGenerator2 {
	
    static Random random = new Random();

    public static int[][] generateRandomArray(int rows, int cols) {
    	int[][] maze = new int[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                maze[i][j] = 0; // Initialize all cells as walls
            }
        }

        Stack<int[]> stack = new Stack<>();
        int startX = 1;
        int startY = 1;
        maze[startX][startY] = 1;
        stack.push(new int[]{startX, startY});

        while (!stack.isEmpty()) {
            int[] currentCell = stack.peek();
            int x = currentCell[0];
            int y = currentCell[1];

            int[] direction = getDirection(x, y, rows, cols, maze);
            if (direction != null) {
                int newX = direction[0];
                int newY = direction[1];
                maze[newX][newY] = 1;
                maze[(x + newX) / 2][(y + newY) / 2] = 1;
                stack.push(new int[]{newX, newY});
            } else {
                stack.pop();
            }
        }
        return maze;
    }

    private static int[] getDirection(int x, int y, int rows, int cols, int[][] maze) {
        int[][] directions = {{2, 0}, {-2, 0}, {0, 2}, {0, -2}};
        randomizeArray(directions);

        for (int[] direction : directions) {
            int newX = x + direction[0];
            int newY = y + direction[1];

            if (newX > 0 && newX < rows - 1 && newY > 0 && newY < cols - 1 && maze[newX][newY] == 0) {
                return new int[]{newX, newY};
            }
        }
        return null;
    }

    private static void randomizeArray(int[][] array) {
        for (int i = array.length - 1; i > 0; i--) {
            int index = random.nextInt(i + 1);
            int[] temp = array[index];
            array[index] = array[i];
            array[i] = temp;
        }
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
