package com.example.zigzag_simserver.ContainerManager;

import com.example.zigzag_simserver.Shell.ShellCommand;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

/**
 * ClassName: SimManager
 * Package: com.zigzag.jsontest.Controller.ContainerManager
 * Description:
 *
 * @Author Liheng_Zheng
 * @Create 2023/11/6 15:43
 * @Version 1.0
 */
public class SimManager {
    private int simid = 0;

    public int getSimid() {
        return simid;
    }

    public SimManager() {
    }

    //todo: test the mount will have all the sim java correctly
    public int NewSimContainer(){
        ShellCommand shellCommand = new ShellCommand();
        //shellCommand.shCommand("docker run --name=sim"+simid+" -d -v /Volume/sim"+simid+":/Volume_sim sim:1.2");

        shellCommand.shCommand("docker run --name=sim"+simid+" -d -v /Volume/sim"+simid+":/app/Volume  sim:1.2");

        simid++;
        return (simid-1);
    }


    //change the FileWatcher to DirWatcher
    public boolean DirWatcher(String DirPath) throws IOException {
        WatchService watchService = FileSystems.getDefault().newWatchService();

        Path file = Paths.get(DirPath);

        file.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);

        System.out.println("Watching dir: " + DirPath);

        while (true) {
            WatchKey key;
            try {
                key = watchService.take();
            } catch (InterruptedException e) {
                e.printStackTrace();
                return false;
            }

            for (WatchEvent<?> event : key.pollEvents()) {
                if (event.kind() == StandardWatchEventKinds.ENTRY_CREATE) {

                        return true;
                    }
                }


            key.reset();
        }
    }

    public String FileWatcher(String filePath) throws IOException {
        WatchService watchService = FileSystems.getDefault().newWatchService();

        Path file = Paths.get(filePath).toAbsolutePath().getParent();

        file.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);

        System.out.println("Watching file: " + filePath);

        while (true) {
            WatchKey key;
            try {
                key = watchService.take();
            } catch (InterruptedException e) {
                e.printStackTrace();
                return "wrong";
            }

            for (WatchEvent<?> event : key.pollEvents()) {
                if (event.kind() == StandardWatchEventKinds.ENTRY_MODIFY) {
                    Path changedPath = (Path) event.context();
                    if (changedPath.toString().equals(filePath)) {
                        System.out.println("File modified: " + changedPath);
                        return "" + changedPath;
                    }
                }
            }

            key.reset();
        }
    }
}

