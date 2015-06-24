<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>充值成功</title>
    <meta name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
    <link type="text/css" rel="stylesheet" href="css/reset.css"/>
    <link type="text/css" rel="stylesheet" href="css/common.css"/>
    <script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="js/common.js"></script>
    <script type="text/javascript" src="js/platform.js"></script>


    <%@ page import="java.util.*"%>
    <%@ page import="java.util.Map"%>
    <%@ page import="com.mcp.sv.alipay.*"%>
    <%@ page import="com.mcp.sv.dao.LotteryDao" %>

    <%
    //获取支付宝GET过来反馈信息
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
    valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
    params.put(name, valueStr);
    }

    //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
    //商户订单号

    String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"),"UTF-8");

    //支付宝交易号

    String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"),"UTF-8");

    String total_fee = new String(request.getParameter("total_fee").getBytes("ISO-8859-1"),"UTF-8");

        //交易状态
    String trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"),"UTF-8");

    //获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//

    //计算得出通知验证结果

    boolean verify_result = AlipayNotify.verify(params);

    String rstInfo="";
    if(verify_result){//验证成功
        if(trade_status.equals("TRADE_FINISHED") || trade_status.equals("TRADE_SUCCESS")){
            boolean rst = LotteryDao.alipayRecharge(out_trade_no);
            if(rst){
                rstInfo="支付成功";
            }else{
                rstInfo="已经支付";
            }
        }
    }else{
    //该页面可做页面美工编辑
        rstInfo="验证失败";
    }
    %>

</head>
<body>
<div class="page-from-left index">
    <div class="top fix">
        <div class="top-relative clearfix">
            <a href="main.jsp" class="go-pre"></a>
            <a href="javascript:xuanqiuShow()" class="go-pre" style="display:none"></a>
            <span class="title"><span class="pt2">充值成功</span></span>
        </div>
    </div>
    <div class="cb"></div>
    <!--顶部结束-->
    <!--正文内容开始-->
    <div class="content p10">
        <p class="text-center p10 tz-success mt15"><img src="img/big_gou_green2.png" width="40px"
                                                        style="vertical-align:middle; margin-right:5px;"/><span>恭喜，充值成功！</span>
        </p>

        <div style=" margin-top:20px; height:40px; border-top:1px solid #999;"></div>
        <p class="text-center tz-success">充值金额<font class="orgtext ml5"><%=total_fee %></font>元</p>
        <p class="text-center tz-success">状态<font class="orgtext ml5"><%=rstInfo %></font></p>

        <a href="index.jsp" class=" m-bigbtn-org mt30">试试手气</a>
        <a href="acount.html" class=" m-bigbtn-org mt15">返回账户</a>

    </div>
    <!--正文内容结束-->
</div>
</body>
</html>
