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


}
