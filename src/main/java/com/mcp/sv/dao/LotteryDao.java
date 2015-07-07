package com.mcp.sv.dao;

import com.mcp.sv.util.CmbcConstant;
import com.mcp.sv.util.MD5;
import com.mcp.sv.util.MongoConst;
import com.mcp.sv.util.MongoUtil;
import com.mongodb.*;
import com.mongodb.util.JSON;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Created by Administrator on 2015/5/26.
 */
public class LotteryDao {

    private static final Logger logger = LoggerFactory.getLogger(LotteryDao.class);

    //注册用户
    public static String register(String userName, String passWord, String rePassWord) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        List datas = MongoUtil.query(MongoConst.MONGO_USERS, param);
        logger.info("新用户注册：" + userName);
        if (datas.size() > 0) {
            return "用户名已存在";
        }
        if (!passWord.equals(rePassWord)) {
            return "两次密码输入不一致";
        }
        param.put("passWord", MD5.MD5Encode(passWord));
        int res = MongoUtil.save(MongoConst.MONGO_USERS, param);

        if (res != 0) {
            return "注册失败";
        }
        return "";
    }

    public static String login(String userName, String passWord) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        List datas = MongoUtil.query(MongoConst.MONGO_USERS, param);
        logger.info("用户登陆：" + userName + "  " + datas.size());
        if (datas.size() == 1) {
            DBObject user = (DBObject) datas.get(0);
            String dbPassWord = (String) user.get("passWord");
            if (MD5.MD5Encode(passWord).equals(dbPassWord)) {
                //登录成功
                return JSON.serialize(user);
            } else {
                return "密码输入错误";
            }
        } else if (datas.size() == 0) {
            return "没有这个用户";
        }
        return "登陆异常";
    }

    public static JSONObject login2(String userName, String passWord) throws Exception {
        //查询库中是否有此记录
        JSONObject returnObject = new JSONObject();
        Map param = new HashMap();
        param.put("userName", userName);
        List datas = MongoUtil.query(MongoConst.MONGO_USERS, param);
        if (datas.size() == 1) {
            DBObject user = (DBObject) datas.get(0);
            String dbPassWord = (String) user.get("passWord");
            if (MD5.MD5Encode(passWord).equals(dbPassWord)) {
                //登录成功
                returnObject = new JSONObject(user.toMap());
                returnObject.put("repCode", "0000");
            } else {
                returnObject.put("repCode", "1007");
                returnObject.put("description", "密码错误");
            }
        } else if (datas.size() == 0) {
            returnObject.put("repCode", "1009");
            returnObject.put("description", "重新注册");
        } else {
            returnObject.put("repCode", "9999");
            returnObject.put("description", "登录异常");
        }
        return returnObject;
    }

    public static String getUser(String userName, String passWord) throws JSONException {
        //查询库中是否有此记录
        JSONObject res = new JSONObject();
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("passWord", MD5.MD5Encode(passWord));
        List datas = MongoUtil.query(MongoConst.MONGO_USERS, param);
        if (datas.size() == 1) {
            res.put("repCode", CmbcConstant.SUCCESS);
            DBObject user = (DBObject) datas.get(0);
            res.put("user", new JSONObject(JSON.serialize(user)));
            //获取账户信息
            param.remove("passWord");
            datas = MongoUtil.query(MongoConst.MONGO_ACOUNT, param);
            if (datas.size() == 1) {
                DBObject acount = (DBObject) datas.get(0);
                res.put("acount", new JSONObject(JSON.serialize(acount)));
            }
            return res.toString();
        }
        res.put("repCode", CmbcConstant.ERROR);
        return res.toString();
    }

    public static JSONObject getOrder(String userName, String outerId) throws JSONException {
        //查询库中是否有此记录
        JSONObject res = new JSONObject();
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("outerId", outerId);
        List datas = MongoUtil.query(MongoConst.MONGO_TORDER, param);
        if (datas.size() == 1) {
            res.put("repCode", CmbcConstant.SUCCESS);
            DBObject order = (DBObject) datas.get(0);
            res.put("order", new JSONObject(JSON.serialize(order)));
            return res;
        }
        res.put("repCode", CmbcConstant.ERROR);
        return res;
    }


    public static List getTickets(String userName, String outerId) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("orderOuterId", outerId);
        List<DBObject> datas = MongoUtil.query(MongoConst.MONGO_TICKET, param);
        return datas;
    }


    public static String getOrder(String userName, String passWord, int curPage, int pageSize, String outerId) throws JSONException {
        //查询库中是否有此记录
        JSONObject res = new JSONObject();
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("passWord", MD5.MD5Encode(passWord));
        List datas = MongoUtil.query(MongoConst.MONGO_USERS, param);
        if (datas.size() == 1) {
            param.remove("passWord");
            if (outerId != null) {
                param.put("outerId", outerId);
            }
            datas = MongoUtil.queryForPage(MongoConst.MONGO_TORDER, param, curPage, pageSize);
            JSONArray results = new JSONArray();
            for (int i = 0; i < datas.size(); i++) {
                results.put(datas.get(i));
            }
            res.put("rst", results);
            res.put("repCode", CmbcConstant.SUCCESS);
            return res.toString();
        }
        res.put("repCode", CmbcConstant.ERROR);
        return res.toString();
    }





    //获取最新开奖信息
    public static List getWinNum(int curPage, int pageSize, String gameCode) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("gameCode", gameCode);
        List datas = MongoUtil.queryForPage(MongoConst.MONGO_TERM, param, curPage, pageSize);
        return datas;
    }


    //获取游戏开奖信息
    public static String getGameWinNum(int curPage, int pageSize, String gameCode) {
        //查询库中是否有此记录
        JSONObject res = new JSONObject();
        Map param = new HashMap();
        param.put("gameCode", gameCode);
        List datas = MongoUtil.queryForPage(MongoConst.MONGO_TERM, param, curPage, pageSize);
        JSONArray results = new JSONArray();
        for (int i = 0; i < datas.size(); i++) {
            results.put(datas.get(i));
        }
        try {
            res.put("rst", results);
            res.put("repCode", CmbcConstant.SUCCESS);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return res.toString();
    }


    public static String getLogs(String userName, String passWord, int curPage, int pageSize, int accountType) throws JSONException {
        //查询库中是否有此记录
        JSONObject res = new JSONObject();
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("passWord", MD5.MD5Encode(passWord));
        List datas = MongoUtil.query(MongoConst.MONGO_USERS, param);
        if (datas.size() == 1) {
            param.remove("passWord");
            //if (null != accountType) {
            param.put("type", accountType);
            // }
            datas = MongoUtil.queryForPage(MongoConst.MONGO_RECHARGE_LOG, param, curPage, pageSize);
            JSONArray results = new JSONArray();
            for (int i = 0; i < datas.size(); i++) {
                results.put(datas.get(i));
            }
            res.put("rst", results);
            res.put("repCode", CmbcConstant.SUCCESS);
            return res.toString();
        }
        res.put("repCode", CmbcConstant.ERROR);
        return res.toString();
    }


    public static String recharge(String userName, int money, boolean forign, String outerId) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        List datas = MongoUtil.query(MongoConst.MONGO_ACOUNT, param);
        logger.info("用户彩币更新：" + userName + "  " + datas.size() + "金额：" + money);
        if (datas.size() == 1) {
            DBObject acount = (DBObject) datas.get(0);
            int recharge = (int) acount.get("recharge");
            money += recharge;
            String acountStr = JSON.serialize(acount);
            DBObject newAcount = (DBObject) JSON.parse(acountStr);
            newAcount.put("recharge", money);
            int res = MongoUtil.update(MongoConst.MONGO_ACOUNT, acount, newAcount);
            if (res == 1) {
                if (forign) {
                    LotteryDao.insertLog(MongoConst.MONGO_RECHARGE_LOG, CmbcConstant.RECHARGETYPE, userName, recharge, money, money - recharge, outerId);
                }
                return "";
            } else {
                return "彩币更新失败";
            }
        } else if (datas.size() == 0) {
            param.put("recharge", money);
            int res = MongoUtil.save(MongoConst.MONGO_ACOUNT, param);
            if (res == 0) {
                if (forign) {
                    LotteryDao.insertLog(MongoConst.MONGO_RECHARGE_LOG, CmbcConstant.RECHARGETYPE, userName, 0, money, money, outerId);
                }
                return "";
            } else {
                return "彩币更新失败";
            }
        }
        return "彩币更新异常";
    }


    public static String reviceRecharge(String userName, int money, String outerId) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        List datas = MongoUtil.query(MongoConst.MONGO_ACOUNT, param);
        logger.info("用户彩币退款：" + userName + "  " + datas.size() + "金额：" + money);
        if (datas.size() == 1) {
            DBObject acount = (DBObject) datas.get(0);
            int recharge = (int) acount.get("recharge");
            money += recharge;
            String acountStr = JSON.serialize(acount);
            DBObject newAcount = (DBObject) JSON.parse(acountStr);
            newAcount.put("recharge", money);
            int res = MongoUtil.update(MongoConst.MONGO_ACOUNT, acount, newAcount);
            if (res == 1) {
                LotteryDao.insertLog(MongoConst.MONGO_RECHARGE_LOG, CmbcConstant.RECIVETYPE, userName, recharge, money, money - recharge, outerId);
                return "";
            } else {
                return "彩币更新失败";
            }
        }
        return "彩币更新异常";
    }


    public static String updatePrize(String userName, int money, String outerId) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        List datas = MongoUtil.query(MongoConst.MONGO_ACOUNT, param);
        logger.info("用户更新奖金：" + userName + "  " + datas.size() + "金额：" + money);
        if (datas.size() == 1) {
            DBObject acount = (DBObject) datas.get(0);
            int prize = 0;
            try {
                prize = (int) acount.get("prize");
            } catch (Exception e) {
                prize = 0;
            }
            money += prize;
            String acountStr = JSON.serialize(acount);
            DBObject newAcount = (DBObject) JSON.parse(acountStr);
            newAcount.put("prize", money);
            int res = MongoUtil.update(MongoConst.MONGO_ACOUNT, acount, newAcount);
            if (res == 1) {
                LotteryDao.insertLog(MongoConst.MONGO_RECHARGE_LOG, CmbcConstant.PRIZETYPE, userName, prize, money, money - prize, outerId);
                return "";
            } else {
                return "奖金更新失败";
            }
        }
        return "彩币奖金异常";
    }


    public static String prizeToRecharge(String userName, int money) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        List datas = MongoUtil.query(MongoConst.MONGO_ACOUNT, param);
        logger.info("用户奖金转彩金：" + userName + "  " + datas.size() + "金额：" + money);
        if (datas.size() == 1) {
            DBObject acount = (DBObject) datas.get(0);
            int prize = 0;
            int recharge=0;
            try {
                prize = (int) acount.get("prize");
                recharge = (int) acount.get("recharge");
            } catch (Exception e) {
                prize = 0;
                recharge = 0;
            }
            if (prize - money < 0) {
                return "奖金额度不够";
            }
            String acountStr = JSON.serialize(acount);
            DBObject newAcount = (DBObject) JSON.parse(acountStr);
            newAcount.put("prize", prize-money);
            newAcount.put("recharge", recharge+money);
            int res = MongoUtil.update(MongoConst.MONGO_ACOUNT, acount, newAcount);
            if (res == 1) {
                LotteryDao.insertLog(MongoConst.MONGO_RECHARGE_LOG, CmbcConstant.PRIZETYPE, userName, prize,  prize-money,-money, "ZCB");
                return "";
            } else {
                return "奖金更新失败";
            }
        }
        return "彩币奖金异常";
    }


    public static String updateUser(String userName, String passWord, String realName, String mobile, String identityId,String nickName) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("passWord", MD5.MD5Encode(passWord));
        List datas = MongoUtil.query(MongoConst.MONGO_USERS, param);
        if (datas.size() == 1) {
            DBObject user = (DBObject) datas.get(0);
            String userStr = JSON.serialize(user);
            DBObject newUser = (DBObject) JSON.parse(userStr);
            if(realName!=null){
                newUser.put("realName", realName);
            }
            if(mobile!=null){
                newUser.put("mobile", mobile);
            }
            if(identityId!=null){
                newUser.put("identityId", identityId);
            }
            if(nickName!=null){
                newUser.put("nickName", nickName);
            }
            int res = MongoUtil.update(MongoConst.MONGO_USERS, user, newUser);
            if (res == 1) {
                return "";
            } else {
                return "用户更新失败";
            }
        }
        return "用户更新异常";
    }


    //存储记录
    public static boolean insertLog(String tableName, int type, String userName, int beforeMoney, int afterMoney, int money, String outerId) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("type", type);
        param.put("beforeMoney", beforeMoney);
        param.put("afterMoney", afterMoney);
        param.put("money", money);
        param.put("orderId", outerId);
        param.put("createTime", LotteryDao.getTime());
        int res = MongoUtil.save(tableName, param);
        if (res == 0) {
            return true;
        }
        return false;
    }


    //存储订单
    public static boolean insertOrder(String userName, String outerId, int status, String body) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("outerId", outerId);
        param.put("status", status);  //未支付
        param.put("body", body);
        param.put("createTime", LotteryDao.getTime());
        int res = MongoUtil.save(MongoConst.MONGO_TORDER, param);
        if (res == 0) {
            return true;
        }
        return false;
    }

    //存储充值订单
    public static boolean insertCzOrder(String userName, String out_trade_no, String total_fee, int status) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("userName", userName);
        param.put("czId", out_trade_no);
        param.put("money", total_fee);
        param.put("status", status);  //未支付
        param.put("createTime", LotteryDao.getTime());
        int res = MongoUtil.save(MongoConst.MONGO_ALIPAY, param);
        if (res == 0) {
            return true;
        }
        return false;
    }

    //支付宝充值
    public static boolean alipayRecharge(String out_trade_no) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("czId", out_trade_no);
        List datas = MongoUtil.query(MongoConst.MONGO_ALIPAY, param);
        if (datas.size() == 1) {
            DBObject czOrder = (DBObject) datas.get(0);
            int status = (int) czOrder.get("status");
            if (status == 1100) {
                String czOrderStr = JSON.serialize(czOrder);
                DBObject newCzOrder = (DBObject) JSON.parse(czOrderStr);
                newCzOrder.put("status", 1200);
                int res = MongoUtil.update(MongoConst.MONGO_ALIPAY, czOrder, newCzOrder);
                if (res == 1) {
                    logger.error("开始充值");
                    String userName = (String) czOrder.get("userName");
                    int money = Integer.parseInt((String) czOrder.get("money"));
                    LotteryDao.recharge(userName, money * 100, true, out_trade_no);
                    return true;
                } else {
                    logger.error("出现问题：" + out_trade_no + " 数据库操作出错");
                    return false;
                }
            } else if (status == 1200) {
                //已经操作过
                logger.error("已处理过：" + out_trade_no);
                return false;
            }

        } else if (datas.size() == 0) {
            logger.error("出现问题：" + out_trade_no + " 无此充值订单号");
            return false;
        }
        return false;
    }


    //更改订单状态
    public static String updateOrderStatus(String outerId, int status) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("outerId", outerId);
        List datas = MongoUtil.query(MongoConst.MONGO_TORDER, param);
        logger.info("用户订单状态更新：" + datas.size() + "  " + "状态：" + status + "  " + "outerId：" + outerId);
        if (datas.size() == 1) {
            DBObject order = (DBObject) datas.get(0);
            int pk_status = (int) order.get("status");
            if (pk_status == status) {
                logger.info("用户订单状态更新：" + datas.size() + "  " + "状态：" + status + "已更新过，不再更新  " + "outerId：" + outerId);
                return "";
            }
            if(pk_status==CmbcConstant.ORDER_4002 && status==CmbcConstant.ORDER_4000){
                status=CmbcConstant.ORDER_4001;
            }
            if(pk_status==CmbcConstant.ORDER_4000 && status==CmbcConstant.ORDER_4002){
                status=CmbcConstant.ORDER_4001;
            }
            if(pk_status==CmbcConstant.ORDER_4001 && status==CmbcConstant.ORDER_4002){
                logger.info("用户订单状态更新：" + datas.size() + "  " + "状态：" + status + "部分出票成功，不再更新  " + "outerId：" + outerId);
                return "";
            }
            if(pk_status==CmbcConstant.ORDER_4001 && status==CmbcConstant.ORDER_4000){
                logger.info("用户订单状态更新：" + datas.size() + "  " + "状态：" + status + "部分出票成功，不再更新  " + "outerId：" + outerId);
                return "";
            }
            if (pk_status == CmbcConstant.ORDER_5000) {  //已中奖  也不更新
                logger.info("用户订单状态更新：" + datas.size() + "  " + "状态：" + pk_status + "中奖状态不更新  " + "outerId：" + outerId);
                return "";
            }
            String orderStr = JSON.serialize(order);
            DBObject newOrder = (DBObject) JSON.parse(orderStr);
            newOrder.put("status", status);
            int res = MongoUtil.update(MongoConst.MONGO_TORDER, order, newOrder);
            if (res == 1) {
                return "";
            } else {
                return "用户订单状态更新失败";
            }
        } else if (datas.size() == 0) {
            return "找不到此订单：" + outerId;
        }
        return "用户订单状态更新异常";
    }

    //更改彩票状态
    public static String updateTicketStatus(String outerId, int status, int bonus, String dNumber,String printTime) {
        //查询库中是否有此记录
        Map param = new HashMap();
        param.put("outerId", outerId);
        List datas = MongoUtil.query(MongoConst.MONGO_TICKET, param);
        logger.info("彩票状态更新：" + datas.size() + "  " + "状态：" + status + "  " + "outerId：" + outerId);
        if (datas.size() == 1) {
            DBObject order = (DBObject) datas.get(0);
            String orderStr = JSON.serialize(order);
            DBObject newOrder = (DBObject) JSON.parse(orderStr);
            newOrder.put("status", status);
            if (bonus > 0) {
                newOrder.put("bonus", bonus);
            }
            if (dNumber != null) {
                newOrder.put("dNumber", dNumber);
            }
            if (printTime != null) {
                newOrder.put("printTime", printTime);
            }
            int res = MongoUtil.update(MongoConst.MONGO_TICKET, order, newOrder);
            if (res == 1) {
                return "";
            } else {
                return "彩票状态更新失败 " + outerId;
            }
        } else if (datas.size() == 0) {
            return "找不到此彩票：" + outerId;
        }
        return "彩票状态更新异常 " + outerId;
    }


    public static long getWealthList(long recharge) {
        DBCollection collection = MongoUtil.getDb().getCollection(MongoConst.MONGO_ACOUNT);
        long count = collection.count(new BasicDBObject("recharge", new BasicDBObject("$gte", recharge)));
        return count;
    }

    public static String getTime() {
        String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
        SimpleDateFormat format = new SimpleDateFormat(DATE_FORMAT, Locale.getDefault());
        return format.format(new java.util.Date());
    }
}
