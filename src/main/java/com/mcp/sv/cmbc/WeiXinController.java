package com.mcp.sv.cmbc;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mcp.sv.dao.LotteryDao;
import com.mcp.sv.dao.WeiXinDao;
import com.mcp.sv.model.WeChat;
import com.mcp.sv.service.CoreService;
import com.mcp.sv.util.CmbcConstant;
import com.mcp.sv.util.MD5;
import com.mcp.sv.util.SignUtil;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.Map;

/**
 * Created by ChubChen on 2015/6/2.
 */
@Controller
@RequestMapping(value = "weixin")
public class WeiXinController {

    private static Logger logger = Logger.getLogger(WeiXinController.class);

    @RequestMapping(value = "/api", method = RequestMethod.GET)
    @ResponseBody
    public String xxtInterface(WeChat wc) {
        System.out.println("/api");
        String signature = wc.getSignature(); // 微信加密签名
        String timestamp = wc.getTimestamp(); // 时间戳
        String nonce = wc.getNonce();// 随机数
        String echostr = wc.getEchostr();// 随机字符串

        // 通过检验signature对请求进行校验，若校验成功则原样返回echostr，表示接入成功，否则接入失败
        if (SignUtil.checkSignature(signature, timestamp, nonce)) {
            return echostr;
        } else {
            System.out.println("不是微信服务器发来的请求,请小心!");
            return null;
        }
    }

    @RequestMapping(value = "/api", method = RequestMethod.POST)
    @ResponseBody
    public String getWeiXinMessage(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // 将请求、响应的编码均设置为UTF-8（防止中文乱码）
        request.setCharacterEncoding("UTF-8");  //微信服务器POST消息时用的是UTF-8编码，在接收时也要用同样的编码，否则中文会乱码；
        response.setCharacterEncoding("UTF-8"); //在响应消息（回复消息给用户）时，也将编码方式设置为UTF-8，原理同上；
        logger.info("微信消息推送");
        //判断token的缓存情况 ， 更新缓存
        try {
            Map token = WeiXinDao.findToken();
            if (token.containsKey("updateTime")) {
                long updateTime = (Long) token.get("updateTime");
                if (new Date().getTime() - updateTime > 1000 * 60 * 100) {//大于1小时40分钟 更新token
                    String result = com.mcp.sv.util.HttpClientWrapper.getUrl(CmbcConstant.QUERY_TOKEN_URL);
                    logger.info("查询到的token，并更新" + result);
                    JSONObject jsonObject = JSON.parseObject(result);
                    String access_token = jsonObject.get("access_token").toString();
                    String expires_in = jsonObject.get("expires_in").toString();
                    WeiXinDao.updateToken(access_token);
                }
            } else {
                String result = com.mcp.sv.util.HttpClientWrapper.getUrl(CmbcConstant.QUERY_TOKEN_URL);
                logger.info("查询到的token，并更新" + result);
                JSONObject jsonObject = JSON.parseObject(result);
                String access_token = jsonObject.get("access_token").toString();
                String expires_in = jsonObject.get("expires_in").toString();
                WeiXinDao.saveToken(access_token);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        //初始化配置文件
        String respMessage = CoreService.processRequest(request);//调用CoreService类的processRequest方法接收、处理消息，并得到处理结果；

        // 响应消息
        //调用response.getWriter().write()方法将消息的处理结果返回给用户

        return new String(respMessage.getBytes("utf-8"), "ISO8859_1");
    }

    @RequestMapping(value = "/callback", method = {RequestMethod.POST, RequestMethod.GET})
    public String getWeiXinCallback(HttpServletRequest request, HttpServletResponse response) throws Exception {
        //第一步微信 登陆认证回掉地址
        String webcode = request.getParameter("code");
        String state = request.getParameter("state");
        logger.info("webCode:" + webcode);
        logger.info("state:" + state);
        //根据 webCode 获webtoken  并获取用户的 openId
        String webTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + com.mcp.sv.util.CmbcConstant.APPID + "&secret=" + CmbcConstant.APPSECRET + "&code=" + webcode + "&grant_type=authorization_code";
        String result = com.mcp.sv.util.HttpClientWrapper.getUrl(webTokenUrl);
        JSONObject jsonObject = JSON.parseObject(result);
        String username = jsonObject.getString("openid");
        String passWord = username + CmbcConstant.CMBC_SIGN_KEY;
        org.codehaus.jettison.json.JSONObject userJson = null;
        try {
            userJson = LotteryDao.login2(username, passWord);
        } catch (Exception e) {
            e.printStackTrace();
            result = com.mcp.sv.util.HttpClientWrapper.getUrl(webTokenUrl);
            jsonObject = JSON.parseObject(result);
            username = jsonObject.getString("openid");
            passWord = username + CmbcConstant.CMBC_SIGN_KEY;
            userJson = LotteryDao.login2(username, passWord);
        }
        if (userJson.get("repCode").equals("0000")) {
            logger.info("session存放登陆状态");
            request.getSession().setAttribute("userInfo", userJson.toString());
            request.setAttribute("userInfo", userJson.toString());
        } else if (userJson.get("repCode").equals("1009")) {
            LotteryDao.register(username, username + CmbcConstant.CMBC_SIGN_KEY, username + CmbcConstant.CMBC_SIGN_KEY);
            userJson = LotteryDao.login2(username, passWord);
            logger.info("session存放登陆状态");
            request.getSession().setAttribute("userInfo", userJson.toString());
            request.setAttribute("userInfo", userJson.toString());
        }

        logger.info("微信打开的链接。登陆用户信息是： " + userJson.toString());
        String nickName = "";
        try {
            nickName = (String) userJson.get("nickName");
        } catch (Exception e) {
            logger.error("用户无nickName，本次获取并保存 ：" + username);
            nickName = this.getUserNickName(username);
            logger.error("nickName: " + nickName);
            LotteryDao.updateUser(username, username + CmbcConstant.CMBC_SIGN_KEY, null, null, null, nickName);
        }
        //根据参数 state 可以跳转到不同菜单的页面
        return "redirect:/cmbc/" + state + ".jsp";
    }

    public String getUserNickName(String openId) {
        Map token = WeiXinDao.findToken();
        String tempToken = "";
        try {
            if (token.containsKey("updateTime")) {
                long updateTime = (Long) token.get("updateTime");
                if (new Date().getTime() - updateTime > 1000 * 60 * 100) {//大于1小时40分钟 更新token
                    String result = com.mcp.sv.util.HttpClientWrapper.getUrl(CmbcConstant.QUERY_TOKEN_URL);
                    JSONObject jsonObject = JSON.parseObject(result);
                    tempToken = jsonObject.get("access_token").toString();
                    WeiXinDao.updateToken(tempToken);
                }
            } else {
                String result = com.mcp.sv.util.HttpClientWrapper.getUrl(CmbcConstant.QUERY_TOKEN_URL);
                JSONObject jsonObject = JSON.parseObject(result);
                tempToken = jsonObject.get("access_token").toString();
                WeiXinDao.saveToken(tempToken);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if ("".equals(tempToken)) {
            tempToken = (String) token.get("value");
        }
        String webForUserUrl = CmbcConstant.QUERY_USEINFO_URL.replace("%ACCESS_TOKEN%", tempToken).replace("%OPENID%", openId);
        String result = com.mcp.sv.util.HttpClientWrapper.getUrl(webForUserUrl);
        JSONObject jsonObject = JSON.parseObject(result);
        String nickname = jsonObject.get("nickname").toString();
        return nickname;
    }


}
