import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.Permission;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * This class attempts to run our Simulation service in a safe environment. This
 * class is the only class that should be invoked by any of our other services.
 * It is here where sufficient results and error reporting are sent back to our
 * other services.
 */
public class Simulation {
	/**
	 * Runs our Simulation service while ensuring security. Executes the unsafe code
	 * in its own thread. A custom SecurityManager is being used to disallow certain
	 * actions. There is a thread timeout to guard against non-terminating code.I
	 * Before termination, this method also handles reporting results of the attempt
	 * to run the thread back to front-end.
	 */
	@SuppressWarnings("deprecation")
	public static void main(String[] args) {
		// Set up a Security Manager
		if (System.getSecurityManager() == null) {
			System.setSecurityManager(new CustomSecurityManager());
		}

		try {
			// Load the class dynamically using its name
			Class<?> driverClass = Class.forName("Driver");

			// Create an instance of the class (assuming it has a default constructor)
			// Object driverObject = driverClass.getDeclaredConstructor().newInstance();

			// Get the method named "main" with a String array parameter
			Method mainMethod = driverClass.getMethod("main", String[].class);

			// Create an array of arguments if needed
			String[] arguments = new String[0];

			// Create a separate thread to execute the loaded code
			Thread executionThread = new Thread(() -> {
				try {
					// Invoke the 'main' method with the provided arguments
					mainMethod.invoke(null, (Object) arguments);
				} catch (InvocationTargetException e) {
					// Handle exceptions thrown by the loaded code
					Throwable targetException = e.getTargetException();
					System.err.println("Error in loaded code:" + targetException.getMessage());
					writeErrorsToLog("Error in loaded code:" + targetException.getMessage());
					e.printStackTrace();
				} catch (Exception e) {
					// Handle other exceptions
					System.err.println("An error occurred:\n" + e.getMessage());
					writeErrorsToLog("An error occurred:\n" + e.getMessage());
				}
			});

			// Set a timeout for the execution thread (in milliseconds)
			int timeoutMillis = 5000; // 5 seconds
			executionThread.start();
			executionThread.join(timeoutMillis);

			// If the execution thread is still alive, interrupt it and terminate.
			if (executionThread.isAlive()) {
				executionThread.interrupt();
				executionThread.stop();
				System.err.println("Execution timed out. Terminating the thread.");
				writeErrorsToLog("Execution timed out. Maybe there was an infinite loop?");
				// Fetching move-list from timeout happens after 5000 runs of periodic method in
				// Driver class. Should refactor to make sure 5000 runs of periodic actually happen?
			}
		} catch (ClassNotFoundException e) {
			System.err.println("Driver class not found");
		} catch (Exception e) {
			// NOTE: This actually does not catch compiler errors: Instead, we are writing
			// results of javac to an error.txt file
			writeErrorsToLog(e.getMessage());
			System.err.println("An error occurred:\n" + e.getMessage());
		}
	}

	/**
	 * Writes a descriptive error to the log file. This only happens in the case of
	 * runtime/logic errors. Compiler errors are instead given to another error.txt
	 * file by writing results of javac. This is because of Eclipse's ECJ allowing
	 * for partial compilation to catch compiler errors locally, but not in our
	 * service.
	 */
	private static void writeErrorsToLog(String message) {
		ArrayList<String> commandOutArr = new ArrayList<String>();
		final String INPUT_FILE = "simservicein.txt";
		final String OUTPUT_FILE = "simserviceout.txt";
		PlaintextCommunicator comms = new PlaintextCommunicator(INPUT_FILE, OUTPUT_FILE);
		commandOutArr.add("-1");
		commandOutArr.add(message);
		comms.writeTo(commandOutArr);

	}
}

/**
 * This class defines our own SecurityManager that we use to provide security
 * when running user code. This is done by disallowing certain actions based on
 * what the main method in the above class is attempting to execute.
 */
class CustomSecurityManager extends SecurityManager {

	// Below are finals containing out set of allowances
	private static final String ALLOWED_HOST = ""; // Need to update to our service host and por
	private static final int ALLOWED_PORT = 80;

	private static final Set<String> ALLOWED_PROPERTIES = new HashSet<>(Arrays.asList("jdk.proxy.ProxyGenerator.v49",
			"java.locale.providers", "locale.resources.debug", "resource.bundle.debug"
	// We can add allowed properties within this hashset
	));

	private static final Set<String> ALLOWED_PACKAGES = new HashSet<>(
			Arrays.asList("java.io", "java.lang", "java.lang.invoke", "java.lang.reflect", "java.util", "java.security",
					"sun.util.locale.provider", "org.json.simple.parser", "org.json.simple"
			// We can add allowed packages within this hashset
			));

	// The two below methods are depreciated and must use check perm instead
	/**
	 * Disallows access to classes by reflection
	 *
	 * @param clazz the class being checked
	 * @param which overridden
	 * @throws SecurityException
	 */
	/*
	 * public void checkMemberAccess(Class<?> clazz, int which) { // Prevent access
	 * to private fields, methods, and other non-public members if
	 * (!isAllowedAccess(clazz)) { throw new
	 * SecurityException("Reflective access to class " + clazz.getName() +
	 * " is not allowed."); } }
	 */

	/**
	 * Helper method which locks reflective access to the Driver class only - still
	 * unsafe, as it only checks the name and doesn't guard against fake/duplicate
	 * drivers
	 *
	 * @param clazz the package being
	 * @return true if clazz is Driver, false otherwise
	 */
	/*
	 * private boolean isAllowedAccess(Class<?> clazz) {
	 * System.err.println(clazz.getName()); return false; if (clazz.getName() ==
	 * "Driver") { return true; } else { return false; } }
	 */

	/**
	 * Disallows the access of certain packages.
	 *
	 * @param pkg the package being accessed
	 * @throws SecurityException
	 */
	@Override
	public void checkPackageAccess(String pkg) {
		if (!ALLOWED_PACKAGES.contains(pkg)) {
			throw new SecurityException("Access to the specified package (" + pkg + ") is not allowed.");
		}
	}

	/**
	 * Disallows the creation of packages.
	 *
	 * @param pkg the package being checked
	 * @throws SecurityException
	 */
	@Override
	public void checkPackageDefinition(String pkg) {
		if (!ALLOWED_PACKAGES.contains(pkg)) {
			throw new SecurityException("Definition of classes in the specified package (" + pkg + ") is not allowed.");
		}
	}

	/**
	 * Disallows the access of certain properties.
	 *
	 * @param key the key of the property being utilized
	 * @throws SecurityException
	 */
	@Override
	public void checkPropertyAccess(String key) {
		if (!ALLOWED_PROPERTIES.contains(key)) {
			throw new SecurityException("Access to the specified system property (" + key + ") is not allowed.");
		}
	}

	/**
	 * Disallows the reading of certain files. This method currently is not fully
	 * secure, since it only checks if the filename contains the names of required
	 * classes for our service.
	 *
	 * @param file file path of file being requested to access
	 * @throws SecurityException
	 */
	@Override
	public void checkRead(String file) {
		// Contains the names of the files that we are accessing
		boolean filenameValid = file.contains("Driver.class") || file.contains("Cell.class")
				|| file.contains("RobotController.class") || file.contains("Maze.class") || file.contains("Robot.class")
				|| file.contains("MazeGenerator2.class") || file.contains("MazeGenerator.class")
				|| file.contains("IllegalActionException.class") || file.contains("MazeGenerator3.class")
				|| file.contains("MazeGenerator4.class") || file.contains("PlaintextCommunicator.class")
				|| file.contains("Communicable.class") || file.contains("simservicein.txt")
				|| file.contains("RobotBase.class") || file.contains("SensorReading.class");
		if (!filenameValid) {
			System.err.println("Read not allowed: " + file);
			throw new SecurityException("Read not allowed for file: " + file);
		}
	}

	/**
	 * Disallows writing to files of any sort.
	 *
	 * @param file file path of file being written to
	 * @throws SecurityException
	 */
	@Override
	public void checkWrite(String file) {
		boolean filenameValid = file.contains("simserviceout.txt");
		if (!filenameValid) {
			throw new SecurityException("Write not allowed for file: " + file);
		}
	}

	/**
	 * Disallows the execution of all external commands.
	 *
	 * @param cmd the command that is trying to be executed
	 * @throws SecurityException
	 */
	@Override
	public void checkExec(String cmd) {
		throw new SecurityException("Execution not allowed for command: " + cmd);
	}

	/**
	 * Disallows premature termination of our system.
	 *
	 * @param status the status with which System.exit() was called
	 * @throws SecurityException
	 */
	@Override
	public void checkExit(int status) {
		throw new SecurityException("System.exit(" + status + ") is not allowed.");
	}

	/**
	 * Disallows establishing connections to anywhere but our allowed host and port
	 *
	 * @param host host name being attempted
	 * @param port port number being attempted
	 * @throws SecurityException
	 */
	@Override
	public void checkConnect(String host, int port) {
		if (!host.equals(ALLOWED_HOST) || port != ALLOWED_PORT) {
			throw new SecurityException("Connection to " + host + " on port " + port + " is not allowed.");
		}
	}

	/**
	 * Disallows accepting connections on invalid ports
	 *
	 * @param host host name being attempted
	 * @param port port number being attempted
	 * @throws SecurityException
	 */
	@Override
	public void checkAccept(String host, int port) {
		if (!host.equals(ALLOWED_HOST) || port != ALLOWED_PORT) {
			throw new SecurityException("Accepting connections on port " + port + " is not allowed.");
		}
	}

	/**
	 * Disallows specific permissions. Currently only disallows setting a new
	 * security manager to our service.
	 *
	 * @param perm Permission being utilized.
	 * @throws SecurityException
	 */
	@Override
	public void checkPermission(Permission perm) {
		// Disallow setting a new security manager
		if (perm.getName().equals("setSecurityManager")) {
			throw new SecurityException("Setting a new Security Manager is not allowed.");
		}

		// Disallow reflective access
		if (perm.getName().equals("reflectPermission")) {
			// Get the class name for which reflective access is requested
			String className = perm.getActions();
			if (className.equals("accessDeclaredMembers")) {
				// Allow reflective access to MazeGenerator3 class
				if ("MazeGenerator3".equals(className)) {
					return;
				}
			}
			// If reflective access is not allowed for the specific class, throw a
			// SecurityException
			throw new SecurityException("Reflective access is not allowed for class: " + className);
		}

		// Call the parent class implementation to check for other permissions
		// super.checkPermission(perm); //Commented out because this was disabling stop
		// thread
	}
}
