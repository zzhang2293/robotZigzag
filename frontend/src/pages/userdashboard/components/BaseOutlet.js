// import "./App.css";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import axios from "axios";
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

export const BaseOutlet = () => {
  // const [currentUser, setCurrentUser] = useState();
  // Default state for operating mode
  const theme = createTheme();

  // Fetch user crdentials from endpoint and set the user state.
  // Refer to useEffect() in Login.js for functionality.

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <div>
          <Typography variant="h6">Dashboard</Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Activity</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Replace with graphic</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Tournament Stats</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Replace with graphic</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography>Mazes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Replace with graphic</Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </Box>
    </ThemeProvider>
  );
};
