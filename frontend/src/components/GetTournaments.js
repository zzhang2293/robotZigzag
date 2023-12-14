import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import axios from "axios";
import { AuthenticatedContext } from "../api/AuthenticationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

/*
 * Represents a list of tournaments that are currently active.
 *
 * @param {function} onTournamentSelect - A callback function that is called when a tournament is selected.
 * @returns {JSX.Element} - The TournamentList component.
 */
function TournamentList({ onTournamentSelect }) {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const { getTournaments } = useContext(AuthenticatedContext);

  useEffect(() => {
    // Fetch tournaments from Django API
    getTournaments().then((tournaments) => {
      setTournaments(tournaments);
    });
  }, [getTournaments]);

  const handleTournamentSelect = (tournament) => {
    setSelectedTournament(tournament);
    if (onTournamentSelect) {
      onTournamentSelect(tournament); // Call a callback function with the selected tournament
    }
  };

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h4">Tournaments</Typography>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
          }}
        >
          {tournaments.map((tournament) => (
            <Card
              key={tournament.id}
              style={{
                margin: "10px",
                minWidth: "200px",
                flex: "0 0 auto",
              }}
            >
              <CardContent>
                <Button
                  variant="outlined"
                  color={
                    selectedTournament === tournament ? "primary" : "default"
                  }
                  onClick={() => handleTournamentSelect(tournament)}
                >
                  {tournament.name}
                </Button>
                <Typography>Start Date: {tournament.start}</Typography>
                <Typography>Stop Date: {tournament.stop}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default TournamentList;
