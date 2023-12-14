import React, { useContext, useEffect } from "react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableRow,
} from "@mui/material";
import "./Maze.css";
import useRobot from "./useRobot";
import useMazeDim from "./useMazeDim";
import * as PropTypes from "prop-types";
import { AnimationContext } from "./ide_runner/AnimationProvider";

MazeCell.propTypes = {
  hexChar: PropTypes.any,
  robotState: PropTypes.any,
  j: PropTypes.any,
  i: PropTypes.number,
  robotSize: PropTypes.number,
};

export default function Maze({
  mazeData,
  start,
  goal,
  widthFactor,
  heightFactor,
}) {
  const maze = mazeData?.level_configuration;
  const numRows = !maze ? 0 : maze.length;
  const numCols = !maze ? 0 : maze[0].length;
  const robotState = useRobot({ mazeData: maze, getBinaryStr: getBinaryStr });
  const maxDim = useMazeDim(heightFactor, widthFactor);
  const robot_size = Math.floor(maxDim / (Math.max(numCols, numRows) * 2));

  const { setMazeID } = useContext(AnimationContext);

  useEffect(() => {
    if (!setMazeID) {
      return;
    }
    setMazeID(mazeData?.id);
    console.log("setting maze id", mazeData?.id);
  }, [mazeData]);

  if (!maze) {
    return <CircularProgress />;
  }

  return (
    <Table
      sx={{
        [`& .${tableCellClasses.root}`]: {
          borderBottom: "none",
        },
        border: "5px solid black",
      }}
      style={{
        tableLayout: "fixed",
        width: `${maxDim}px`,
        height: `${maxDim}px`,
      }}
    >
      <TableBody>
        {maze.map((row, i) => {
          return (
            <TableRow key={`${i}`}>
              {row.map((cell, j) => {
                return (
                  <MazeCell
                    hexChar={cell}
                    robotState={robotState}
                    j={j}
                    i={i}
                    robotSize={robot_size}
                    key={`${i}.${j}`}
                    start={start}
                    goal={goal}
                  />
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function MazeCell({ i, j, robotState, hexChar, robotSize, start, goal }) {
  const isStartCell = i === start.x && j === start.y;
  const isGoalCell = i === goal.x && j === goal.y;

  if (!robotState) {
    return <CircularProgress />;
  }

  return (
    <TableCell
      display="flex"
      className={
        convertHexToClasses(hexChar) +
        (isStartCell ? " start" : "") +
        (isGoalCell ? " goal" : "")
      }
      style={{
        "--square-size": `${robotSize}px`,
        "--triangle-long": `${Math.floor(robotSize / 2)}px`,
        "--triangle-short": `${Math.floor(robotSize / 3)}px`,
      }}
    >
      {i === robotState.y && j === robotState.x && (
        <div
          className={`robot ${robotState.direction}`}
          style={{
            width: `${robotSize}px`,
            height: `${robotSize}px`,
          }}
        >
          <div
            className="robot-triangle"
            style={{
              transform: `rotate(${robotDirectionToAngle(
                robotState.direction
              )})`,
            }}
          ></div>
        </div>
      )}
    </TableCell>
  );
}

function robotDirectionToAngle(direction) {
  switch (direction) {
    case "up":
      return "0deg";
    case "down":
      return "180deg";
    case "left":
      return "-90deg";
    case "right":
      return "90deg";
    default:
      return "0deg";
  }
}

/**
 * Convert a hex character to its binary string representation
 * @param {string} hexChar
 */
function getBinaryStr(hexChar) {
  return parseInt(hexChar, 16).toString(2).padStart(4, "0");
}

/**
 * Converts a hexadecimal character into an array of CSS classes defining the walls for that cell in the maze.
 *
 * @param {string} hexChar - The hexadecimal character to convert.
 * @returns {string} - A string containing the CSS classes separated by spaces.
 */
const convertHexToClasses = (hexChar) => {
  let binaryStr = getBinaryStr(hexChar);
  let classes = ["maze-cell"];
  if (binaryStr[0] === "1") {
    classes.push("maze-cell-north");
  }
  if (binaryStr[1] === "1") {
    classes.push("maze-cell-east");
  }
  if (binaryStr[2] === "1") {
    classes.push("maze-cell-south");
  }
  if (binaryStr[3] === "1") {
    classes.push("maze-cell-west");
  }

  return classes.join(" ");
};
