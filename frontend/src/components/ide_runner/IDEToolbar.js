import React, { useCallback, useContext, useRef, useState } from "react";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-min-noconflict/ext-searchbox";
import {
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  Typography,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SearchIcon from "@mui/icons-material/Search";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CodeIcon from "@mui/icons-material/Code";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimationContext, AnimationState } from "./AnimationProvider";
import IDEToolbarButton from "./IDEToolbarButton";
import { defaultEditorContent } from "./DefaultEditorContent";
import PopupElement from "./PopupElement";

/**
 * Represents a toolbar for the IDE.
 * @param {object} options - The options object.
 * @param {object} options.editor - The editor instance.
 * @returns {Element} - The toolbar element.
 */
export default function IDEToolBar({ editor }) {
  const fileUploadRef = useRef();
  const { animationState, onButtonClick } = useContext(AnimationContext);

  /**
   * Manages whether the snippets popup is open
   *
   * @typedef {Object} Open
   * @property {boolean} isOpen - Indicates whether the snippets popup is open or not.
   */
  const [open, setOpen] = useState(false);

  /**
   * The event handler for when a file is uploaded
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleFileUpload = useCallback(
    (event) => {
      const file = event.target.files[0];

      if (file) {
        if (file.name !== "Robot.java") {
          toast.warn("Your file must be called 'Robot.java'");
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          editor?.setValue(content);
          toast.success("Your file has been loaded!");
        };
        reader.readAsText(file);
      }
    },
    [editor]
  );

  return (
    <>
      <PopupElement editor={editor} open={open} setOpen={setOpen} />
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
              IDE
            </Typography>
            <IDEToolbarButton
              text="Undo"
              icon={<UndoIcon />}
              onClick={() => {
                editor?.undo();
              }}
            />
            <IDEToolbarButton
              text="Redo"
              icon={<RedoIcon />}
              onClick={() => {
                editor?.redo();
              }}
            />
            <IDEToolbarButton
              text="Find"
              icon={<SearchIcon />}
              onClick={() => {
                editor?.execCommand("find");
              }}
            />
            {animationState === AnimationState.NONE ? (
              <IDEToolbarButton
                text="Run"
                icon={<PlayCircleIcon />}
                onClick={() => {
                  onButtonClick(editor?.getValue());
                }}
              />
            ) : animationState === AnimationState.FINISHED ? (
              <IDEToolbarButton
                text="Restart"
                icon={<RestartAltIcon />}
                onClick={() => {
                  onButtonClick(editor?.getValue());
                }}
              />
            ) : animationState === AnimationState.PLAYING ? (
              <IDEToolbarButton
                text="Cancel"
                icon={<CancelIcon />}
                onClick={() => {
                  onButtonClick(editor?.getValue());
                }}
              />
            ) : animationState === AnimationState.LOADING ? (
              <IDEToolbarButton
                text="Loading..."
                icon={<CircularProgress size={24} color="inherit" />}
              />
            ) : null}
            <IDEToolbarButton
              text="Clear"
              icon={<DeleteIcon />}
              onClick={() => {
                editor?.setValue(defaultEditorContent);
              }}
            />
            <IDEToolbarButton
              text="Upload"
              icon={<UploadFileIcon />}
              onClick={() => {
                fileUploadRef?.current?.click();
              }}
            />
            <input
              type="file"
              accept=".java"
              id="file-upload"
              ref={fileUploadRef}
              hidden
              onChange={handleFileUpload}
            />
            <IDEToolbarButton
              text="Save"
              icon={<SaveIcon />}
              onClick={() => {
                const blob = new Blob([editor?.getValue()], {
                  type: "text/plain",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.download = "Robot.java";
                link.href = url;
                link.click();
              }}
            />
            <IDEToolbarButton
              text="Snippets"
              icon={<CodeIcon />}
              onClick={() => {
                setOpen(true);
              }}
            />
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}
