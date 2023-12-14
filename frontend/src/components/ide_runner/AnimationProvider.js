import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AutomaticRobotProvider from "../AutomaticRobotProvider";
import { toast } from "react-toastify";
import { AuthenticatedContext } from "../../api/AuthenticationProvider";

/**
 * AnimationContext is a React context created using the createContext function.
 * It provides a way to share animation related data and functions to child components.
 *
 * @type {React.Context}
 * @example
 * // Creating AnimationContext
 * import { createContext } from 'react';
 *
 * const AnimationContext = createContext({});
 *
 * @see https://reactjs.org/docs/context.html
 */
export const AnimationContext = createContext({});

/**
 * Represents the different states of an animation.
 *
 * @typedef {Object} AnimationState
 * @property {string} NONE - Indicates that no animation is currently active.
 * @property {string} LOADING - Indicates that the animation is being loaded.
 * @property {string} PLAYING - Indicates that the animation is currently playing.
 * @property {string} FINISHED - Indicates that the animation has finished playing.
 */
export const AnimationState = {
  NONE: "NONE",
  LOADING: "LOADING",
  PLAYING: "PLAYING",
  FINISHED: "FINISHED",
};

/**
 * AnimationProvider is a custom React component that manages the animation state for a robot animation. It receives a "children" prop and provides a context with animation state and
 * control functions to its child components.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components of the AnimationProvider.
 *
 * @returns {React.ReactNode} - The JSX representation of the AnimationProvider component.
 */
export default function AnimationProvider({
  children,
  submitCallback,
  errorCallback,
  tournamentID,
}) {
  const [animationState, setAnimationState] = useState(AnimationState.NONE);
  const [animationDelay, setAnimationDelay] = useState(25);

  const [animationTelemetry, setAnimationTelemetry] = useState([]);
  const [animationTelemetryIndex, setAnimationTelemetryIndex] = useState(0);

  const [onNewTelemetry, setOnNewTelemetry] = useState(() => (_) => {});
  const [mazeID, setMazeID] = useState(undefined);

  const { submitUserEntry, submitTournamentEntry } =
    useContext(AuthenticatedContext);

  // When telemetry is received set the animation state accordingly and reset the index
  useEffect(() => {
    if (animationTelemetry.length) {
      setAnimationState(AnimationState.PLAYING);
      setAnimationTelemetryIndex(0);
    } else {
      setAnimationState(AnimationState.NONE);
    }
  }, [animationTelemetry]);

  // When the index changes run the animation if the state is playing
  useEffect(() => {
    if (animationState !== AnimationState.PLAYING) {
      return;
    }
    if (animationTelemetryIndex >= animationTelemetry.length) {
      setAnimationState(AnimationState.FINISHED);
      setAnimationTelemetryIndex(0);
      return;
    }

    onNewTelemetry(animationTelemetry[animationTelemetryIndex]);
    setTimeout(() => {
      setAnimationTelemetryIndex((prev) => prev + 1);
    }, animationDelay);
  }, [animationTelemetryIndex, animationState]);

  // Memoize this function to avoid unnecessary re-renders
  const onButtonClick = useCallback(
    (editorContents) => {
      switch (animationState) {
        case AnimationState.NONE:
          _doSubmit(editorContents);
          break;
        case AnimationState.PLAYING:
          _doCancel();
          break;
        case AnimationState.LOADING:
          break;
        case AnimationState.FINISHED:
          _doReset();
          break;
        default:
          return;
      }
    },
    [animationState, mazeID, tournamentID, submitCallback]
  );

  /**
   * Resets the telemetry and animation state.
   *
   * @private
   * @returns {void}
   */
  function _doReset() {
    onNewTelemetry({ x: 0, y: 0, direction: "up" });
    setAnimationState(AnimationState.NONE);
  }

  /**
   * Cancels the animation.
   *
   * @private
   * @returns {void}
   */
  function _doCancel() {
    setAnimationTelemetry([]);
  }

  /**
   * Submits the editor contents and handles the response.
   *
   * @private
   * @param {string} editorContents - The contents of the editor.
   * @return {void}
   */
  function _doSubmit(editorContents) {
    console.log("submit routine");
    if (!onNewTelemetry && !tournamentID) {
      console.log("exiting early");
      return;
    }

    setAnimationState(AnimationState.LOADING);

    // If this is a tournament do not play the animation, just update states
    if (tournamentID) {
      submitTournamentEntry(editorContents, tournamentID)
        .then(function (res) {
          if (submitCallback) {
            submitCallback(res);
            setAnimationState(AnimationState.NONE);
          }
          if (res.data.status === "ok") {
            if (res.data.did_win) {
              toast.success(`Finished in ${res.data.total_time} moves!`);
            } else {
              toast.warn(`Robot halted after ${res.data.total_time} moves!`);
            }
          } else {
            toast.error(res.data.details);
          }
        })
        .catch((error) => {
          toast.error(error.error);
          setAnimationState(AnimationState.NONE);
          if (errorCallback) {
            errorCallback(error);
          }
        });
    } else {
      submitUserEntry(editorContents, mazeID)
        .then(function (res) {
          console.log("received data:", res.data);
          if (res.data.status === "ok") {
            setAnimationState(AnimationState.PLAYING);
            setAnimationTelemetry(res.data.telemetry);
            if (res.data.did_win) {
              toast.success(`Finished in ${res.data.total_time} moves!`);
            } else {
              toast.warn(`Robot halted after ${res.data.total_time} moves!`);
            }
          } else {
            toast.error(res.data.details);
            setAnimationState(AnimationState.NONE);
          }
          if (submitCallback) {
            submitCallback(res);
          }
        })
        .catch((error) => {
          toast.error(error.error);
          setAnimationState(AnimationState.NONE);
          if (errorCallback) {
            errorCallback(error);
          }
        });
    }
  }

  /**
   * @typedef {Object} Context
   * @property {animationState} animationState - The current animation state.
   * @property {function} onButtonClick - The function to handle button clicks.
   * @property {function} setMazeID - The function to set the maze ID.
   * @property {function} setAnimationDelay - The function to set the animation delay.
   */
  const context = useMemo(
    () => ({
      animationState,
      onButtonClick,
      setMazeID,
      setAnimationDelay,
    }),
    [animationState, onButtonClick]
  );

  return (
    <AnimationContext.Provider value={context}>
      <AutomaticRobotProvider setOnNewTelemetry={setOnNewTelemetry}>
        {children}
      </AutomaticRobotProvider>
    </AnimationContext.Provider>
  );
}
