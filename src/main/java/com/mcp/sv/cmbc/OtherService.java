package com.mcp.sv.cmbc;

import com.mcp.sv.dao.LotteryDao;
import com.mcp.sv.model.OldBean;
import com.mcp.sv.util.*;
import com.mcp.sv.util.CmbcConstant;
import com.mongodb.DBObject;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.mcp.sv.dao.OtherServiceDao.checkScore;
import static com.mcp.sv.dao.OtherServiceDao.getScore;

/**
 * Created by forest on 2015/7/5.
 */
@Controller
@RequestMapping(value = "otherControl")
public class OtherService {

    private static Logger logger = Logger.getLogger(OtherService.class);

    public OtherService() {
    }

    @RequestMapping(value = "score", method = RequestMethod.POST)
    @ResponseBody
    public String score(OldBean oldBean) {
        String resMessage = "";
        String body = oldBean.getBody();
        resMessage = getScore(body);
        return resMessage;
    }
    /**
     *
     */
    @RequestMapping(value = "check", method = RequestMethod.POST)
    @ResponseBody
    public String check(OldBean oldBean) {
        String resMessage = "";
        String body = oldBean.getBody();
        resMessage = checkScore(body);
        return resMessage;
    }

    @RequestMapping(value = "backLogin", method = RequestMethod.POST)
    @ResponseBody
    public String backLogin(OldBean oldBean) {
        String backUserName = oldBean.getBackUserName();
        String passWord = oldBean.getPassWord();
        JSONObject rst = new JSONObject();
        boolean is = isBackAdmin(backUserName, passWord);
        try {
            if (is) {
                rst.put("repCode", CmbcConstant.SUCCESS);
            } else {
                rst.put("repCode", CmbcConstant.ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return rst.toString();
    }

    public boolean isBackAdmin(String userName, String passWord) {
        boolean result = false;
        if (userName.equals(CmbcConstant.BACK_USERNAME) && passWord.equals(CmbcConstant.BACK_PASSWORD)) {
            result = true;
        }
        return result;
    }


    @RequestMapping(value = "updateTiXian", method = RequestMethod.POST)
    @ResponseBody
    public String updateTiXian(OldBean oldBean) {
        String backUserName = oldBean.getBackUserName();
        String passWord = oldBean.getPassWord();
        String outerId = oldBean.getOuterId();
        boolean is = this.isBackAdmin(backUserName, passWord);
        JSONObject rst = new JSONObject();
        if(is){
            String description = LotteryDao.updateTiXian(outerId);
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
        }else {
            try {
                rst.put("repCode","9999");
                rst.put("description","权限不足，已记录本次越权操作");
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return rst.toString();



    }


    @RequestMapping(value = "backTickets", method = RequestMethod.POST)
    @ResponseBody
    public String backTickets(OldBean oldBean) {
        JSONObject rst = new JSONObject();
        String backUserName = oldBean.getBackUserName();
        String passWord = oldBean.getPassWord();
        String userName = oldBean.getUserName();
        String outerId = oldBean.getOuterId();
        String mobile = oldBean.getMobile();
        Map param = new HashMap();
        List rstList = null;
        //accountType作为表名
        int accountType = oldBean.getAccountType();
        String tableName = MongoConst.MONGO_TICKET;
        if (accountType == 2) {
            tableName = MongoConst.MONGO_TIXIAN;
        }
        //状态
        int status = oldBean.getStatus();
        if (status != 0) {
            param.put("status", status);
        }
        if (status == 1000 && accountType!=2) {
            param.put("status", null);
        }
        //用户
        if (userName != null && !"".equals(userName)) {
            param.put("userName", userName);
        }
        //ticketID
        if (outerId != null && !"".equals(outerId)) {
            param.put("outerId", outerId);
        }
        //mobile
        if (mobile != null && !"".equals(mobile)) {
            param.put("mobile", mobile);
        }
        boolean is = this.isBackAdmin(backUserName, passWord);
        if (is) {
            //正常逻辑
            int curPage = oldBean.getCurPage();
            int pageSize = oldBean.getPageSize();
            if (curPage == 0) {
                curPage = 1;
            }
            if (pageSize == 0) {
                curPage = 10;
            }
            rstList = MongoUtil.queryForPage(tableName, param, curPage, pageSize);
            int count = MongoUtil.queryCount(tableName, param);
            JSONArray results = new JSONArray();
            for (int i = 0; i < rstList.size(); i++) {
                DBObject obj= (DBObject) rstList.get(i);
                String openId= (String) obj.get("userName");
                String openIdPaw = openId + CmbcConstant.CMBC_SIGN_KEY;
                String strUser="";
                try {
                    strUser=LotteryDao.getUser(openId,openIdPaw);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                obj.put("user", strUser);
                results.put(obj);
            }
            try {
                rst.put("repCode", CmbcConstant.SUCCESS);
                rst.put("rst", results);
                rst.put("count", count);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } else {
            try {
                rst.put("repCode", CmbcConstant.ERROR);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return rst.toString();
    }
}
