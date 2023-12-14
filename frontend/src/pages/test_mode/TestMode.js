import React, { useContext, useEffect, useState } from "react";
import Maze from "../../components/Maze.js";
import CodeEditor from "../../components/ide_runner/CodeEditor.js";
import InstructionsButton from "../../components/InstructionsButton.js";

import { Container, Grid, Typography } from "@mui/material"; // import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import axios from "axios";
import { AuthenticatedContext } from "../../api/AuthenticationProvider";
import { ToastContainer } from "react-toastify";
import AnimationProvider from "../../components/ide_runner/AnimationProvider"; // import axios from "axios";

// import axios from "axios";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

/**
 * Creates a Promise that resolves after a specified delay.
 *
 * @param {number} delay - The delay in milliseconds before the Promise is resolved.
 * @return {Promise} - A Promise that resolves after the specified delay.
 */
function timeout(delay) {
  return new Promise((res) => setTimeout(res, delay));
}

/**
 * Represents the TestMode component. This is where users can run their java code and see the performance.
 *
 * @returns {JSX.Element} The TestMode component.
 */
export const TestMode = () => {
  const [myMaze, setMyMaze] = useState(null);
  const [startCoords, setStart] = useState({ x: 0, y: 0 });
  const [goalCoords, setGoal] = useState({ x: 0, y: 0 });

  const { getRandomMaze, submitUserEntry } = useContext(AuthenticatedContext);

  // Array of string values
  const stringValues = [
    "moveForwards() - Moves forward by one cell",
    "moveBackwards() - Moves backward by one cell",
    "rotateClockwise() - Rotates robot in place by 90 degrees.",
    "rotateCounterClockwise() - Rotates a robot in place by -90 degrees.",
    "queryFrontSensor(), queryRightSensor(), queryLeftSensor(), queryBackSensor() - Queries a sensor coming out of the specified side of the robot. The sensor can only see the cell directly in front of it (directly to the front/right/left/back). Returns -1 if sensor sees a wall, 1 if sensor sees an empty space, and 0 if sensor sees the goal.",
  ];

  // Function to render the array as a list
  const renderList = () => {
    return (
      <List>
        {stringValues.map((value, index) => (
          <ListItem key={index}>{value}</ListItem>
        ))}
      </List>
    );
  };

  // Fetch a maze configuration when the component mounts
  useEffect(() => {
    getRandomMaze().then((maze) => {
      setStart({ x: maze.start_row, y: maze.start_col });
      setGoal({ x: maze.end_row, y: maze.end_col });
      setMyMaze(maze);
    });
  }, [getRandomMaze]);

  console.log("TestMode render");

  return (
    <Box>
      <ToastContainer />
      <Typography variant="h6">Test Mode</Typography>
      <Container maxWidth="lg">
        {/* Top Title Bar */}
        <div id="title-bar">
          <InstructionsButton
            title="Test Mode Instructions:"
            content={
              <Box>
                <p>
                  Move the robot from the start to the end of the maze by
                  writing a java program in the IDE. Press the play putton to
                  run the program.
                </p>
                <p>
                  Use the the following RobotController function library to
                  specify movements:
                </p>
                {renderList()}
              </Box>
            }
          />
        </div>

        {/* Main Content */}
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <AnimationProvider>
            {/* Text Box for Coding (right side) */}
            <Grid item xs={12} md={6}>
              <CodeEditor />
            </Grid>

            {/* Maze (left side) */}
            <Grid item xs={12} md={6}>
              <Maze
                mazeData={myMaze}
                widthFactor={2.5}
                start={startCoords}
                goal={goalCoords}
              />
            </Grid>
          </AnimationProvider>
        </Grid>
      </Container>
    </Box>
  );
};
