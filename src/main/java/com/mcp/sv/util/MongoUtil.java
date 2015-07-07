package com.mcp.sv.util;

import com.mongodb.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Created by bjjg11 on 2014/11/7.
 */
public class MongoUtil {



    public static DB getDb(){
        return MongoManager.getDB(MongoConst.MONGO_NAME);
    }

    public static List<DBObject> query(String table,Map<String,String> map){
        DBCollection collection = MongoUtil.getDb().getCollection(table);
        BasicDBObject query=new BasicDBObject();
        if(map==null){
            return null;
        }
        for(String key:map.keySet()){
            query.append(key,map.get(key));
        }
        DBCursor cur = collection.find(query);
        return cur.toArray();
    }


    public static int queryCount(String table,Map<String,String> map){
        DBCollection collection = MongoUtil.getDb().getCollection(table);
        BasicDBObject query=new BasicDBObject();
        if(map==null){
            return 0;
        }
        for(String key:map.keySet()){
            query.append(key,map.get(key));
        }
        int cur = collection.find(query).count();
        return cur;
    }


    public static List<DBObject> queryForPage(String table,Map<String,String> map,int curPage,int pageSize){
        DBCollection collection = MongoUtil.getDb().getCollection(table);
        BasicDBObject query=new BasicDBObject();
        if(map==null){
            return null;
        }
        for(String key:map.keySet()){
            query.append(key,map.get(key));
        }
        int skip = (curPage - 1) * pageSize;
        DBCursor cur = collection.find(query).skip(skip).limit(pageSize).sort(new BasicDBObject("createTime", -1));
        if(cur.count()==0){
            return new ArrayList<>();
        }

        return cur.toArray();
    }

    public static int insert(String table,DBObject dbObject){
        DBCollection collection = MongoUtil.getDb().getCollection(table);
        return collection.save(dbObject).getN();
    }


    public static int save(String table,Map<String,Object> map){
        DBCollection collection = MongoUtil.getDb().getCollection(table);
        DBObject  dbObject= new BasicDBObject();
        if(map==null){
            return 9999;
        }
        for(String key:map.keySet()){
            dbObject.put(key, map.get(key));
        }
        return collection.save(dbObject).getN();
    }

    public static int update(String table,DBObject beforeDb,DBObject backDb){
        DBCollection collection = MongoUtil.getDb().getCollection(table);
        return collection.update(beforeDb,backDb).getN();
    }


}
