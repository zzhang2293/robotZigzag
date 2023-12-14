import RobotProvider, { RobotContext } from "./RobotProvider";
import { useContext, useEffect } from "react";

/**
 * Provides a maze with automatic movement
 *
 * @param {Function} setOnNewTelemetry - The callback function to be called when new telemetry data is received.
 * @param {ReactNode} children - The child components to be rendered within the provider.
 *
 * @returns {ReactNode} - The rendered components with telemetry functionality.
 */
export default function AutomaticRobotProvider({
  children,
  setOnNewTelemetry,
}) {
  return (
    <RobotProvider>
      <AutomaticInput setOnNewTelemetry={setOnNewTelemetry}>
        {children}
      </AutomaticInput>
    </RobotProvider>
  );
}

/**
 * Alerts the maze of input when telemetry is received
 *
 * @param {React.ReactNode} children - The content to be rendered.
 * @param {Function} setOnNewTelemetry - The function to set the new telemetry.
 *
 * @return {React.ReactNode} - The rendered content.
 */
function AutomaticInput({ children, setOnNewTelemetry }) {
  const { onTelemetry } = useContext(RobotContext);

  /**
   * Set up connection to the maze by setting the function to be used when onNewTelemetry is called
   */
  useEffect(() => {
    if (!setOnNewTelemetry) {
      return;
    }
    setOnNewTelemetry(() => onTelemetry);
  }, [setOnNewTelemetry, onTelemetry]);

  return children;
}
