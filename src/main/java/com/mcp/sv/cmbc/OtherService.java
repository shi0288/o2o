package com.mcp.sv.cmbc;

import com.mcp.sv.model.OldBean;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Created by forest on 2015/7/5.
 */
@Controller
@RequestMapping(value = "bankServices/OtherService")
public class OtherService {
    private static Logger logger = Logger.getLogger(LotteryService.class);

    public OtherService() {
    }
    /**
     * »ý·Ö
     */
    @RequestMapping(value = "score", method = RequestMethod.POST)
    @ResponseBody
    public String score(OldBean oldBean) {
        String resMessage = "";
        String body = oldBean.getBody();
        return resMessage;
    }
}
