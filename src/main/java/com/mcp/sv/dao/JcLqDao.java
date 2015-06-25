package com.mcp.sv.dao;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import com.mcp.core.util.StringUtil;
import com.mcp.sv.cmbc.LotteryService;
import com.mcp.sv.util.HttpClientWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

import static com.mcp.sv.util.HttpClientWrapper.sendGet;

/**
 * Created by Administrator on 2015/6/4.
 */
public class JcLqDao {

    private static final Logger logger = LoggerFactory.getLogger(LotteryService.class);

    public static Map<String,Object> map = new HashMap<String,Object>();

    public static String getFormat(String body){
        String bodyrst = "";
        if (!StringUtil.isEmpty(body)){
             bodyrst = HttpClientWrapper.mcpPost("CQ22", body);
            logger.info(bodyrst);
        }
        return  bodyrst;
    }
}
