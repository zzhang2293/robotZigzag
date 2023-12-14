import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthenticatedContext } from "../../api/AuthenticationProvider";
import { toast, ToastContainer } from "react-toastify";
import CodeEditor from "../../components/ide_runner/CodeEditor.js";
import AnimationProvider, {
  AnimationContext,
} from "../../components/ide_runner/AnimationProvider";

const theme = createTheme();

export const TournamentMode = () => {
  const [maze, setMaze] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardNames, setLeaderboardNames] = useState([]);

  const { getLeaderboard, getTournaments, getProfile } =
    useContext(AuthenticatedContext);

  useEffect(() => {
    // Fetch tournaments from Django API
    getTournaments().then((tournaments) => {
      // Sort tournaments by stop date (closing date)
      const sortedTournaments = tournaments.sort(
        (a, b) => new Date(a.stop) - new Date(b.stop)
      );
      setTournaments(sortedTournaments);

      // Set the default selected tournament to the one that stops soonest
      const tournamentStopsSoonest = sortedTournaments[0];

      setSelectedTournament(tournamentStopsSoonest);

      // Fetch leaderboard data for the default selected tournament
      fetchLeaderboardData(tournamentStopsSoonest);
    });
  }, []);

  // Function to fetch leaderboard data for the selected tournament
  const fetchLeaderboardData = async (newTournament) => {
    try {
      const leaderboardData = (await getLeaderboard(newTournament)).data;
      setLeaderboardData(leaderboardData);
      const profileIds = leaderboardData.map((result) => result.profile);
      const profileNames = await Promise.all(
        profileIds.map((profileId) => getProfile(profileId))
      );
      setLeaderboardNames(profileNames);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  // Call back function to handle tournament selection
  const handleTournamentSelect = async (tournament) => {
    if (tournament) {
      console.log("Currently Selected tournament:", selectedTournament);
      setSelectedTournament(tournament);

      // Fetch leaderboard data for the selected tournament
    } else {
      console.error("Invalid tournament selected.");
    }
  };
  useEffect(() => {
    // This useEffect runs whenever selectedTournament changes
    console.log("Newly Selected tournament:", selectedTournament);
    if (selectedTournament) {
      fetchLeaderboardData(selectedTournament);
    }
  }, [selectedTournament]);

  // Function to submit user entry
  const onSubmit = (result) => {
    console.log("Result:", result);
    // Use maze object associated with ID at endpoint to submit user entry
    console.log("Submitting entry for tournament:", selectedTournament.id);
    // submitTournamentEntry(editor_contents, selectedTournament.id)
    if (result.data.status === "ok") {
      //onLoad();
      // Fetch and update leaderboard data for the selected tournament
      fetchLeaderboardData(selectedTournament);
    }
  };

  const onError = (error) => {
    toast.error(error.response.data.error);
  };

  // Function to determine background color based on rank for leaderboard
  const getBackgroundColor = (index) => {
    switch (index) {
      case 0:
        return "green";
      case 1:
        return "blue";
      case 2:
        return "yellow";
      case 3:
        return "orange";
      case 4:
        return "red";
      default:
        return "white"; // Default color for other ranks
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <h2>Current Tournament</h2>
            <AnimationProvider
              submitCallback={onSubmit}
              errorCallback={onError}
              tournamentID={selectedTournament?.id}
            >
              <CodeEditor disableSpeed={true} />
            </AnimationProvider>
          </Grid>

          <Grid item xs={4}>
            <div>
              <h2>Leaderboard</h2>
              {leaderboardData.length === 0 ? (
                <p>No leaderboard data available.</p>
              ) : (
                <ol style={{ fontSize: "2rem" }}>
                  {leaderboardData.map((result, index) => (
                    <li
                      key={index}
                      style={{ color: getBackgroundColor(index) }}
                    >
                      {leaderboardNames[index]} - {result.duration}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Grid>
        </Grid>

        <Paper style={{ marginTop: "16px" }}>
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
                    backgroundColor:
                      selectedTournament === tournament ? "#f0f0f0" : "white",
                    border:
                      selectedTournament === tournament
                        ? "2px solid #007bff"
                        : "2px solid #ccc",
                  }}
                >
                  <CardContent>
                    <Button
                      variant="outlined"
                      color="primary"
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
        </Paper>
      </Container>
    </ThemeProvider>
  );
};
