/**
 * This class attempts unsafely runs our Simulation service. This class is made
 * save by its inability to be invoked directly, and instead must be invoked by
 * the Simulation class.
 * 
 * @see Simulation
 */
public class Driver {

	/**
	 * This method rawly executes the function of our Simulation services.
	 * 
	 * @see Simulation
	 */
	public static void main(String[] args) {
		// Should instead get data from backend to generate maze
		// Maze myMaze = new Maze(7, 7); // Binary maze rep
		Maze myMaze = new Maze(); // Hex maze rep

		// Should instead get data from backend - user submitted code file
		Robot userRobot = new Robot(); // app/volume

		// Connects maze and robot framework to properly interact with each other
		try {
			RobotController.initialize(myMaze);
		} catch (IllegalActionException e) {
			// TODO Auto-generated catch block
			System.err.println("RobotController never initialized!");
		}

		// Runs user robot code and prints out results/errors
		userRobot.init();
		// Gives a loop limit of 5000 iterations to show "infinite loop" nature of
		// "timeouts"
		for (int i = 0; i < 5000; i++) {
			userRobot.periodic();
		}

		// userRobot.execute();
		RobotController rc = userRobot.rc;
		rc.printResults();
	}

}
