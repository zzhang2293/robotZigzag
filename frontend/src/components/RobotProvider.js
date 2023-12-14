import { createContext, useState } from "react";

/**
 * Context to be provided to child components, specifically mazes
 * @type {React.Context<{}>}
 */
export const RobotContext = createContext({});

/**
 * RobotProvider component provides a context for managing robot details and state.
 *
 * @param {React.ReactNode} children - The child components.
 * @param {number} x - The initial x-coordinate of the robot.
 * @param {number} y - The initial y-coordinate of the robot.
 * @param {string} direction - The initial direction of the robot.
 *
 * @return {React.ReactNode} - The rendered component.
 */
export default function RobotProvider({ children, x, y, direction }) {
  const [onCommand, setOnCommand] = useState(() => {});
  const [onTelemetry, setOnTelemetry] = useState(() => {});

  /**
   * The context to be provided
   */
  const robotDetails = {
    onCommand: onCommand,
    setOnCommand: setOnCommand,
    onTelemetry: onTelemetry,
    setOnTelemetry: setOnTelemetry,
  };

  return (
    <RobotContext.Provider value={robotDetails}>
      {children}
    </RobotContext.Provider>
  );
}
