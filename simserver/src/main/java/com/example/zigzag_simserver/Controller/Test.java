package com.example.zigzag_simserver.Controller;

import com.example.zigzag_simserver.ContainerManager.SimManager;
import com.example.zigzag_simserver.FileManager.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * ClassName: Test
 * Package: com.example.zigzag_simserver.Controller
 * Description:
 *
 * @Author Liheng_Zheng
 * @Create 2023/11/21 15:53
 * @Version 1.0
 */

@RestController
public class Test {
    private boolean imageBuilt = false;
    private SimManager simManager = new SimManager();

    //test backend json to simservicein.txt and robot.java
    //requestData: {Maze : "", java_content : ""}
    @PostMapping(value = "/jsontest", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> javafile(@RequestBody InputJsonContent inputjson) throws IOException {

            Mazefile maze = inputjson.getMaze();
            String storeDir = "/Users/zhengliheng/Desktop";

            IOUtils ioUtils = new IOUtils();
            File robot = new File(storeDir+"/Robot.java");
            robot.createNewFile();
            ioUtils.writefile(storeDir + "/Robot.java", inputjson.getJava_content());

            int numrows = inputjson.getMaze().getNum_row();
            int numcols = inputjson.getMaze().getNum_col();
            String simservicein = "" + numrows + "\n" + numcols + "\n";

            List<List<String>> data = inputjson.getMaze().getLevel_configuration();
            for (List<String> sublist : data) {
                for (String str : sublist) {
                    simservicein = simservicein + str;
                    System.out.print(str);
                }
                simservicein = simservicein + "\n";
            }

            int startX = inputjson.getMaze().getStart_col();
            int startY = inputjson.getMaze().getStart_row();
            int goalX = inputjson.getMaze().getEnd_col();
            int goalY = inputjson.getMaze().getEnd_row();

            simservicein = simservicein + startX + "\n" + startY + "\n";
            simservicein = simservicein + goalX + "\n" + goalY + "\n";

            File simserviceintxt = new File(storeDir+"/simservicein.txt");
            simserviceintxt.createNewFile();
            ioUtils.writefile(storeDir + "/simservicein.txt", simservicein);

            return ResponseEntity.ok("Successfully receive and save file!");
    }
}