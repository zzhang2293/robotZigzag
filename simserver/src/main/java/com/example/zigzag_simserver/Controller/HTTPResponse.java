package com.example.zigzag_simserver.Controller;

import com.example.zigzag_simserver.ContainerManager.SimManager;
import com.example.zigzag_simserver.FileManager.InputJsonContent;
import com.example.zigzag_simserver.FileManager.OutputLogContent;
import com.example.zigzag_simserver.Shell.ShellCommand;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;

/**
 * ClassName: HTTPResponse
 * Package: com.example.zigzag_simserver.Controller
 * Description:
 *
 * @Author Liheng_Zheng
 * @Create 2023/11/7 18:22
 * @Version 1.0
 */


@RestController
public class HTTPResponse {

    private boolean imageBuilt = false;
    private SimManager simManager = new SimManager();

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }

    @PostMapping(value="/file", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OutputLogContent> javafile(@RequestBody InputJsonContent inputjson) throws IOException {

        try {
            //create /volume/simid directory for each sim in Volume
            String Dir = "/Volume";
            File dir = new File(Dir);
            if(!dir.exists()){dir.mkdirs();}
            String storeDir = "/Volume/sim"+simManager.getSimid();
            File directory = new File(storeDir);
            directory.mkdirs();

            //create blank simserviceout.txt file in Volume
            File simserviceout = new File(storeDir+"/simserviceout.txt");
            File errorfile = new File(storeDir+"/error.txt");
            simserviceout.createNewFile();
            errorfile.createNewFile();

            //save simservicein.txt and Robot.java in Volume
            IOUtils ioUtils = new IOUtils();
            ioUtils.save2files(storeDir,inputjson);

            //run sim container in container each time
            simManager.NewSimContainer();

            //watch /Volume/simid shared with /Volume_sim for each container, poll the log file
            while(true){
                String simserviceoutstr = ioUtils.readfile(storeDir+"/simserviceout.txt");
                String errorstr = ioUtils.readfile(storeDir+"/error.txt");

                if (simserviceoutstr != ""){
                    ioUtils.deletedir(storeDir);
                    OutputLogContent outputLogContent = new OutputLogContent();
                    outputLogContent.setLog(simserviceoutstr);
                    return ResponseEntity.ok(outputLogContent);
                }

                if (errorstr != ""){
                    ioUtils.deletedir(storeDir);
                    OutputLogContent outputLogContent = new OutputLogContent();
                    outputLogContent.setError(errorstr);
                    return ResponseEntity.ok(outputLogContent);
                }

            }


    } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
