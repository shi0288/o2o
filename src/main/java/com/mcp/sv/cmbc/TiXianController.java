package com.mcp.sv.cmbc;

import com.mcp.sv.dao.LotteryDao;
import com.mcp.sv.model.OldBean;
import com.mcp.sv.util.MongoConst;
import com.mcp.sv.util.MongoUtil;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.UUID;

/**
 * Created by ChubChen on 2015/6/2.
 */

@Controller
@RequestMapping(value = "moneyControl")
public class TiXianController {


    private static Logger logger = Logger.getLogger(TiXianController.class);

    public TiXianController() {
    }

    @RequestMapping(value = "confirmMoney", method = RequestMethod.POST)
    @ResponseBody
    public String confirmOrders(OldBean oldBean) throws JSONException {
        String userName = oldBean.getUserName();
        String passWord = oldBean.getPassWord();
        String identityId = oldBean.getIdentityId();
        String mobile = oldBean.getMobile();
        int amount = oldBean.getAmount();
        int prize = 0;
        org.codehaus.jettison.json.JSONObject res = new org.codehaus.jettison.json.JSONObject();
        try {
            org.codehaus.jettison.json.JSONObject userInfo = new org.codehaus.jettison.json.JSONObject(LotteryDao.getUser(userName, passWord));
            if (userInfo == null) {
                res.put("repCode", "1001"); //用户权限校验未通过
                return res.toString();
            }
            if (userInfo.has("acount")) {
                org.codehaus.jettison.json.JSONObject acount = userInfo.getJSONObject("acount");
                prize = acount.getInt("prize");
            } else {
                res.put("repCode", "1007");
                return res.toString();
            }
            logger.info("发起提现请求 " + userName);
        } catch (JSONException e) {
            try {
                e.printStackTrace();
                res.put("repCode", "9999");
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return res.toString();
        }
        //进行提现
        if (amount > prize) {
            res.put("repCode", "1008");  //奖金不够提现
            return res.toString();
        }

        //减去奖金
        String outerId = UUID.randomUUID().toString().replace("-", "");
        String rstStr = LotteryDao.updatePrize(userName, -amount, outerId);
        if("".equals(rstStr)){
            //更新到表中
            DBObject tiXianObject = new BasicDBObject();
            tiXianObject.put("outerId",outerId);
            tiXianObject.put("amount",amount);
            tiXianObject.put("mobile",mobile);
            tiXianObject.put("identityId",identityId);
            tiXianObject.put("userName",userName);
            tiXianObject.put("status",1000); //未处理
            tiXianObject.put("createTime",LotteryDao.getTime());
            MongoUtil.insert(MongoConst.MONGO_TIXIAN, tiXianObject);
            res.put("repCode", "0000");
        }
        return res.toString();
    }


}
