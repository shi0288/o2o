package com.mcp.sv.cmbc;

import com.mcp.sv.alipay.AlipayConfig;
import com.mcp.sv.alipay.AlipayNotify;
import com.mcp.sv.alipay.AlipaySubmit;
import com.mcp.sv.model.OldBean;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

/**
 * Created by w44 on 2015/6/21.
 */
@Controller
@RequestMapping(value = "alipay")
public class ZhiFuController {

    private static Logger logger = Logger.getLogger(ZhiFuController.class);

    @RequestMapping(value="/cz", method = RequestMethod.POST,produces="text/html;charset=UTF-8")
    @ResponseBody
    public String czInterface(OldBean oldBean){
        String rst="";
        //支付类型
        String payment_type = AlipayConfig.payment_type;
        //必填，不能修改
        //服务器异步通知页面路径
        String notify_url = AlipayConfig.notify_url;
        //页面跳转同步通知页面路径
        String return_url = AlipayConfig.return_url;
        //商户订单号
        String out_trade_no = UUID.randomUUID().toString().replace("-", "");
        //订单名称
        String subject = "充值_"+UUID.randomUUID().toString().replace("-", "");
        //付款金额
        String total_fee = String.valueOf(oldBean.getMoney()/100);
        //必填
        //商品展示地址
        String show_url = AlipayConfig.show_url;
        //选填
        //订单描述
        String body = "充值_"+total_fee;
        //选填
        //超时时间
        String it_b_pay = "45m";
        //选填
        //钱包token
        //String extern_token = new String(request.getParameter("WIDextern_token").getBytes("ISO-8859-1"),"UTF-8");
        //选填
        Map<String, String> sParaTemp = new HashMap<String, String>();
        sParaTemp.put("service", AlipayConfig.service);
        sParaTemp.put("partner", AlipayConfig.partner);
        sParaTemp.put("seller_id", AlipayConfig.seller_id);
        sParaTemp.put("_input_charset", AlipayConfig.input_charset);
        sParaTemp.put("payment_type", payment_type);
        sParaTemp.put("notify_url", notify_url);
        sParaTemp.put("return_url", return_url);
        sParaTemp.put("out_trade_no", out_trade_no);
        sParaTemp.put("subject", subject);
        sParaTemp.put("total_fee", total_fee);
        sParaTemp.put("show_url", show_url);
        sParaTemp.put("body", body);
        sParaTemp.put("it_b_pay", it_b_pay);
        //sParaTemp.put("extern_token", extern_token);
        //建立请求
        rst = AlipaySubmit.buildRequest(sParaTemp, "get", "确认");
        return rst;
    }



    @RequestMapping(value="/dealRecharge.htm",method = {RequestMethod.POST,RequestMethod.GET})
    public void getWeiXinCallback(HttpServletRequest request, HttpServletResponse response) throws Exception
    {
        //获取支付宝POST过来反馈信息
        Map<String,String> params = new HashMap<String,String>();
        Map requestParams = request.getParameterMap();
        for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
            String name = (String) iter.next();
            String[] values = (String[]) requestParams.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i]
                        : valueStr + values[i] + ",";
            }
            //乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
            //valueStr = new String(valueStr.getBytes("ISO-8859-1"), "gbk");
            params.put(name, valueStr);
        }

        //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
        //商户订单号

        String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"),"UTF-8");

        //支付宝交易号

        String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"),"UTF-8");

        //交易状态
        String trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"),"UTF-8");

        //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//

        if(AlipayNotify.verify(params)){//验证成功
            //请在这里加上商户的业务逻辑程序代码

            //——请根据您的业务逻辑来编写程序（以下代码仅作参考）——

            if(trade_status.equals("TRADE_FINISHED")){
                //判断该笔订单是否在商户网站中已经做过处理
                //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                //如果有做过处理，不执行商户的业务程序

                //注意：
                //退款日期超过可退款期限后（如三个月可退款），支付宝系统发送该交易状态通知
            } else if (trade_status.equals("TRADE_SUCCESS")){
                //判断该笔订单是否在商户网站中已经做过处理
                //如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
                //如果有做过处理，不执行商户的业务程序

                //注意：
                //付款完成后，支付宝系统发送该交易状态通知
            }

            //——请根据您的业务逻辑来编写程序（以上代码仅作参考）——

            logger.info("支付成功");	//请不要修改或删除

        }else{
            //验证失败
            logger.info("支付失败");
        }
    }


}
