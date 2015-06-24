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
        String token = "J_JD9O7_upUq7B2JVVKthADGAm7o5clXJBNMe5tlaOQluzA-HAQsZ5slfP6ftC8LpWXUz9TjDbfo9kJCz2OefYYtkLfM3QlDIq4iZcOOY0g";

        String url = URL+token;
        String pageUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + CmbcConstant.APPID+ "&redirect_uri=http://www.mcp8.net/weixin/callback&response_type=code&scope=snsapi_base&state=";

        JSONArray button = new JSONArray();

        JSONObject buttonObj = new JSONObject();
        buttonObj.put("name", "购彩大厅" );
        buttonObj.put("type", "view" );
        buttonObj.put("url", pageUrl + "index#wechat_redirect" );
        button.add(buttonObj);

        JSONObject buttonObj1 = new JSONObject();
        buttonObj1.put("name", "推荐游戏" );
        JSONObject subObj3 = new JSONObject();
        subObj3.put("type", "view");
        subObj3.put("name", "竞彩足球");
        subObj3.put("url", pageUrl+ "jczq#wechat_redirect");

        JSONObject subObj6 = new JSONObject();
        subObj6.put("type", "view");
        subObj6.put("name", "大乐透");
        subObj6.put("url", pageUrl+ "dlt#wechat_redirect");

        JSONObject subObj7 = new JSONObject();
        subObj7.put("type", "view");
        subObj7.put("name", "七星彩");
        subObj7.put("url", pageUrl+ "qxc#wechat_redirect");

        JSONArray subArray1 = new JSONArray();
        subArray1.add(subObj3);
        subArray1.add(subObj6);
        subArray1.add(subObj7);
        buttonObj1.put("sub_button", subArray1);
        button.add(buttonObj1);

        JSONObject buttonObj2 = new JSONObject();
        buttonObj2.put("name", "信息" );
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
