package com.mcp.sv.intrefaceTest;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mcp.core.util.StringUtil;
import com.mcp.sv.util.CmbcConstant;
import com.mcp.sv.util.HttpClientWrapper;

/**
 * Created by ChubChen on 2015/6/3.
 */
public class QueryToken {

    private static final String URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&";

    public static void main(String[] args){
        String url = URL+"appid=" + CmbcConstant.APPID +"&secret=" + CmbcConstant.APPSECRET;
        String result = HttpClientWrapper.getUrl(url);
        System.out.println(result);
        JSONObject jsonObject = JSON.parseObject(result);
        String access_token =  jsonObject.get("access_token").toString();
        String expires_in =   jsonObject.get("expires_in").toString();
        if(!StringUtil.isEmpty(access_token)){
            //   WeiXinDao.updateToken(access_token);
        }
     /*   String token = "MPN6SWAH3F-lbYlTA30g3pyV7xbNcjNk0GF8L0fEzfJQZOl3lnFz9Fb0R9QQvv-_icsDU-RVXdNId6UUFeZY1cnlHsMc9tjCQCfiD7plZmE";
        String url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+token+"&openid=o0LrFuAlDa3g0QG-SPTsIyJDUrc4&lang=zh_CN";
        String result = HttpClientWrapper.getUrl(url);
        System.out.println(result);*/
    }
}
