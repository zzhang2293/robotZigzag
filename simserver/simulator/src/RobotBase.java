/**
 * This class defines the interface that users must implement in their
 * Robot.java classes in order to properly run their robots.
 */
public abstract class RobotBase {

	/**
	 * Runs once upon starting your robot. This can be used to set up any useful
	 * variables required for your autonomous robot to function
	 */
	public abstract void init();

	/**
	 * This method is run periodically for every robot tick. You can treat this
	 * method like a loop. Use this to periodically schedule commands to your robot.
	 * Due to the nature of the robot software, periodic is limited to only running
	 * 5000 times.
	 */
	public abstract void periodic();

}