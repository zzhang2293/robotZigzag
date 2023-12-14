send json at(using HTTP POST):http://localhost:9999/file
sample json:
{
"maze": {
"start_row": 6,
"start_col": 5,
"end_row": 6,
"end_col": 6,
"num_row": 7,
"num_col": 7,
"level_configuration": [
["d", "9", "8", "a", "c", "9", "c"],
["5", "5", "3", "c", "3", "6", "5"],
["5", "1", "e", "3", "8", "c", "7"],
["1", "6", "9", "c", "7", "3", "c"],
["5", "9", "6", "3", "a", "c", "5"],
["5", "7", "b", "a", "c", "5", "5"],
["3", "a", "a", "a", "6", "3", "6"]
]
},
"java_content": "public class Robot { // This will be the format of user-submitted code\n\n    public RobotController rc = new RobotController();\n\n    public void execute() { // Put all code in here by invoking methods in the robot controller \"rc\"\n\n        // Brute force algorithm\n        while (rc.queryFrontSensor() != 0) {\n\n            if (rc.queryLeftSensor() == 0) {\n                rc.rotateCounterClockwise();\n            } else if (rc.queryRightSensor() == 0) {\n                rc.rotateClockwise();\n            } else if (rc.queryFrontSensor() == -1) {\n                int choice = (int) (Math.random() * 2);\n                if (choice == 0) {\n                    rc.rotateClockwise();\n                } else {\n                    rc.rotateCounterClockwise();\n                }\n            } else {\n                rc.moveForwards();\n            }\n\n        }\n\n        rc.moveForwards();\n\n    }\n\n}"
}