package com.mcp.sv.util;

import java.io.*;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;

import java.text.ParseException;

import org.apache.commons.net.ftp.FTPReply;
import org.apache.log4j.Logger;

public class FTPUtil {

    private static Logger logger = Logger.getLogger(FTPUtil.class);

    private FTPClient ftpClient;

    /**
     * init ftp servere
     */
    public FTPUtil() {
        this.reSet();
    }

    public void reSet() {
        // 以当前系统时间拼接文件名
        this.connectServer(FTPConst.FTP_HOST, FTPConst.FTP_PORT, FTPConst.FTP_USERNAME, FTPConst.FTP_PASSWORD);
    }

    /**
     * @param ip
     * @param port
     * @param userName
     * @param userPwd
     * @throws SocketException
     * @throws IOException     function:连接到服务器
     */
    public void connectServer(String ip, int port, String userName, String userPwd) {
        ftpClient = new FTPClient();
        try {
            ftpClient = new FTPClient();
            ftpClient.connect(ip, port);// 连接FTP服务器
            ftpClient.login(userName, userPwd);// 登陆FTP服务器
            if (!FTPReply.isPositiveCompletion(ftpClient.getReplyCode())) {
                logger.info("未连接到FTP，用户名或密码错误。");
                ftpClient.disconnect();
            } else {
                logger.info("FTP连接成功。");
            }
        } catch (SocketException e) {
            e.printStackTrace();
            logger.info("FTP的IP地址可能错误，请正确配置。");
        } catch (IOException e) {
            e.printStackTrace();
            logger.info("FTP的端口错误,请正确配置。");
        }
    }

    /**
     * @throws IOException function:关闭连接
     */
    public void closeServer() {
        if (ftpClient.isConnected()) {
            try {
                ftpClient.logout();
                ftpClient.disconnect();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * @param path
     * @return function:读取指定目录下的文件名
     * @throws IOException
     */
    public List<String> getFileList(String path) {
        List<String> fileLists = new ArrayList<String>();
        // 获得指定目录下所有文件名
        FTPFile[] ftpFiles = null;
        try {
            ftpFiles = ftpClient.listFiles(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
        for (int i = 0; ftpFiles != null && i < ftpFiles.length; i++) {
            FTPFile file = ftpFiles[i];
            System.out.println(file.getName());
            fileLists.add(file.getName());
        }
        return fileLists;
    }

    /**
     * @param fileName
     * @return function:从服务器上读取指定的文件
     * @throws ParseException
     * @throws IOException
     */
    public String readFile(String fileName) throws ParseException {
        InputStream ins = null;
        StringBuilder builder = null;
        try {
            // 从服务器上读取指定的文件
            ins = ftpClient.retrieveFileStream(fileName);
            BufferedReader reader = new BufferedReader(new InputStreamReader(ins, FTPConst.FTP_ENCODING));
            String line;
            builder = new StringBuilder(150);
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
            reader.close();
            if (ins != null) {
                ins.close();
            }
            // 主动调用一次getReply()把接下来的226消费掉. 这样做是可以解决这个返回null问题
            ftpClient.getReply();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return builder.toString();
    }


    /**
     * @param args
     * @throws ParseException
     */
    public static void main(String[] args) throws ParseException {
        FTPUtil ftp = new FTPUtil();
        ftp.getFileList("T05/201506/17/15061716").size();
        String str=ftp.readFile("T05/201506/17/15061716/BonusDetail.txt");
        System.out.println(str.trim());
        ftp.closeServer();
    }


}
