package com.example.zigzag_simserver.Controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.Mapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * ClassName: HTTPRequest
 * Package: com.example.zigzag_simserver.ContainerManager.Controller
 * Description:
 *
 * @Author Liheng_Zheng
 * @Create 2023/11/7 18:22
 * @Version 1.0
 */

//This class is used to send HTTP request to the server
@RestController
public class HTTPRequest {

    //This method is a fake Server-end HTTP Post request to send java file and receive log file
    @GetMapping("/sendfile")
    public String sendfile() throws IOException {

        //create /Volume in container
        String Dir = "/Volume";
        File directory = new File(Dir);
        if(!directory.exists()){directory.mkdirs();}

        //create user.java file in /Volume
        String filepath = "/Volume/user.java";
        File newjavafile = new File(filepath); //create new user.java
        FileWriter writer = new FileWriter(newjavafile);
        writer.write("This is a java file"); //add something in that file
        writer.close();

        //HTTP body setting
        RestTemplate restTemplate = new RestTemplate();
        LinkedMultiValueMap<String, Object> bodyMap = new LinkedMultiValueMap<>();
        FileSystemResource fileResource = new FileSystemResource(filepath);
        bodyMap.add("file", fileResource);

        //HTTP header setting
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<LinkedMultiValueMap<String, Object>> requestEntity = new HttpEntity<>(bodyMap, headers);

        //send HTTP request
        String uri = "http://localhost:9999/javafile";
        ResponseEntity<byte[]> response = restTemplate.exchange(uri, HttpMethod.POST, requestEntity, byte[].class);

        //receive HTTP response
        byte[] fileBytes = response.getBody();
        Files.write(Paths.get("/Volume/log"), fileBytes); //store log file
        return "Successfully received file!\n"+fileBytes;
    }

}
