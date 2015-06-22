package com.mcp.sv.intrefaceTest;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.mcp.sv.util.CmbcConstant;
import com.mcp.sv.util.HttpClientWrapper;

/**
 * Created by ChubChen on 2015/6/3.
 *  {
 "button":[
 {
 "type":"click",
 "name":"今日歌曲",
 "key":"V1001_TODAY_MUSIC"
 },
 {
 "name":"菜单",
 "sub_button":[
 {
 "type":"view",
 "name":"搜索",
 "url":"http://www.soso.com/"
 },
 {
 "type":"view",
 "name":"视频",
 "url":"http://v.qq.com/"
 },
 {
 "type":"click",
 "name":"赞一下我们",
 "key":"V1001_GOOD"
 }]
 }]
 }
 */
public class MenuTest {

    private static final String URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=";

    public static void main(String[] args) throws Exception{
        String token = "qD0WqCTNmun1gd_p7UsXO_KukuNSdmNosM7nyG02lZjTUoPYPOFV92TjY8EMiUeJXOFGIMO7tW6zbyR9SQ-8LpfpVdLplcWboDz5HCz3XRI";

        String url = URL+token;

        JSONArray button = new JSONArray();

            JSONObject buttonObj = new JSONObject();
            buttonObj.put("name", "测试1" );
            JSONObject subObj = new JSONObject();
            subObj.put("type", "view");
            subObj.put("name", "日历" );
            subObj.put("url", "http://stock1.sina.cn/dpool/stockv2/universal_calendar.php?vt=4");

            JSONObject subObj2 = new JSONObject();
            subObj2.put("type", "view");
            subObj2.put("name", "测试3" );
            subObj2.put("url", "http://mp.weixin.qq.com/mp/redirect?url=http://stock1.sina.cn/dpool/stockv2/universal_calendar.php?vt=4");

        JSONObject subObj10 = new JSONObject();
        subObj10.put("type", "view");
        subObj10.put("name", "测试4" );
        subObj10.put("url", "http://mp.weixin.qq.com/mp/redirect?url=http://stock1.sina.cn/dpool/stockv2/universal_calendar.php?vt=4");

            JSONArray subArray = new JSONArray();
            subArray.add(subObj);
            subArray.add(subObj2);
            subArray.add(subObj10);
            buttonObj.put("sub_button", subArray);
            button.add(buttonObj);

        JSONObject buttonObj1 = new JSONObject();
        buttonObj1.put("name", "测试4" );
        JSONObject subObj3 = new JSONObject();
        subObj3.put("type", "view");
        subObj3.put("name", "测试5");
        subObj3.put("url", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + CmbcConstant.APPID+ "&redirect_uri=www.baidu.com&response_type=code&scope=snsapi_base&state=123456#wechat_redirect");
        JSONArray subArray1 = new JSONArray();
        subArray1.add(subObj3);
        buttonObj1.put("sub_button", subArray1);
        button.add(buttonObj1);

        JSONObject buttonObj2 = new JSONObject();
        buttonObj2.put("name", "信息" );
        JSONObject subObj4 = new JSONObject();
        subObj4.put("type", "view");
        subObj4.put("name", "测试8");
        subObj4.put("url", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + CmbcConstant.APPID+ "&redirect_uri=www.baidu.com&response_type=code&scope=snsapi_base&state=123456#wechat_redirect");
        JSONArray subArray2 = new JSONArray();
        subArray2.add(subObj4);
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
