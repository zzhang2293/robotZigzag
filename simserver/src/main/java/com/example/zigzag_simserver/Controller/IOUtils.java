package com.example.zigzag_simserver.Controller;

import com.example.zigzag_simserver.FileManager.InputJsonContent;
import com.example.zigzag_simserver.FileManager.Mazefile;

import java.io.*;
import java.util.List;

/**
 * ClassName: IOUtils
 * Package: com.example.zigzag_sim
 * Description:
 *
 * @Author Liheng_Zheng
 * @Create 2023/11/7 18:46
 * @Version 1.0
 */
public class IOUtils {

    public String readconf(String conffilepath) throws IOException {
        File file = new File(conffilepath);
        FileReader fileReader = new FileReader(file);
        BufferedReader bufferedReader = new BufferedReader(fileReader);
        String line;
        String log = "";
        int i = 0;
        while ((line = bufferedReader.readLine()) != null) {
            log = log + line;
            System.out.println(line); // 打印每一行内容
            i++;
        }
        if(i>2){
            System.out.println("conf content more than 1 line, wrong!");
        }
        return log;
    }


    public String readfile(String filepath) throws IOException {
        File file = new File(filepath); // 替换为你的文件路径
        FileReader fileReader = new FileReader(file);
        BufferedReader bufferedReader = new BufferedReader(fileReader);
        String line;
        String log = "";
        while ((line = bufferedReader.readLine()) != null) {
            log = log + line + "\n";
            System.out.println(line); // 打印每一行内容
        }
        return log;
    }

    public void writefile(String filepath,String content) {
        File file = new File(filepath); // 替换为你的文件路径
        try {
            FileWriter fileWriter = new FileWriter(file);
            BufferedWriter bufferedWriter = new BufferedWriter(fileWriter);

            bufferedWriter.write(content);
            bufferedWriter.newLine(); // 写入一个换行符

            bufferedWriter.close();
            System.out.println("write in!");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public void save2files(String storeDir, InputJsonContent inputjson) throws IOException {

        Mazefile maze = inputjson.getMaze();

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
    }

    public void deletedir(String dirpath){
        File file = new File(dirpath);
        if(file.exists()){
            File[] files = file.listFiles();
            for(File f : files){
                if(f.isDirectory()){
                    deletedir(f.getPath());
                }else{
                    f.delete();
                }
            }
            file.delete();
        }
    }




}
