package com.mcp.sv.cmbc;

import com.mcp.sv.dao.JcDao;
import com.mcp.sv.dao.LotteryDao;
import com.mcp.sv.model.OldBean;
import com.mcp.sv.util.*;
import com.mcp.sv.util.CmbcConstant;
import com.mcp.sv.util.HttpClientWrapper;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by ChubChen on 2015/6/2.
 */

@Controller
@RequestMapping(value = "bankServices/LotteryService")
public class LotteryService {


    private static Logger logger = Logger.getLogger(LotteryService.class);
    //private static RedisCilent redisCilent = new RedisCilent();

    public LotteryService() {
    }


    @RequestMapping(value = "confirmOrders", method = RequestMethod.POST)
    @ResponseBody
    public String confirmOrders(OldBean oldBean) throws JSONException {
        String userName = oldBean.getUserName();
        String passWord = oldBean.getPassWord();
        String outerId = oldBean.getOuterId();
        String body = oldBean.getBody();
        //判断用户权限
        org.codehaus.jettison.json.JSONObject res = new org.codehaus.jettison.json.JSONObject();
        try {
            org.codehaus.jettison.json.JSONObject userInfo = new org.codehaus.jettison.json.JSONObject(LotteryDao.getUser(userName, passWord));
            if (userInfo == null) {
                res.put("repCode", "1001"); //用户权限校验未通过
                return res.toString();
            }
            logger.info("发起投注 " + userName);
        } catch (JSONException e) {
            try {
                e.printStackTrace();
                res.put("repCode", "9999");
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return res.toString();
        }
        //放入订单库
        boolean orderInsertRes = LotteryDao.insertOrder(userName, outerId, com.mcp.sv.util.CmbcConstant.ORDER_1000, body);
        if (!orderInsertRes) {
            try {
                res.put("repCode", "9999");
                return res.toString();
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        //票据分开储存
        JSONObject orderBody = new JSONObject(body);
        JSONObject order = orderBody.getJSONObject("order");
        String orderOuterId = order.getString("outerId");
        JSONArray tickets = order.getJSONArray("tickets");
        for (int i = 0; i < tickets.length(); i++) {
            JSONObject ticket = tickets.getJSONObject(i);
            ticket.put("userName", userName);
            ticket.put("orderOuterId", orderOuterId);
            String ticketStr = ticket.toString();
            DBObject newTicket = (DBObject) JSON.parse(ticketStr);
            MongoUtil.insert(MongoConst.MONGO_TICKET, newTicket);
        }
        res.put("repCode", "0000");
        return res.toString();
    }

    @RequestMapping(value = "commitOrders", method = RequestMethod.POST)
    @ResponseBody
    public String commitOrders(OldBean oldBean) throws JSONException {
        String userName = oldBean.getUserName();
        String passWord = oldBean.getPassWord();
        String outerId = oldBean.getOuterId();
        String payType = oldBean.getPayType();
        String resMessage = "";
        int recharge = 0;
        org.codehaus.jettison.json.JSONObject res = new org.codehaus.jettison.json.JSONObject();
        //彩币支付
        if ("1".equals(payType)) {
            //校验用户权限
            try {
                org.codehaus.jettison.json.JSONObject userInfo = new org.codehaus.jettison.json.JSONObject(LotteryDao.getUser(userName, passWord));
                if (userInfo.has("acount")) {
                    org.codehaus.jettison.json.JSONObject acount = userInfo.getJSONObject("acount");
                    recharge = acount.getInt("recharge");
                } else {
                    res.put("repCode", "1007");
                    return res.toString();
                }
                logger.info("发起投注 " + userName + "账户余额:" + recharge);
            } catch (JSONException e) {
                try {
                    e.printStackTrace();
                    res.put("repCode", "9999");
                } catch (JSONException e1) {
                    e1.printStackTrace();
                }
                return res.toString();
            }

            //获取订单信息
            int amount = 0;
            org.codehaus.jettison.json.JSONObject body = null;
            org.codehaus.jettison.json.JSONObject rst = LotteryDao.getOrder(userName, outerId);
            if (com.mcp.sv.util.CmbcConstant.SUCCESS.equals(rst.get("repCode"))) {
                org.codehaus.jettison.json.JSONObject order = rst.getJSONObject("order");
                String bodyStr = order.getString("body");
                body = new org.codehaus.jettison.json.JSONObject(bodyStr);
                org.codehaus.jettison.json.JSONObject _order = body.getJSONObject("order");
                //判断是否已经支付过
                int orderStatus = order.getInt("status");
                if (CmbcConstant.ORDER_1000 != orderStatus) {
                    logger.error("订单已经支付过，不再处理：  " + outerId);
                    res.put("repCode", "1008");  //已经支付过
                    return res.toString();
                }
                amount = _order.getInt("amount");
            } else {
                res.put("repCode", "9999");
                return res.toString();
            }
            //判断余额
            if (recharge - amount < 0) {
                try {
                    res.put("repCode", "1007");
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                return res.toString();
            }
            //投注
            if (body != null) {
                try {
                    resMessage = com.mcp.sv.util.HttpClientWrapper.mcpPost(com.mcp.sv.util.CmbcConstant.MCP_CT03, body.toString());
                    logger.info("收到的：  " + resMessage);
                    org.codehaus.jettison.json.JSONObject transRes = new org.codehaus.jettison.json.JSONObject(resMessage);
                    String repCode = (String) transRes.get("repCode");
                    if ("0000".equals(repCode)) {
                        //插入消费记录
                        boolean is = LotteryDao.insertLog(MongoConst.MONGO_RECHARGE_LOG, com.mcp.sv.util.CmbcConstant.TRANSTYPE, userName, recharge, recharge - amount, amount, outerId);
                        //更新订单状态送达
                        if (!"".equals(LotteryDao.updateOrderStatus(outerId, com.mcp.sv.util.CmbcConstant.ORDER_2000))) {
                            //订单更新送达状态未成功处理
                        }
                        if (is) {
                            //扣除账户金钱
                            String result = LotteryDao.recharge(userName, -amount, false, null);
                            if ("".equals(result)) {
                                if (!"".equals(LotteryDao.updateOrderStatus(outerId, com.mcp.sv.util.CmbcConstant.ORDER_3000))) {
                                    //订单更新已支付状态未成功处理
                                }
                                return resMessage;
                            } else {
                                //未扣除账户彩币处理
                            }
                        } else {
                            //未插入消费记录处理
                        }
                    } else {
                        //投注出错处理
                        JSONObject errRst = new JSONObject();
                        errRst.put("repCode", repCode);
                        JSONArray tickets = transRes.getJSONObject("order").getJSONArray("tickets");
                        JSONObject ticket = tickets.getJSONObject(0);
                        errRst.put("description", ticket.getString("description"));
                        logger.error(errRst.toString());
                        return errRst.toString();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            return resMessage;//不是投注的请求。其它的请求。
        }
        return resMessage;
    }


    /**
     * 获取期次信息
     */
    @RequestMapping(value = "getTerms", method = RequestMethod.POST)
    @ResponseBody
    public String getTerms(OldBean oldBean) {
        String body = oldBean.getBody();
        String resMessage = "";
        //取期次
        System.out.println(body);
        if (body != null) {
            try {
                resMessage = HttpClientWrapper.mcpPost(com.mcp.sv.util.CmbcConstant.MCP_CQ01, body);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return resMessage;
    }

    /**
     * 获取竞彩期次信息
     */
    @RequestMapping(value = "getJcInfo", method = RequestMethod.POST)
    @ResponseBody
    public String getJcInfo(OldBean oldBean) {
        String resMessage = "";
        String body = "";
        String head = oldBean.getHead();
        //取期次
        if (head != null) {
            try {
                resMessage = JcDao.getFormat(head, body);
                //System.out.println("收到的竞彩信息：  " + resMessage);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return resMessage;
    }


    //非投注请求 直接发送向平台
    @RequestMapping(value = "commonTransQuery", method = RequestMethod.POST)
    @ResponseBody
    public String commonTransQuery(OldBean oldBean) {
        String body = oldBean.getBody();
        String resMessage = "";
        //先调用投注接口。
        try {
            resMessage = HttpClientWrapper.mcpPost(CmbcConstant.MCP_CQ22, body);
            logger.info(resMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return  resMessage;
    }


    /**
     * 用户注册
     */
    @RequestMapping(value = "register", method = RequestMethod.POST)
    @ResponseBody
    public String register(OldBean oldBean) {
        String username = oldBean.getUserName();
        String passWord = oldBean.getPassWord();
        String rePassWord = oldBean.getRePassWord();
        String description = LotteryDao.register(username, passWord, rePassWord);
        return toResult(description);
    }

    /**
     * 用户登陆
     */
    @RequestMapping(value = "login", method = RequestMethod.POST)
    @ResponseBody
    public String login(OldBean oldBean) {
        String username = oldBean.getUserName();
        String passWord = oldBean.getPassWord();
        String description = LotteryDao.login(username, passWord);
        return toResult(description);
    }

//    /**
//     * 用户充值
//     */
//    @RequestMapping(value = "recharge", method = RequestMethod.POST)
//    @ResponseBody
//    public String recharge(OldBean oldBean) {
//        int money = oldBean.getMoney();
//        String username = oldBean.getUserName();
//        String description = LotteryDao.recharge(username, money, false, null);
//        return toResult(description);
//    }

    /**
     * 用户信息
     */
    @RequestMapping(value = "getUser", method = RequestMethod.POST)
    @ResponseBody
    public String getUser(OldBean oldBean) {
        String username = oldBean.getUserName();
        String passWord = oldBean.getPassWord();
        String description = null;
        try {
            description = LotteryDao.getUser(username, passWord);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return description;
    }

    /**
     * 更新用户信息
     */
    @RequestMapping(value = "updateUser", method = RequestMethod.POST)
    @ResponseBody
    public String updateUser(OldBean oldBean) {
        String username = oldBean.getUserName();
        String passWord = oldBean.getPassWord();
        String realName = oldBean.getRealName();
        String mobile = oldBean.getMobile();
        String identityId = oldBean.getIdentityId();
        String description = LotteryDao.updateUser(username, passWord, realName, mobile, identityId,null);
        JSONObject rst=new JSONObject();
        try {
            if("".equals(description)){
                rst.put("repCode","0000");
            }else{
                rst.put("repCode","9999");
                rst.put("description",description);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return rst.toString();
    }



    /**
     * 订单信息
     */
    @RequestMapping(value = "getOrder", method = RequestMethod.POST)
    @ResponseBody
    public String getOrder(OldBean oldBean) {
        String username = oldBean.getUserName();
        int curPage = oldBean.getCurPage();
        String passWord = oldBean.getPassWord();
        int pageSize = oldBean.getPageSize();
        String outerId = oldBean.getOuterId();
        String description = null;
        try {
            description = LotteryDao.getOrder(username, passWord, curPage, pageSize, outerId);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return description;
    }


    /**
     * 开奖信息
     */
    @RequestMapping(value = "getWinNum", method = RequestMethod.POST)
    @ResponseBody
    public String geWinNum(OldBean oldBean) {
        JSONObject res = new JSONObject();
        try {
            res.put("repCode", CmbcConstant.SUCCESS);
            JSONArray results = new JSONArray();
            for (int i = 0; i < CmbcConstant.GAMECODE.length; i++) {
                String gameCode = CmbcConstant.GAMECODE[i];
                List list = LotteryDao.getWinNum(1, 1, gameCode);
                if (list.size()==1) {
                    results.put(list.get(0));
                }
            }
            res.put("rst", results);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return res.toString();
    }

    /**
     * 开奖信息
     */
    @RequestMapping(value = "getGameWinNum", method = RequestMethod.POST)
    @ResponseBody
    public String getGameWinNum(OldBean oldBean) {
        String gameCode = oldBean.getGameCode();
        int curPage = oldBean.getCurPage();
        int pageSize = oldBean.getPageSize();
        String description = null;
        description = LotteryDao.getGameWinNum(curPage, pageSize, gameCode);
        return description;
    }


    /**
     * 奖金转彩金
     */
    @RequestMapping(value = "prizeToRecharge", method = RequestMethod.POST)
    @ResponseBody
    public String prizeToRecharge(OldBean oldBean) {
        String userName = oldBean.getUserName();
        int money = oldBean.getMoney();
        String description = LotteryDao.prizeToRecharge(userName, money);
        return toResult(description);
    }


    /**
     * 票据信息
     */
    @RequestMapping(value = "getTickets", method = RequestMethod.POST)
    @ResponseBody
    public String getTickets(OldBean oldBean) {
        String username = oldBean.getUserName();
        String outerId = oldBean.getOuterId();
        java.util.List tickets = LotteryDao.getTickets(username, outerId);
        JSONArray jsonArray = new JSONArray();
        JSONObject res = new JSONObject();
        try {
            for (int i = 0; i < tickets.size(); i++) {
                jsonArray.put(i, tickets.get(i));
            }
            res.put("rst", jsonArray);
            res.put("repCode", CmbcConstant.SUCCESS);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return res.toString();
    }


    /**
     * 日志信息
     */
    @RequestMapping(value = "getLogs", method = RequestMethod.POST)
    @ResponseBody
    public String getLogs(OldBean oldBean) {
        String userName = oldBean.getUserName();
        String passWord = oldBean.getPassWord();
        int curPage = oldBean.getCurPage();
        int pageSize = oldBean.getPageSize();
        int accountType = oldBean.getAccountType();
        String description = null;
        try {
            description = LotteryDao.getLogs(userName, passWord, curPage, pageSize, accountType);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return description;
    }

    public String toResult(String description) {
        org.codehaus.jettison.json.JSONObject resMessage = new org.codehaus.jettison.json.JSONObject();
        try {
            resMessage.put("description", description);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return resMessage.toString();
    }



}
