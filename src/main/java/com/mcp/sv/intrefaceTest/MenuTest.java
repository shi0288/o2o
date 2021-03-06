package com.mcp.sv.intrefaceTest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mcp.sv.util.CmbcConstant;
import com.mcp.sv.util.HttpClientWrapper;

/**
 * Created by ChubChen on 2015/6/3.
*/
public class MenuTest {

    private static final String URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=";

    public static void main(String[] args) throws Exception{

        String token = "dY78dNTyYtym2wqmUeE6d-dfME4qJycqfuaF6XrWjafuf9_knjHn0rsEhFHMEZ8sZx2lUcnYPTz1MzQ1aGO2wb3lis3Z-fXlZDO-ensDYko";


        String url = URL+token;
        String pageUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + CmbcConstant.APPID+ "&redirect_uri=http://www.mcp8.net/weixin/callback&response_type=code&scope=snsapi_base&state=";

        JSONArray button = new JSONArray();

        JSONObject buttonObj = new JSONObject();
        buttonObj.put("name", "娱乐大厅" );
        buttonObj.put("type", "view" );
        buttonObj.put("url", pageUrl + "index#wechat_redirect" );
        button.add(buttonObj);


        JSONObject subObj7 = new JSONObject();
        subObj7.put("name", "开奖查询");
        subObj7.put("type", "view");
        subObj7.put("url", pageUrl+ "result#wechat_redirect");
        button.add(subObj7);

        JSONObject buttonObj2 = new JSONObject();
        buttonObj2.put("name", "更多服务" );
        JSONObject subObj4 = new JSONObject();
        subObj4.put("type", "click");
        subObj4.put("name", "账户余额");
        subObj4.put("key", "recharge");

        JSONObject subObj5 = new JSONObject();
        subObj5.put("type", "click");
        subObj5.put("name", "推荐号码");
        subObj5.put("key", "tuijian");
        JSONArray subArray2 = new JSONArray();
        subArray2.add(subObj4);
        subArray2.add(subObj5);
        buttonObj2.put("sub_button", subArray2);
        button.add(buttonObj2);

        JSONObject object = new JSONObject();
        object.put("button", button);

        String jsonString = object.toJSONString();
        System.out.println(jsonString);
       String result = HttpClientWrapper.postJson(url, jsonString);
        System.out.println(result);


    }
}
