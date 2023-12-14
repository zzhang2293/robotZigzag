import Box from "@mui/material/Box";
import React, { useContext, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthenticatedContext } from "../../api/AuthenticationProvider";
import { useBackend } from "../../api/useBackend";
import { toast, ToastContainer } from "react-toastify";

/**
 * Settings page UI - managing display name and avatar
 * User can change display name and avatar upon submitting form buttons.
 * TODO: Auth header implementation of form submissions
 * TODO: array of avatars (folder)
 * @returns The rendered MUI components.
 */
export const Settings = () => {
  const theme = createTheme();
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newTourneyName, setNewTourneyName] = useState("");
  const { userProfile, updateDisplayName, getRandomMaze, createTournament } =
    useContext(AuthenticatedContext);

  const handleNameChange = (e) => {
    e.preventDefault();

    if (userProfile && newDisplayName.trim() !== "") {
      updateDisplayName(userProfile.id, newDisplayName)
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("No input");
    }
  };

  const handleCreateTournament = (e) => {
    e.preventDefault();
    getRandomMaze().then((randomMaze) => {
      createTournament(newTourneyName, randomMaze.id)
        .then(() => {
          toast.success("Created a new tournament!");
          setNewTourneyName("");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to create a tournament - try again later!");
        });
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Box>
        <div>
          <Typography variant="h6">Settings</Typography>
          {/* Change Name Form */}
          {/* User types desired display name and clicks submit button to make change */}
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Display Name</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                component="form"
                onSubmit={handleNameChange}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="New Display Name"
                  name="username"
                  autoComplete="username"
                  autoFocus
                />
                {/* Submission button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Change Display Name
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
          {/* Conditional for the admin-only button */}
          {userProfile && userProfile.status === "admin" && (
            <Box
              component="form"
              onSubmit={handleCreateTournament}
              noValidate
              sx={{ mt: 1 }}
            >
              <Typography>Admin - Create Tournament </Typography>
              <TextField
                onChange={(e) => setNewTourneyName(e.target.value)}
                margin="normal"
                fullWidth
                id="username"
                label="New Tournament Name"
                name="username"
                autoComplete="username"
                autoFocus
              />
              {/* Submission button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create Tournament
              </Button>
            </Box>
          )}
        </div>
      </Box>
    </ThemeProvider>
  );
};
