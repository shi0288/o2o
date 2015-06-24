package com.mcp.sv.cmbc;

import com.mcp.sv.dao.NotifyDao;
import com.mcp.sv.model.DataObject;
import com.mcp.sv.util.*;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by w44 on 2015/6/21.
 */
@Controller
@RequestMapping(value = "notify")
public class NotifyController {

    private static Logger logger = Logger.getLogger(NotifyController.class);


    @RequestMapping(value = "/deal.htm", method = {RequestMethod.POST})
    @ResponseBody
    public void deal(DataObject dataObject) {
        try {
            logger.error("dataObject: " + dataObject.getMessage().toString());
            JSONObject message = dataObject.getMessage();
            JSONObject headObj = message.getJSONObject("head");
            JSONObject bodyObj = new JSONObject(message.getString("body"));
            if (verityMessage(headObj, bodyObj)) {
                String cmd = headObj.getString("cmd");
                logger.info(cmd + "平台来源校验成功");
                switch (cmd) {
                    case "N02":
                        NotifyDao.dealN02(bodyObj);
                        break;
                    case "N07":
                        NotifyDao.dealN07(bodyObj);
                        break;
                    case "N08":
                        NotifyDao.dealN08(bodyObj);
                        break;
                    default:
                        logger.info(cmd + " 命令不处理");
                }
            } else {
                logger.error("校验不成功，非平台发来的数据");
            }
        } catch (JSONException e) {
            logger.error("====== 出错  ======");
            e.printStackTrace();
        }

    }

    public boolean verityMessage(JSONObject headObj, JSONObject bodyObj) throws JSONException {
        String digest = headObj.getString("digest");
        String timestamp = headObj.getString("timestamp");
        String localDigest = MD5.MD5Encode(bodyObj.toString() + timestamp + com.mcp.sv.util.CmbcConstant.MCP_KEY);
        if (digest.equals(localDigest)) {
            return true;
        }
        return false;

    }

    public static void main(String[] args) throws JSONException {

        String str = "{\"head\":{\"digest\":\"9eb15863f81e36efe62e3e9e9e20055a\",\"digestType\":\"md5\",\"cmd\":\"N02\",\"timestamp\":\"2015-06-24 18:09:55\",\"message\":\"cc7a0bac2af74c758dfc82ab5ee46b9a\",\"vsrsion\":\"1.0\"},\"body\":\"{\\\"tickets\\\":[{\\\"id\\\":214,\\\"outerId\\\":\\\"1435132410301rrj11exw29\\\",\\\"customerId\\\":\\\"Q0001\\\",\\\"printId\\\":\\\"C0001\\\",\\\"gameCode\\\":\\\"T01\\\",\\\"termCode\\\":\\\"15072\\\",\\\"auditTermCode\\\":\\\"\\\",\\\"pType\\\":\\\"00\\\",\\\"bType\\\":\\\"00\\\",\\\"createTime\\\":\\\"2015-06-24 16:02:01\\\",\\\"auditTime\\\":\\\"2015-06-24 15:53:30\\\",\\\"printTime\\\":\\\"\\\",\\\"cashAmount\\\":0,\\\"cashTime\\\":\\\"\\\",\\\"cashTerminal\\\":null,\\\"prizeTime\\\":\\\"\\\",\\\"status\\\":1000,\\\"printStatus\\\":1100,\\\"multiple\\\":1,\\\"amount\\\":200,\\\"bonus\\\":0,\\\"bonusDetail\\\":\\\"\\\",\\\"number\\\":\\\"02,03,11,13,19|09,10\\\",\\\"dNumber\\\":\\\"\\\",\\\"rNumber\\\":\\\"\\\",\\\"bonusBeforeTax\\\":0,\\\"bonusStatus\\\":-1,\\\"orderId\\\":197,\\\"province\\\":\\\"\\\",\\\"seq\\\":\\\"\\\",\\\"passw\\\":\\\"\\\",\\\"terminal\\\":\\\"\\\",\\\"presetTerminal\\\":\\\"0000\\\",\\\"version\\\":0,\\\"maxAwardMoney\\\":0,\\\"taxStatus\\\":-1}]}\"}";
        JSONObject mes = new JSONObject(str);
        String digest = mes.getJSONObject("head").getString("digest");
        System.out.println(digest);
        String body = mes.getString("body");
        System.out.println(MD5.MD5Encode(body + mes.getJSONObject("head").get("timestamp") + com.mcp.sv.util.CmbcConstant.MCP_KEY));


    }


}
