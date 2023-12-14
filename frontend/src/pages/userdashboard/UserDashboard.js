import React, { useContext, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CodeIcon from "@mui/icons-material/Code";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ForumIcon from "@mui/icons-material/Forum";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import ChatWindow from "./chatwindow/ChatWindow";
import { AuthenticatedContext } from "../../api/AuthenticationProvider";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const userDrawerWidth = 240;

const DashboardBody = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${userDrawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DashboardAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${userDrawerWidth}px)`,
    marginLeft: `${userDrawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DashboardDrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

/**
 * Renders the user dashboard UI for the logged-in user.
 * It displays a sidebar navigation (w/ buttons) and user information.
 * The sidebar (MUI Drawer component) displays buttons and icons vertically
 * with List component.
 * Upon clicking, the buttons display their respective pages in the main body
 * of the dashboard page (using Outlet and useNavigate from react-reuter-dom)
 *
 * @constructor
 * @returns User Dashboard UI
 */
export const UserDashboard = () => {
  const nav = useNavigate();
  const theme = createTheme();
  const [open, setOpen] = useState(false);
  const [showTextBox, setShowTextBox] = useState(false); // Add state variable to manage textbox visibility

  const { userProfile, doLogout } = useContext(AuthenticatedContext);

  const handleChatButtonClick = () => {
    setShowTextBox(!showTextBox); // Toggle textbox visibility on chat button click
  };
  const handleDashboardDrawerOpen = () => {
    setOpen(true);
  };

  const handleDashboardDrawerClose = () => {
    setOpen(false);
  };

  // User Dashboard with MUI components
  // open by default change
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <DashboardAppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDashboardDrawerOpen}
              edge="start"
              sx={{ marginRight: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ZigZag
            </Typography>
            <IconButton
              color="inherit"
              edge="end"
              sx={{ marginLeft: "auto" }}
              onClick={handleChatButtonClick}
            >
              <ForumIcon />
            </IconButton>
          </Toolbar>
        </DashboardAppBar>
        {/* Side navigation bar (displayed on left) component*/}
        <Drawer
          sx={{
            width: userDrawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: userDrawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DashboardDrawerHeader>
            <IconButton onClick={handleDashboardDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DashboardDrawerHeader>
          <Divider />
          <List>
            <ListItem key="Dashboard" disablePadding>
              <ListItemButton onClick={() => nav("dashboard")}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Manual Practice" disablePadding>
              <ListItemButton onClick={() => nav("practice")}>
                <ListItemIcon>
                  <KeyboardIcon />
                </ListItemIcon>
                <ListItemText primary="Manual Practice" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Test Code" disablePadding>
              <ListItemButton onClick={() => nav("test")}>
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText primary="Test Code" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Enter Tournament" disablePadding>
              <ListItemButton onClick={() => nav("tournamentmode")}>
                <ListItemIcon>
                  <EmojiEventsIcon />
                </ListItemIcon>
                <ListItemText primary="Enter Tournament" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem key="Settings" disablePadding>
              <ListItemButton onClick={() => nav("settings")}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Logout" disablePadding>
              <ListItemButton onClick={doLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <DashboardBody open={open}>
          <DashboardDrawerHeader />
          <Typography variant="h6">
            Welcome, {userProfile?.display_name}.
          </Typography>
          <Outlet context={[userProfile]} />
        </DashboardBody>
        {showTextBox && (
          <Box
            edge="end"
            sx={{
              marginLeft: "auto",
              marginTop: 10,
            }}
          >
            <ChatWindow roomName={"general"} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};
