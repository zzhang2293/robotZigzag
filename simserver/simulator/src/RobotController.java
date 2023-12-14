import java.util.ArrayList;

/**
 * This class defines the API with which the user can control their robot.
 * Instances of this class interact with a Maze object using modular arithmetic
 * to represent the direction the robot is facing.
 * 
 * @see Maze
 */
public class RobotController {
	private static Cell currentCell;
	private static int directionFacing = 0; // (0 = north, 1 = east, 2 = south, 3 = west) will enum later
	private int moves = 0;
	private String commandOutput = "";
	private static Maze maze;
	private static ArrayList<String> commandOutArr = new ArrayList<String>();

	public enum SensorReading {
		WALL, SPACE, GOAL
	};

	/**
	 * Default constructor. Must be initialized using initialize() method.
	 */
	public RobotController() {
	}

	/**
	 * Sets up necessary variables for the robot controller to function properly.
	 * Parameter maze defines the maze with which the robot will interact with and
	 * cannot be null.
	 *
	 * @param newMaze a Maze object on which the robot will perform.
	 * @throws IllegalActionException
	 * @see Maze
	 */
	public static void initialize(Maze newMaze) throws IllegalActionException {
		// We pass a Maze instead of Cell since user Robot class cannot instantiate a
		// robot at a maze's goal this way. This makes it slightly more difficult to
		// cheat.
		if (maze == null) {
			maze = newMaze;
			currentCell = maze.getStartCell();
			commandOutArr
					.add("" + directionFacing + " " + currentCell.coordinates[0] + " " + currentCell.coordinates[1]);
		}
		// Guards against users trying to set the maze themselves. We should throw an
		// custom "IllegalAction" exception here
		else {
			throw new IllegalActionException("ILLEGALLY TRYING TO INITIALIZE MAZE");
		}
	}

	/**
	 * Attempts to move the robot forwards by one cell relative to the direction it
	 * is currently facing. If the cell in front of the robot is unoccupied and not
	 * a wall, the move forward instruction will succeed and the robot will move to
	 * the cell in front of it. Otherwise, the move forward instruction will fail
	 * and the robot will stay on the cell it is currently occupying.
	 */
	public void moveForwards() { // Moves forward by one cell

		// attemptedMove is set according to which cell is directly in front of the
		// robot relative to the direction it is facing
		Cell attemptedMove = null;
		switch (directionFacing) {
		case 0:
			attemptedMove = currentCell.getNorthCell();
			break;
		case 1:
			attemptedMove = currentCell.getEastCell();
			break;
		case 2:
			attemptedMove = currentCell.getSouthCell();
			break;
		case 3:
			attemptedMove = currentCell.getWestCell();
			break;
		}

		String commandOut = "";
		// Attempts to move the robot onto attemptedMove and reports success or failure.
		if (moveToCell(attemptedMove)) {
			commandOut = "MOVE FORWARDS - SUCCESS -> ";
		} else {
			commandOut = "MOVE FORWARDS - FAIL -> ";
		}
		commandOutput += commandOut + addTelemetry();
		commandOutArr.add("" + directionFacing + " " + currentCell.coordinates[0] + " " + currentCell.coordinates[1]);
	}

	/**
	 * Attempts to move the robot forwards by one cell relative to the direction it
	 * is currently facing. If the cell in front of the robot is unoccupied and not
	 * a wall, the move forward instruction will succeed and the robot will move to
	 * the cell in front of it. Otherwise, the move forward instruction will fail
	 * and the robot will stay on the cell it is currently occupying.
	 */
	public void moveForward() {
		moveForwards();
	}

	/**
	 * Attempts to move the robot backwards by one cell relative to the direction it
	 * is currently facing. If the cell behind the robot is unoccupied and not a
	 * wall, the move backwards instruction will succeed and the robot will move to
	 * the cell in front of it. Otherwise, the move backwards instruction will fail
	 * and the robot will stay on the cell it is currently occupying.
	 */
	public void moveBackwards() {
		// attemptedMove is set according to which cell is directly in front of the
		// robot relative to the direction it is facing
		Cell attemptedMove = null;
		switch (directionFacing) {
		case 0:
			attemptedMove = currentCell.getSouthCell();
			break;
		case 1:
			attemptedMove = currentCell.getWestCell();
			break;
		case 2:
			attemptedMove = currentCell.getNorthCell();
			break;
		case 3:
			attemptedMove = currentCell.getEastCell();
			break;
		}

		// Attempts to move the robot onto attemptedMove and reports success or failure.
		String commandOut = "";
		if (moveToCell(attemptedMove)) {
			commandOut = "MOVE BACKWARDS - SUCCESS -> ";
		} else {
			commandOut = "MOVE BACKWARDS - FAIL -> ";
		}
		commandOutput += commandOut + addTelemetry();
		commandOutArr.add("" + directionFacing + " " + currentCell.coordinates[0] + " " + currentCell.coordinates[1]);
	}

	/**
	 * Attempts to move the robot backwards by one cell relative to the direction it
	 * is currently facing. If the cell behind the robot is unoccupied and not a
	 * wall, the move backwards instruction will succeed and the robot will move to
	 * the cell in front of it. Otherwise, the move backwards instruction will fail
	 * and the robot will stay on the cell it is currently occupying.
	 */
	public void moveBackward() {
		moveBackwards();
	}

	/**
	 * Helper method that moves a robot to the cell "attemptedMove". Fails if
	 * attemptedMove is null. Succeeds otherwise.
	 * 
	 * @param attemptedMove Cell that the robot is trying to move to.
	 * @return true if move was successful, false otherwise.
	 */
	private boolean moveToCell(Cell attemptedMove) {

		// attemptedMove will only be null if there is a wall in the corresponding maze
		// representation that attemptedMove belongs to.
		if (attemptedMove != null) {
			currentCell = attemptedMove;
			moves++;
			return true;
		}
		// attemptedMove will only be non-null if there is an occupiable space in the
		// corresponding maze representation that attemptedMove belongs to.
		else {
			return false;
		}

	}

	/**
	 * Rotates a robot in place by 90 degrees.
	 */
	public void rotateClockwise() {
		// Rotation is accomplished utilizing modular arithmetic on directionFacing to
		// wrap directions on the interval [0, 3]
		directionFacing = (directionFacing + 1) % 4;

		// Report command being executed - unable to fail
		String commandOut = "ROTATE CLOCKWISE - SUCCESS -> ";
		commandOutput += commandOut + addTelemetry();
		commandOutArr.add("" + directionFacing + " " + currentCell.coordinates[0] + " " + currentCell.coordinates[1]);
		moves++;
	}

	/**
	 * Rotates a robot in place by -90 degrees.
	 */
	public void rotateCounterClockwise() {
		// Rotation is accomplished utilizing modular arithmetic on directionFacing to
		// wrap directions on the interval [0, 3]
		directionFacing = (directionFacing + 3) % 4; // +3 => +4 -1 (this is to avoid modular arithmetic with negative
														// numbers)

		// Report command being executed - unable to fail
		String commandOut = "ROTATE COUNTER-CLOCKWISE - SUCCESS -> ";
		commandOutput += commandOut + addTelemetry();
		commandOutArr.add("" + directionFacing + " " + currentCell.coordinates[0] + " " + currentCell.coordinates[1]);
		moves++;
	}

	/**
	 * Queries a sensor coming out of the front side of the robot. The sensor can
	 * only see the cell directly in front of it (directly in front of the robot).
	 * 
	 * @return SensorReading enum value based on what sensor reads
	 */
	public SensorReading queryFrontSensor() {
		return checkAdjacentCell(directionFacing);
	}

	/**
	 * Queries a sensor coming out of the right side of the robot. The sensor can
	 * only see the cell directly in front of it (directly to the right of the
	 * robot).
	 * 
	 * @return SensorReading enum value based on what sensor reads
	 */
	public SensorReading queryRightSensor() {
		return checkAdjacentCell((directionFacing + 1) % 4);
	}

	/**
	 * Queries a sensor coming out of the back side of the robot. The sensor can
	 * only see the cell directly in front of it (directly behind the robot).
	 * 
	 * @return SensorReading enum value based on what sensor reads
	 */
	public SensorReading queryBackSensor() {
		return checkAdjacentCell((directionFacing + 2) % 4);
	}

	/**
	 * Queries a sensor coming out of the left side of the robot. The sensor can
	 * only see the cell directly in front of it (directly to the left of the
	 * robot).
	 * 
	 * @return SensorReading enum value based on what sensor reads
	 */
	public SensorReading queryLeftSensor() {
		return checkAdjacentCell((directionFacing + 3) % 4);
	}

	/**
	 * Queries a sensor coming out of the bottom of the robot. The sensor can only
	 * see the cell directly in front of it (the cell the robot is currently on).
	 * 
	 * @return SensorReading enum value based on what sensor reads
	 */
	public SensorReading queryBelowSensor() {
		if (currentCell == null) {
			return SensorReading.WALL; // Wall
		} else if (!currentCell.isGoal()) {
			return SensorReading.SPACE; // Space
		} else {
			return SensorReading.GOAL; // Goal
		}
	}

	/**
	 * Helper method that checks the cell adjacent to the robot's current cell in an
	 * absolute cardinal direction. Parameter direction must be on the interval [0,
	 * 3]. 0 for north, 1 for east, 2 for south, 3 for west.
	 * 
	 * @param direction direction of cell we are checking relative to the robot's
	 *                  current cell.
	 * @return SensorReading enum value based on what sensor reads
	 */
	private SensorReading checkAdjacentCell(int direction) {
		Cell checkedCell = null;

		switch (direction) {
		case 0:
			checkedCell = currentCell.getNorthCell();
			break;
		case 1:
			checkedCell = currentCell.getEastCell();
			break;
		case 2:
			checkedCell = currentCell.getSouthCell();
			break;
		case 3:
			checkedCell = currentCell.getWestCell();
			break;
		}

		if (checkedCell == null) {
			return SensorReading.WALL; // Wall
		} else if (!checkedCell.isGoal()) {
			return SensorReading.SPACE; // Space
		} else {
			return SensorReading.GOAL; // Goal
		}

	}

	/**
	 * Getter for total moves taken by robot.
	 * 
	 * @return Total moves taken by robot.
	 */
	public int getMoves() {
		return moves;
	}

	/**
	 * Getter for the Cell this robot is currently occupying. Used in ASCII maze
	 * visualization only.
	 * 
	 * @return Robot's current cell object.
	 * @see Maze
	 */
	public Cell getCurrentCell() {
		return currentCell;
	}

	/**
	 * Prints out results of the robot's performance (total moves and detailed list
	 * of moves). Assumes/will only run if robot code did not crash or fail to halt.
	 */
	public void printResults() {
		System.out.println("Total moves: " + moves);
		System.out.println(commandOutput);
		if (currentCell.isGoal()) {
			commandOutArr.add("1 (Successfully ended on goal)");
		} else {
			commandOutArr.add("-1 (Did not successfully end on goal)");
		}
		PlaintextCommunicator comms = MazeGenerator4.in;
		comms.writeTo(commandOutArr);
	}

	/**
	 * Attaches coordinate/direction data to the output string to send to the
	 * front-end which will aid in formulating drawing instructions
	 */
	public String addTelemetry() {
		String directionString = "";
		switch (directionFacing) {
		case 0:
			directionString = "NORTH";
			break;
		case 1:
			directionString = "EAST";
			break;
		case 2:
			directionString = "SOUTH";
			break;
		case 3:
			directionString = "WEST";
			break;
		}
		String telemetry = "" + directionString + " (" + currentCell.coordinates[0] + ", " + currentCell.coordinates[1]
				+ ")\n";
		commandOutput += telemetry;
		return telemetry;
	}
}

/**
 * Defines an exception to throw when the user-submitted Robot class is trying
 * to cheat.
 */
class IllegalActionException extends Exception {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public IllegalActionException(String errorMessage) {
		super(errorMessage);
	}
}
