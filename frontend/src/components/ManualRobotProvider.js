import RobotProvider, { RobotContext } from "./RobotProvider";
import { useCallback, useContext, useEffect } from "react";

/**
 * Provides a manual input mode for controlling a robot.
 *
 * @param {ReactNode} children - The content to be rendered inside the ManualRobotProvider component.
 *
 * @return {ReactElement} The rendered ManualRobotProvider component with the provided children.
 */
export default function ManualRobotProvider({ children }) {
  return (
    <RobotProvider>
      <ManualInput>{children}</ManualInput>
    </RobotProvider>
  );
}

/**
 * Enables manual input for the robot commands.
 *
 * @param {React.ReactNode} children - The child components to be rendered.
 *
 * @returns {React.ReactNode} The rendered child components.
 */
function ManualInput({ children }) {
  const { onCommand } = useContext(RobotContext);

  const handleKeyDown = useCallback(
    (keyPress) => {
      const { key } = keyPress;
      onCommand(key);
    },
    [onCommand]
  );

  /**
   * Set up the event listener for keydown events
   */
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return children;
}
