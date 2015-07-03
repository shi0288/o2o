package com.mcp.sv.model;

import org.codehaus.jettison.json.JSONObject;

/**
 * Created by ChubChen on 2015/6/2.
 */
public class DataObject {

    private JSONObject message;


    public JSONObject getMessage() {
        return message;
    }

    public void setMessage(JSONObject message) {
        this.message = message;
    }
}
