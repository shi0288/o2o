package com.mcp.sv.dao;

import com.mcp.sv.util.MongoConst;
import com.mcp.sv.util.MongoUtil;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by forest on 2015/7/5.
 */
public class OtherServiceDao {
    public static String getScore(String body){
        JSONObject rbody = new JSONObject();
        String rstr = "";
        String username = "";
        int score = 0;
        int orderId = 0;
        try {
            JSONObject mbody = new JSONObject(body);
            username = mbody.getString("userName");
           // username = body;
            Map info = findJfInfo(username);
            Date now=new Date();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String updateTime=dateFormat.format(now);
            //updateTime = "2015-07-07";
           //System.out.println("updateTime11111:" + updateTime);
            if(info.containsKey("score")){
                String time = (String)info.get("updateTime");
                //System.out.println("time11111:"+time);
                if(time.equals(updateTime)){
                    score = (int)info.get("score");
                    rbody.put("repCode","0002");
                }else {
                    score = (int) info.get("score")+100;
                    orderId = (int) info.get("orderId")+1;
                    updateJfInfo(username,score,orderId,updateTime);
                    rbody.put("repCode", "0001");
                }
            }else{
                score = 100;
                saveJfInfo(username,score,updateTime);
                rbody.put("repCode","0000");
            }
            rbody.put("userName",username);
            rbody.put("score",score);
        } catch (JSONException e) {
            try {
                rbody.put("userName",username);
                rbody.put("repCode","-1");
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            e.printStackTrace();
        }
        rstr = rbody.toString();
        return rstr;
    }
    public static String checkScore(String body){
        JSONObject rbody = new JSONObject();
        String rstr = "";
        String username = "";
        int score = 0;
        try {
            JSONObject mbody  = new JSONObject(body);
            username = mbody.getString("userName");
            Map info = findJfInfo(username);
            Date now=new Date();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String updateTime=dateFormat.format(now);
            if(info.containsKey("score")){
                String time = (String)info.get("updateTime");
                score = (int)info.get("score");
                if(time.equals(updateTime)){
                    rbody.put("repCode","0000");
                    rbody.put("score",score);
                    rbody.put("repDes","今天已经签到");
                }else{
                    rbody.put("repCode","0001");
                    rbody.put("score",score);
                    rbody.put("repDes","今天未签到");
                }
            }else{
                rbody.put("repCode","0002");
                rbody.put("repDes","还没签过到");
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        rstr = rbody.toString();
        return rstr;
    }
    public static void updateJfInfo (String username,int score,int orderId,String updateTime){
        DBCollection collection = MongoUtil.getDb().getCollection(MongoConst.MONGO_JIFEN);
        DBObject find = new BasicDBObject(); //mongodb bean
        find.put("_id",username);
        find.put("orderId",orderId-1);
        DBObject set = new BasicDBObject(); //mongodb bean
        set.put("_id", username);
        set.put("updateTime", updateTime);
        set.put("score", score);
        set.put("orderId", orderId);
        collection.findAndModify(find, null, null, false, set, true, true);
    }

    public static void saveJfInfo (String username,int score,String updateTime){
        DBCollection collection = MongoUtil.getDb().getCollection(MongoConst.MONGO_JIFEN);
        DBObject tokenObj = new BasicDBObject();
        tokenObj.put("_id", username);
        tokenObj.put("updateTime", updateTime);
        tokenObj.put("score", score);
        tokenObj.put("orderId", 1);
        collection.save(tokenObj);
    }

    public static Map findJfInfo (String username,String updateTime){
        DBCollection collection = MongoUtil.getDb().getCollection(MongoConst.MONGO_JIFEN);
        DBObject find = new BasicDBObject(); //mongodb bean
        find.put("_id",username);
        find.put("updatetime", updateTime);
        DBObject token = collection.findOne(find);
        if (token != null){
            return  token.toMap();
        }else{
            return new HashMap<>();
        }
    }

    public static Map findJfInfo (String username){
        DBCollection collection = MongoUtil.getDb().getCollection(MongoConst.MONGO_JIFEN);
        DBObject find = new BasicDBObject(); //mongodb bean
        find.put("_id",username);
        DBObject token = collection.findOne(find);
        if (token != null){
            return  token.toMap();
        }else{
            return new HashMap<>();
        }
    }
}
