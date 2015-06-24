package com.mcp.sv.dao;


import com.mcp.sv.util.CmbcConstant;
import com.mcp.sv.util.MongoConst;
import com.mcp.sv.util.MongoUtil;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2015/6/4.
 */
public class NotifyDao {

    private static final Logger logger = LoggerFactory.getLogger(NotifyDao.class);

    public static void dealN02(JSONObject bodyObj) throws JSONException {
        JSONArray tickets = bodyObj.getJSONArray("tickets");
        for (int i = 0; i < tickets.length(); i++) {
            JSONObject ticket = tickets.getJSONObject(i);
            String outerId = ticket.getString("outerId");
            int status = ticket.getInt("status");
            if (status == 1000) {
                //出票状态通知
                int printStatus = ticket.getInt("printStatus");
                //出票成功
                if (printStatus == 1300) {
                    String rstInfo =LotteryDao.updateTicketStatus(outerId, CmbcConstant.ORDER_4000, 0);
                    logger.info(rstInfo);
                }
                //出票失败
                else if (status > 1500) {
                    LotteryDao.updateTicketStatus(outerId, CmbcConstant.ORDER_4001, 0);
                } else {
                    logger.error(outerId + "   未知状态: " + printStatus);
                }
            } else {
                //中奖通知
                if (status == 1200) {
                    //已中奖
                    int bonus = ticket.getInt("bonus");
                    Map map = new HashMap();
                    map.put("outerId", outerId);
                    List list = MongoUtil.query(MongoConst.MONGO_TICKET, map);
                    DBObject _ticket = (DBObject) list.get(0);
                    String orderOuterId = (String) _ticket.get("orderOuterId");
                    logger.info("************已中奖更新订单");
                    LotteryDao.updateOrderStatus(orderOuterId, CmbcConstant.ORDER_5000);
                    logger.info("************已中奖更新彩票");
                    LotteryDao.updateTicketStatus(outerId, CmbcConstant.ORDER_5000, bonus);
                } else if (status == 1300) {
                    //未中奖
                    LotteryDao.updateTicketStatus(outerId, CmbcConstant.ORDER_5001, 0);
                } else {
                    //已退款
                    LotteryDao.updateTicketStatus(outerId, CmbcConstant.ORDER_4002, 0);
                }
            }
        }
    }

    public static void dealN07(JSONObject bodyObj) throws JSONException {
        String gameCode = bodyObj.getString("gameCode");
        String termCode = bodyObj.getString("termCode");
        String wNum = bodyObj.getString("wNum");
        DBObject termInfo = new BasicDBObject();
        termInfo.put("gameCode", gameCode);
        termInfo.put("termCode", termCode);
        termInfo.put("wNum", wNum);
        MongoUtil.insert(MongoConst.MONGO_TERM, termInfo);
    }

    public static void dealN08(JSONObject bodyObj) throws JSONException {
        String gameCode = bodyObj.getString("gameCode");
        String termCode = bodyObj.getString("termCode");
        logger.info("---------------   N08    " + gameCode + "   " + termCode);
    }

}
