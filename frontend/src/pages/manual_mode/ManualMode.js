import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Maze from "../../components/Maze";
import InstructionsButton from "../../components/InstructionsButton.js";
import React, { useContext, useEffect, useState } from "react";
import ManualRobotProvider from "../../components/ManualRobotProvider";
import { AuthenticatedContext } from "../../api/AuthenticationProvider";

/**
 * ManualMode component represents the Practice Mode for manual maze-solving with a robot.
 *
 * @component
 */
export const ManualMode = () => {
  const theme = createTheme();

  // State to hold the maze configuration
  const [myMaze, setMyMaze] = useState(null);
  const [startCoords, setStart] = useState({ x: 0, y: 0 });
  const [goalCoords, setGoal] = useState({ x: 0, y: 0 });

  const { getRandomMaze } = useContext(AuthenticatedContext);

  // Fetch a maze configuration when the component mounts
  useEffect(() => {
    getRandomMaze().then((maze) => {
      setStart({ x: maze.start_row, y: maze.start_col });
      setGoal({ x: maze.end_row, y: maze.end_col });
      setMyMaze(maze);
    });
  }, [getRandomMaze]);

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <div>
          <Typography variant="h6">Practice Mode</Typography>
          <InstructionsButton
            title="Manual Practice Instructions:"
            content="Use your arrow keys to move and rotate the robot to solve the maze."
          />
          <ManualRobotProvider>
            <Maze
              mazeData={myMaze}
              heightFactor={1.5}
              userInput={true}
              start={startCoords}
              goal={goalCoords}
            />
          </ManualRobotProvider>
        </div>
      </Box>
    </ThemeProvider>
  );
};
