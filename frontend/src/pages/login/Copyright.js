import Typography from "@mui/material/Typography";
import React from "react";

/**
 * Renders a copyright notice.
 *
 * @param {object} props - An optional object that can be used to customize the appearance of the copyright notice.
 * @returns {React.Element} - A MUI Typography component that renders the copyright notice.
 */
export default function Copyright(props) {
  return (
    // formatting of copyright statement
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © ZigZag "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
