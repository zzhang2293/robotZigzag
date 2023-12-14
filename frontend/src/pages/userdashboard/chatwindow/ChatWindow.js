import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Button,
  List,
  ListItem,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import useWebSocket from "react-use-websocket";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

/**
 * The chat element
 * @returns {Element}
 * @constructor
 */
export default function ChatWindow({ roomName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(1);

  /**
   * Stored reference to the AceEditor object
   * @type {React.MutableRefObject<ListItem>}
   */
  const messageListRef = useRef(null);

  /**
   * The websocket protocol to use
   * @type {string}
   */
  const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";

  /**
   * The host to use when connecting to the websocket
   * @type {string}
   */
  const host = window.location.host;

  /**
   * The build websocket connection string
   * @type {string}
   */
  const wsUrl = `${protocol}${host}/backend/ws/chat/${roomName}?token=${localStorage.getItem(
    "token"
  )}`;

  /**
   * Websocket hook to connect to backend
   */
  useWebSocket(wsUrl, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
    onMessage: (message) => {
      let data = JSON.parse(message.data);
      setMessages((prev) => [...prev, data]);
      console.log(data);
      if ("count" in data) {
        setOnlineUsers(data.count);
      }
    },
  });

  /**
   * Event handler for when the user wishes to send a message.
   */
  const handleSendMessage = () => {
    // If the message is not empty/whitespace
    if (newMessage.trim() !== "") {
      axios
        .post(
          "/backend/chat/new_message",
          { room: roomName, message: newMessage },
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((r) => {});
      setNewMessage("");
    }
  };

  /**
   * Scroll to the bottom of the list when messages change
   */
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  /**
   * A button for the toolbar at the top of the IDE
   * @param {object} message - A message object as defined by the Django Channels in the backend
   */
  function format_message(message) {
    if (message.type === "message") {
      return (
        <span>
          <strong>{message.sender}: </strong>
          {message.message}
        </span>
      );
    } else if (message.type === "online") {
      return <strong>{message.username} has connected</strong>;
    } else if (message.type === "offline") {
      return <strong>{message.username} has disconnected</strong>;
    }
  }

  return (
    <Paper
      elevation={3}
      style={{ padding: "16px", maxWidth: "400px", margin: "auto" }}
    >
      <AppBar position="static">
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography style={{ fontWeight: "bold" }}>Maze Chat</Typography>
          <Typography>{onlineUsers} online</Typography>
        </Toolbar>
      </AppBar>
      <List ref={messageListRef} style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((message, index) => (
          <ListItem
            key={index}
            style={{ whiteSpace: "pre-line", wordBreak: "break-all" }}
          >
            {format_message(message)}
          </ListItem>
        ))}
      </List>
      <TextField
        label="Type a message"
        variant="outlined"
        fullWidth
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        InputProps={{
          style: {
            whiteSpace: "pre-line", // Use 'pre-line' for soft wrap
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        sx={{ mt: 1 }}
      >
        Send
      </Button>
    </Paper>
  );
}
