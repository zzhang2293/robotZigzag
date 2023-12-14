/**
 * The default content of the web IDE
 * @type {string}
 */
export const defaultEditorContent =
  "public class Robot extends RobotBase {\n\n    public RobotController rc;\n\n    " +
  "@Override\n    public void init() {\n        rc = new RobotController();\n    }\n\n    " +
  "@Override\n    public void periodic() {\n    }\n    \n}";
