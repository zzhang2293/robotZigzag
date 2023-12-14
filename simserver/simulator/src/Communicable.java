import java.util.ArrayList;

public interface Communicable {
		
	ArrayList<String> readFrom();
	
	void writeTo(ArrayList<String> toWrite);

}
