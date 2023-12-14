import React, { useContext, useEffect, useState } from "react";
// Material UI components
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import LogoBox from "@mui/material/Box";
import Logo from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Copyright from "./Copyright";
import { useNavigate } from "react-router-dom";
import { AuthenticatedContext } from "../../api/AuthenticationProvider";

/**
 * The Login form UI and its corresponding authentication functions
 * as well as error message display funcions.
 *
 * @constructor
 * @returns Login form UI
 */
export const Login = () => {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // TODO: error messages
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate(); // Router navigation function
  const { doLogin, isAuthenticated, userProfile } =
    useContext(AuthenticatedContext);

  // MUI theme set
  const theme = createTheme();

  useEffect(() => {
    if (isAuthenticated) {
      nav("/user/dashboard");
    }
  }, [isAuthenticated, nav]);

  function handleLogin(e) {
    e.preventDefault();
    doLogin(username, password);
  }

  // TODO: Loading screen after logging in - Suspense/Toastify
  // Possible Loading spinner: https://www.npmjs.com/package/react-loader-spinner
  // Renders Login form with MUI components
  return (
    <ThemeProvider theme={theme}>
      {/* MUI CssBaseline and container boxing*/}
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Login Logo display with App name (box component)*/}
          <LogoBox
            justifyContent="center"
            display="flex"
            flexDirection="column-right"
            alignItems="center"
            sx={{
              mx: "auto",
              width: 200,
              p: 1,
              m: 0,
            }}
          >
            {/* Logo image*/}
            {/* TODO: Change to SVG*/}
            <Logo
              component="img"
              sx={{
                height: 100,
                width: 100,
                maxHeight: { xs: 70, md: 70 },
                maxWidth: { xs: 70, md: 70 },
                borderRadius: 2,
                m: 1.5,
              }}
              alt="ZigZag Logo"
              src="logo512.png"
            />
            {/* TODO: Change Font to Chip 1*/}
            <Typography
              component="h1"
              variant="h3"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ZigZag
            </Typography>
          </LogoBox>
          {/* Login credential fields */}
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* Username input field */}
            <TextField
              onChange={(e) => setUser(e.target.value)}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            {/* Password input field */}
            {/* Displays error messages for the form in red with MUI's helperText */}
            <TextField
              onChange={(e) => setPass(e.target.value)}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="password"
              helperText={<Typography color="red">{errorMessage}</Typography>}
            />
            {/* Checkbox to show password*/}
            {/* Changes password field display (type) from '***' to visible text with onChange() */}
            <FormControlLabel
              control={
                <Checkbox
                  size="xs"
                  value={showPassword}
                  onChange={() => setShowPassword((prev) => !prev)}
                  color="primary"
                />
              }
              label={<Typography fontSize={12}>Show Password</Typography>}
            />
            {/* Log in button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};
