import React, { useCallback, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { MenuItem, Select } from "@mui/material";
import { AuthenticatedContext } from "../../api/AuthenticationProvider"; // Create your functional component

export default function PopupElement({ editor, open, setOpen }) {
  const [selectedValue, setSelectedValue] = useState("");
  const [snippetName, setSnippetName] = useState("");
  const {
    getSnippets,
    userProfile,
    createSnippet,
    deleteSnippet,
    modifySnippet,
  } = useContext(AuthenticatedContext);
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    getSnippets().then((data) => {
      setSnippets(data);
    });
  }, [getSnippets]);

  useEffect(() => {
    if (!snippets) {
      return;
    }
    setSelectedValue(snippets[0]);
  }, [snippets]);

  /**
   * Function to handle the closing of the popup
   *
   * @type {(function(): void)|*}
   */
  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  /**
   * Creates a new code snippet using the user's selected code from the editor.
   *
   * @function _createSnippet
   * @returns {void}
   */
  const _createSnippet = () => {
    let userCode = editor?.getSelectedText();
    if (!userCode.trim()) {
      return;
    }
    createSnippet({
      name: snippetName,
      content: userCode,
      profile: userProfile.id,
    }).then((result) => {
      setSnippets((prev) => [result, ...prev]);
    });
    setOpen(false);
  };

  /**
   * Function to insert a snippet into the editor at the current cursor position.
   * It also updates the last used date of the snippet and updates the list of snippets.
   */
  const _insertSnippet = () => {
    setOpen(false);
    let cursor = editor?.getCursorPosition(); // Get current cursor position
    editor?.session?.insert(cursor, selectedValue.content); // Insert text at cursor position
    let new_date = new Date().toISOString();
    setSelectedValue("");
    modifySnippet(selectedValue.id, { last_used: new_date }).then((result) => {
      setSnippets(() => {
        let updatedSnippets = snippets.filter(
          (snippet) => snippet.id !== selectedValue.id
        );
        return [result.data, ...updatedSnippets];
      });
    });
  };

  /**
   * Deletes a snippet with the selected ID.
   */
  const _deleteSnippet = () => {
    deleteSnippet(selectedValue.id).then(() => {
      let updatedSnippets = snippets.filter(
        (snippet) => snippet.id !== selectedValue.id
      );
      setSnippets(updatedSnippets);
      setSelectedValue("");
    });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      {/* Dialog Title */}
      <DialogTitle>Snippet Menu</DialogTitle>

      {/* Dialog Content */}
      <DialogContent>
        <br />
        <TextField
          label="Snippet Name"
          variant="outlined"
          fullWidth
          value={snippetName}
          onChange={(event) => {
            setSnippetName(event.target.value);
          }}
          margin="normal"
        />
        <Button
          color="primary"
          variant="contained"
          onClick={_createSnippet}
          disabled={
            !editor?.getSelectedText().trim().length ||
            !snippetName.trim().length ||
            snippets.some((item) => item.name === snippetName)
          }
        >
          Create
        </Button>
        <hr />
        <Select
          value={selectedValue}
          onChange={(event) => {
            setSelectedValue(event.target.value);
          }}
          label="Select an option"
          variant="outlined"
          fullWidth
          disabled={!snippets.length}
        >
          {snippets.map((snippet) => (
            <MenuItem key={snippet.id} value={snippet}>
              {snippet.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          color="error"
          variant="contained"
          onClick={_deleteSnippet}
          disabled={!snippets.length || selectedValue === ""}
        >
          Delete
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={_insertSnippet}
          disabled={!snippets.length || selectedValue === ""}
        >
          Insert
        </Button>
      </DialogContent>

      {/* Dialog Actions (e.g., buttons at the bottom) */}
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
