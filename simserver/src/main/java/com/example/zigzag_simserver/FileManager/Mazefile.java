package com.example.zigzag_simserver.FileManager;

import java.util.List;

/**
 * ClassName: Maze
 * Package: com.example.zigzag_simserver.FileManager
 * Description:
 *
 * @Author Liheng_Zheng
 * @Create 2023/11/21 18:21
 * @Version 1.0
 */
public class Mazefile {
    private int start_row;

    public int getStart_row() {
        return start_row;
    }

    public void setStart_row(int start_row) {
        this.start_row = start_row;
    }

    public int getStart_col() {
        return start_col;
    }

    public void setStart_col(int start_col) {
        this.start_col = start_col;
    }

    public int getEnd_row() {
        return end_row;
    }

    public void setEnd_row(int end_row) {
        this.end_row = end_row;
    }

    public int getEnd_col() {
        return end_col;
    }

    public void setEnd_col(int end_col) {
        this.end_col = end_col;
    }

    public int getNum_row() {
        return num_row;
    }

    public void setNum_row(int num_row) {
        this.num_row = num_row;
    }

    public int getNum_col() {
        return num_col;
    }

    public void setNum_col(int num_col) {
        this.num_col = num_col;
    }

    public List<List<String>> getLevel_configuration() {return level_configuration;}

    public void setLevel_configuration(List<List<String>> level_configuration) {this.level_configuration = level_configuration;}

    private int start_col;
    private int end_row;
    private int end_col;
    private int num_row;
    private int num_col;
    private List<List<String>> level_configuration;


}
