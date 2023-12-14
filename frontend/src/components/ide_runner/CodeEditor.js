import React, { useContext, useRef } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-min-noconflict/ext-searchbox";
import { Box, Grid, Slider } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { AnimationContext } from "./AnimationProvider";
import IDEToolBar from "./IDEToolbar";
import { defaultEditorContent } from "./DefaultEditorContent";

/**
 * Renders a code editor component.
 *
 * @param {Object} props - The properties for the CodeEditor component.
 * @param {boolean} props.disableSpeed - Determines whether to disable the animation speed slider.
 * @returns {React.Element} The rendered CodeEditor component.
 */
export default function CodeEditor({ disableSpeed }) {
  /**
   * Stored reference to the AceEditor object
   * @type {React.MutableRefObject<AceEditor>}
   */
  const aceEditorRef = useRef();

  /**
   * Sets the delay for an animation.
   *
   * @param {number} delay - The delay between animation steps
   * @returns {void}
   */
  const { setAnimationDelay } = useContext(AnimationContext);

  return (
    <Box>
      <Grid>
        <Grid>
          <Box>
            <IDEToolBar
              editor={aceEditorRef?.current?.editor}
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
      {disableSpeed ?? false ? null : (
        <Slider
          defaultValue={50}
          min={0}
          max={500}
          aria-label="Speed Slider"
          valueLabelDisplay="off"
          onChange={(e) => {
            setAnimationDelay(500 - e.target.value);
          }}
        />
      )}
    </Box>
  );
}
