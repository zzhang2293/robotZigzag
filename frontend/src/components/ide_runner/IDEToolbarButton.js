import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import React from "react";

/**
 * A button for the toolbar at the top of the IDE
 * @param {string} text - The text to be used for accessibility and the tooltip
 * @param {ReactNode} icon - the element representing the icon to be displayed on the button
 * @param {function} onClick - The function to run when the button is clicked
 * @returns {Element}
 * @constructor
 */
export default function IDEToolbarButton({ text, icon, onClick }) {
  // console.log("rerender button", text);
  return (
    <Tooltip title={text}>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label={text}
        sx={{ mr: 2 }}
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}
