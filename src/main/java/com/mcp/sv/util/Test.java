package com.mcp.sv.util;

import com.mcp.sv.dao.OtherServiceDao;
import com.mongodb.*;
import com.mongodb.util.JSON;
import org.codehaus.jettison.json.JSONException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import static com.mcp.sv.dao.JcDao.*;
import static com.mcp.sv.dao.OtherServiceDao.findJfInfo;
import static com.mcp.sv.dao.OtherServiceDao.updateJfInfo;
import static com.mcp.sv.util.HttpClientWrapper.sendGet;

/**
 * Created by Administrator on 2015/5/20.
 */
public class Test {

    public static void main(String[] args) throws JSONException, ParseException {
        //String username,int score,int orderId,String updateTime
//        updateJfInfo("111111",500,7,"2015-07-06");
//        Map info = findJfInfo("111111");
//        System.out.println(info.toString());
//        Map jcinfo = findJcInfo("HHGG");
        //{_id=SPF_updatetime, last_updated=2015-07-07 20:13:04, body={"head":{"repCode":"-1","last_updated":" "},"body":"[]"}, updateTime=1436272007843}
        //{_id=HHGG_updatetime, last_updated=1436272104166,
//        System.out.println(jcinfo.toString());
       String str = sendGet(CmbcConstant.HHGG_URL);
        System.out.println(str);
//       String res = createFormat("HHGG", str);
        String res = createHhggFormat("HHGG", str);
//
        System.out.println(res);
//        System.out.println(new Date());
//        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss");
//        Date nowt = new Date();
//        String dateStr=new SimpleDateFormat("YYYY-MM-DD").format(new Date());
//        System.out.println(dateStr);
//
//        Date now=new Date();
//        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//        String tablename=dateFormat.format(now);
//        System.out.println(tablename);
//        String str = OtherServiceDao.getScore("123456");
//        System.out.println(str);
//        String ss = getFormat("ZJQS","");
//        System.out.println(ss);
//last_updated":"2015-07-03 10:14:39"}}

//        String last_updated = "2015-07-02 15:14:23";
//        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd' 'HH:mm:ss");
//        Date last = format.parse(last_updated);
//        Date nowt = new Date();
//        long now1 = nowt.getTime();
//        System.out.println(nowt);
//last_updated":"2015-07-03 10:14:39"}
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
