package com.example.zigzag_simserver.Shell;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * ClassName: ShellCommand
 * Package: com.example.zigzag_simserver.Shell
 * Description:
 *
 * @Author Liheng_Zheng
 * @Create 2023/11/7 18:23
 * @Version 1.0
 */
public class ShellCommand {

    //get OS
    private boolean isWindows = System.getProperty("os.name")
            .toLowerCase().startsWith("windows");

    private ProcessBuilder builder = new ProcessBuilder(); //build a external process

    public ShellCommand() {
    }

    public void setWorkingDir(String WorkingDir){
        builder.directory(new File(WorkingDir));
    }

    public void shCommand(String arguments){


        if (isWindows) {
            builder.command("cmd.exe", "/c", "dir");
        } else {
            builder.command("sh", "-c", arguments); //run "sh" with arguments
        }

        //sets the working directory to the user's home directory
        //builder.directory(new File(System.getProperty("user.home")));

        try {

            Process process = builder.start(); //start configured external process

            // store the output of the process
            StringBuilder output = new StringBuilder();

            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()));

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line + "\n");
            }

            int exitVal = process.waitFor();
            if (exitVal == 0) {
                System.out.println("Success access command:"+arguments);
                System.out.println(output);
                //System.exit(0);
            } else {
                System.out.println("Failure access command:"+arguments);
            }

        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

    }

}
