/**
 * This class defines the Cell objects with which the simulated robot will
 * interact. A Maze is a bidirectional graph of these Cell objects.
 * 
 * @see Maze
 */
public class Cell {
	private Cell northCell;
	private Cell eastCell;
	private Cell southCell;
	private Cell westCell;
	public int[] coordinates = new int[2]; //Setting as public for now
	
	private static boolean goalSet = false;
	private boolean isGoal = false;

	/**
	 * Constructor that instantiates a Cell object where params are other Cell
	 * objects which are adjacent to this cell.
	 * 
	 * @param nCell Cell to the north of this Cell.
	 * @param eCell Cell to the east of this Cell.
	 * @param sCell Cell to the south of this Cell.
	 * @param wCell Cell to the west of this Cell.
	 */
	public Cell(Cell nCell, Cell eCell, Cell sCell, Cell wCell) {
		northCell = nCell;
		eastCell = eCell;
		southCell = sCell;
		westCell = wCell;
	}

	/**
	 * Constructor that instantiates a cell object with no adjacent cells.
	 */
	public Cell() {
	}

	// Getters and setters for cells in all cardinal directions
	public Cell getNorthCell() {
		return northCell;
	}

	public Cell getEastCell() {
		return eastCell;
	}

	public Cell getSouthCell() {
		return southCell;
	}

	public Cell getWestCell() {
		return westCell;
	}

	public void setNorthCell(Cell northCell) {
		this.northCell = northCell;
	}

	public void setEastCell(Cell eastCell) {
		this.eastCell = eastCell;
	}

	public void setSouthCell(Cell southCell) {
		this.southCell = southCell;
	}

	public void setWestCell(Cell westCell) {
		this.westCell = westCell;
	}

	// Getters and setters for isGoal field
	// Not using javadoc so that IDE doesn't visibly display these functions - will
	// increase security by making these invisible eventually
	public boolean isGoal() {
		return isGoal;
	}

	public void setGoal(boolean isGoal) throws IllegalActionException {
		if(!goalSet) {
			this.isGoal = isGoal;
			goalSet = true;
		} else {
			throw new IllegalActionException("ILLEGALLY SETTING GOAL");
		}
	}
}