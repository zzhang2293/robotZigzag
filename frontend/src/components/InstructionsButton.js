import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

/**
 * Customized styled Dialog using Material-UI styling.
 */
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

/**
 * Displays a button that pops up a dialog with instructions.
 * To be used in outlet pages (tournament, practice, and test).
 * Instructions Popup content specified in props when called.
 *
 * @component
 * @param {Object} props - The component's properties.
 * @param {string} [props.title] - The title of the dialog (optional).
 * @param {string} [props.content] - The content of the dialog (optional).
 */
export default function InstructionsButton({ title, content }) {
  // State to manage the dialog's open/closed state.
  const [open, setOpen] = React.useState(false);

  /**
   * Handles the button click event to open the dialog.
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Handles the dialog close event.
   */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Read Instructions
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title || "Title"}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>{content || "Content"}</Typography>
        </DialogContent>
        <DialogActions>
          {/* Closes Instructions view when clicked */}
          <Button autoFocus onClick={handleClose}>
            Ok!
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
