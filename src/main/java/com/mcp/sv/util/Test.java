package com.mcp.sv.util;

import com.mongodb.*;
import com.mongodb.util.JSON;
import org.codehaus.jettison.json.JSONException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static com.mcp.sv.dao.JcDao.createFormat;
import static com.mcp.sv.util.HttpClientWrapper.sendGet;

/**
 * Created by Administrator on 2015/5/20.
 */
public class Test {

    public static void main(String[] args) throws JSONException, ParseException {
       String str = sendGet(CmbcConstant.HHGG_URL);
//        System.out.println(sendGettr);
//       String res = createFormat("HHGG", str);
//        System.out.println(res);

        String last_updated = "2015-07-02 15:14:23";
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss");
        Date last = format.parse(last_updated);
        Date nowt = new Date();
        long now1 = nowt.getTime();
        System.out.println(nowt);

//        JSONObject jsonObject=new JSONObject();
//        jsonObject.put("gameCode","T51");
//        jsonObject.put("pType","05");
//        jsonObject.put("passType","1");
//        //jsonObject.put("matchCode","201505203009");
//        HttpClientWrapper httpClientWrapper=new HttpClientWrapper();
//        String str=httpClientWrapper.mcpPost("CQ22", jsonObject.toString());
//        //201505203009
//        System.out.println(str);

//        DB db = MongoManager.getDB(MongoConst.MONGO_NAME);
//        DBCollection users = db.getCollection("users");
//
//        DBObject user =users.find(new BasicDBObject().append("userName", "shi0200")).toArray().get(0);
//        String str=JSON.serialize(user);
//        BasicDBObject query= (BasicDBObject) JSON.parse(str);
//        query.append("money", 333);
//        int m= (int) user.get("money");
//        System.out.println(m);
//        if(cur.count()==1){
//            while (cur.hasNext()) {
//                DBObject user =cur.next();
//                String userName= (String)user.get("userName");
//                String passWord= (String)user.get("passWord");
//                System.out.println(userName);
//                System.out.println(passWord);
//            }
//        }

    }

}
