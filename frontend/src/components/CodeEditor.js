import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-min-noconflict/ext-searchbox";
import {
  AppBar,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Slider,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SearchIcon from "@mui/icons-material/Search";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePopup from "./usePopup";

/**
 * The default content of the web IDE
 * @type {string}
 */
const defaultEditorContent =
  "public class Robot implements RobotBase {\n\n    " +
  "public RobotController rc;\n\n    @Override\n    " +
  "public void init() {\n        " +
  "rc = new RobotController();\n    }\n\n    " +
  "@Override\n    public void periodic() {\n    }\n}";

/**
 * The code editor IDE component
 * @returns {Element}
 * @constructor
 */
export default function CodeEditor({
  onSubmit,
  onReset,
  onCancel,
  onSetSpeed,
}) {
  /**
   * Stored reference to the AceEditor object
   * @type {React.MutableRefObject<AceEditor>}
   */
  const aceEditorRef = useRef();

  /**
   * The event handler for when the IDE contents change
   */
  const onChange = () => {};

  return (
    <Box>
      <Grid>
        <Grid>
          <Box>
            <IDEToolBar
              editor={aceEditorRef?.current?.editor}
              onSubmit={onSubmit}
              onReset={onReset}
              onCancel={onCancel}
              style={{
                width: "100%",
                "@media (min-width:500px)": {
                  width: "100%",
                },
              }}
            />
          </Box>
        </Grid>
        <Grid>
          <Box
            sx={{
              width: "100%",
              flexGrow: 1,
            }}
          >
            <AceEditor
              ref={aceEditorRef}
              mode="java"
              theme="github"
              onChange={onChange}
              name="code-editor"
              editorProps={{ $blockScrolling: true }}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              defaultValue={defaultEditorContent}
              style={{
                width: "100%",
                "@media (min-width:500px)": {
                  width: "100%",
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <Slider
        defaultValue={50}
        min={0}
        max={500}
        aria-label="Speed Slider"
        valueLabelDisplay="off"
        onChange={(e) => {
          onSetSpeed(500 - e.target.value);
        }}
      />
    </Box>
  );
}

/**
 * The IDEToolBar component represents the toolbar for IDE actions.
 * @param {import("react-ace").AceEditor["Editor"]} editor - The internal IDE AceEditor component.
 * @param {function} onSubmit - The callback for when the user submits their code.
 * @param {boolean} playButtonState - The state of the play button.
 * @returns {Element} - The IDEToolBar element.
 * @constructor
 */
function IDEToolBar({ editor, onSubmit, onReset, onCancel }) {
  const fileUploadRef = useRef();

  const [playButtonState, setPlayButtonState] = useState("play");

  useEffect(() => {
    console.log(playButtonState);
  }, [playButtonState]);

  /**
   * A button for the toolbar at the top of the IDE
   * @param {string} text - The text to be used for accessibility and the tooltip
   * @param {ReactNode} icon - the element representing the icon to be displayed on the button
   * @param {function} onClick - The function to run when the button is clicked
   * @returns {Element}
   * @constructor
   */
  function IDEButton({ text, icon, onClick }) {
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

  function _onSubmit() {
    if (onSubmit) {
      setPlayButtonState("loading");
      onSubmit(
        editor?.getValue(),
        () => {
          console.log("going into cancel state");
          setPlayButtonState("cancel");
        },
        () => {
          setPlayButtonState("restart");
        },
        () => {
          setPlayButtonState("play");
        }
      );
    }
  }

  function _onReset() {
    if (onReset) {
      setPlayButtonState("play");
      onReset();
    }
  }

  function _onCancel() {
    if (onCancel) {
      setPlayButtonState("restart");
      onCancel();
    }
  }

  function getPlayIcon() {
    switch (playButtonState) {
      case "play":
        return (
          <IDEButton text="Run" icon={<PlayCircleIcon />} onClick={_onSubmit} />
        );
      case "cancel":
        return (
          <IDEButton text="Cancel" icon={<CancelIcon />} onClick={_onCancel} />
        );
      case "restart":
        return (
          <IDEButton
            text="Restart"
            icon={<RestartAltIcon />}
            onClick={_onReset}
          />
        );
      case "loading":
        return (
          <IDEButton
            text="Loading..."
            icon={<CircularProgress size={24} color="inherit" />}
          />
        );
      default:
        // Default to "play"
        return (
          <IDEButton text="Run" icon={<PlayCircleIcon />} onClick={_onSubmit} />
        );
    }
  }

  /**
   * The event handler for when a file is uploaded
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleFileUpload = (event) => {
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
  };

  const { setOpen, PopupElement } = usePopup(editor);

  console.log("code editor render");

  return (
    <>
      <PopupElement />
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
              IDE
            </Typography>
            <IDEButton
              text="Undo"
              icon={<UndoIcon />}
              onClick={() => {
                editor?.undo();
              }}
            />
            <IDEButton
              text="Redo"
              icon={<RedoIcon />}
              onClick={() => {
                editor?.redo();
              }}
            />
            <IDEButton
              text="Find"
              icon={<SearchIcon />}
              onClick={() => {
                editor?.execCommand("find");
              }}
            />
            {getPlayIcon()}
            <IDEButton
              text="Clear"
              icon={<DeleteIcon />}
              onClick={() => {
                editor?.setValue(defaultEditorContent);
              }}
            />
            <IDEButton
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
            <IDEButton
              text="Save"
              icon={<SaveIcon />}
              onClick={() => {
                console.log(editor?.getValue());
                console.log(typeof editor?.getValue());
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
            <IDEButton
              text="Snippets"
              icon={<IntegrationInstructionsIcon />}
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
