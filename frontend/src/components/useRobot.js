import { useContext, useEffect, useState } from "react";
import { RobotContext } from "./RobotProvider";

/**
 * Hook for accessing robot data
 * @param mazeData - The hex representation of the maze
 * @param getBinaryStr - A function to convert hex into a binary representation for the maze
 * @returns {{x: number, y: number, direction: string}} - The robot data
 */
export default function useRobot({ mazeData, getBinaryStr }) {
  const [robotState, setRobotState] = useState({
    x: 0,
    y: 0,
    direction: "up",
  });

  const {
    /**
     * Sets the command to be executed when a user input command occurs.
     *
     * @param {function} command - The function or callback to be executed.
     * @returns {void}
     */
    setOnCommand /**
     * Sets the telemetry callback function.
     *
     * @param {function} callback - The telemetry callback function to be set.
     * @returns {void}
     */,
    setOnTelemetry,
  } = useContext(RobotContext);

  /**
   * Set the robot control callbacks
   */
  useEffect(() => {
    setOnCommand(() => (keyCommand) => {
      if (!mazeData) {
        return;
      }

      let newX = robotState.x;
      let newY = robotState.y;
      let newDirection = robotState.direction;

      let cellBin = getBinaryStr(mazeData[robotState.y][robotState.x]);

      switch (keyCommand) {
        case "ArrowUp":
          // Move forward in the current direction
          if (robotState.direction === "right" && cellBin[1] === "0") {
            newX += 1;
          } else if (robotState.direction === "left" && cellBin[3] === "0") {
            newX -= 1;
          } else if (robotState.direction === "up" && cellBin[0] === "0") {
            newY -= 1;
          } else if (robotState.direction === "down" && cellBin[2] === "0") {
            newY += 1;
          }
          break;
        case "ArrowDown":
          // Move backward in the opposite direction
          if (robotState.direction === "right" && cellBin[3] === "0") {
            newX -= 1;
          } else if (robotState.direction === "left" && cellBin[1] === "0") {
            newX += 1;
          } else if (robotState.direction === "up" && cellBin[2] === "0") {
            newY += 1;
          } else if (robotState.direction === "down" && cellBin[0] === "0") {
            newY -= 1;
          }
          break;
        case "ArrowLeft":
          // Rotate 90 degrees counterclockwise
          if (robotState.direction === "right") {
            newDirection = "up";
          } else if (robotState.direction === "left") {
            newDirection = "down";
          } else if (robotState.direction === "up") {
            newDirection = "left";
          } else if (robotState.direction === "down") {
            newDirection = "right";
          }
          break;
        case "ArrowRight":
          // Rotate 90 degrees clockwise
          if (robotState.direction === "right") {
            newDirection = "down";
          } else if (robotState.direction === "left") {
            newDirection = "up";
          } else if (robotState.direction === "up") {
            newDirection = "right";
          } else if (robotState.direction === "down") {
            newDirection = "left";
          }
          break;
        default:
          return;
      }

      setRobotState({ x: newX, y: newY, direction: newDirection });
    });
    setOnTelemetry(() => (telemetryData) => {
      if (!mazeData) {
        return;
      }
      setRobotState(telemetryData);
    });
  }, [getBinaryStr, mazeData, robotState, setOnCommand, setOnTelemetry]);

  return robotState;
}
