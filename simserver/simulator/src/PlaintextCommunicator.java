import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Scanner;

public class PlaintextCommunicator implements Communicable {

	// Docker essentially creates a file on my system - we can slap it in the same
	// directory where this program is housed
	// Its just like reading from a normal file (use JSONObject - there are
	// tutorials online)

	private String inFile = "";
	private String outFile = "";

	/**
	 * Constructor for a plaintext communicator that specifies filenames for input
	 * and output
	 * 
	 * @param inFile  filename of file to be read from
	 * @param outFile filename of file to be written to
	 */
	public PlaintextCommunicator(String inFile, String outFile) {
		this.inFile = inFile;
		this.outFile = outFile;
	}

	/**
	 * Attempts to write data object to file with name stored in "outfile" specified
	 * when instantiated.
	 * 
	 * @param toWrite ArrayList of strings to write to "outfile".txt
	 */
	@Override
	public void writeTo(ArrayList<String> toWrite) {
		// TODO Auto-generated method stub
		try {
			
			BufferedWriter myWriter = new BufferedWriter(new FileWriter(outFile));
			for(String line : toWrite) {
				myWriter.write(line);
				myWriter.newLine();
			}
			myWriter.close();
		} catch (IOException e) {
			System.out.println("An error occurred.");
			e.printStackTrace();
		}

	}

	/**
	 * Gets text data from file with name stored in "inFile" specified when
	 * instantiated.
	 * 
	 * @return ArrayList of strings containing data in "inFile".txt
	 */
	@Override
	public ArrayList<String> readFrom() {
		// TODO Auto-generated method stub
		ArrayList<String> fileToList = new ArrayList<String>();
		try {
			File myObj = new File(inFile);
			Scanner myReader = new Scanner(myObj);
			while (myReader.hasNextLine()) {
				String data = myReader.nextLine();
				fileToList.add(data);
			}
			myReader.close();
		} catch (FileNotFoundException e) {
			System.out.println("An error occurred.");
			e.printStackTrace();
		}
		return fileToList;
	}

	public String getInFile() {
		return inFile;
	}

	public String getOutFile() {
		return outFile;
	}

	public void setInFile(String inFile) {
		this.inFile = inFile;
	}

	public void setOutFile(String outFile) {
		this.outFile = outFile;
	}

}
