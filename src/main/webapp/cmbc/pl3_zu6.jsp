<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>排列三</title>
<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
<META HTTP-EQUIV="Expires" CONTENT="0"> 
<meta name="format-detection" content="telephone=no">
<meta http-equiv="cache-control" content="no-cache">
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
<link type="text/css" rel="stylesheet" href="css/reset.css" />
<link type="text/css" rel="stylesheet" href="css/common.css" />
<script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
<script type="text/javascript" src="js/common.js"></script>

</head>
<body>
<div class="page-from-left index">
	<div class="top fix">
    	<div class="top-relative clearfix">
        	<a href="index.jsp" class="go-pre"></a>
            <a href="javascript:xuanqiuShow()" class="go-pre" style="display:none"></a>
        	<span class="title"><span class="pt2">排列三</span><a class="selmore" href="javascript:void(-1)">组选六<img src="img/down_yellow.png"/></a></span>
        </div>
    </div>
    <div class="cb"></div>
<!--顶部结束-->
<!--正文内容开始-->
	<div class="content">
    	<div class="bar-tip"><span>第<font class="redtext" id="termCode">14197</font>期</span><span>截止时间：<font class="redtext" id="lastime"></font></span></div>
        <!--选球-->
        <div class="xuanqiu">
            <div class="bar-tip nav2 mb5 clearfix">
            	<a class="tab-nav more-tou now" style="width:100%;">组六复式</a>
                <!--<a class="tab-nav more-tou" style="width:33%;">跨度</a>
                <a class="tab-nav more-tou" style="width:33%;">胆拖</a>-->
            </div>
  			<div class="tab-content p10" id="putong" data-red="3" data-blue="0" data-type="2" data-des="组选六" style="display:block;">
                <span class="tz-tit-left">至少选4个号码</span>
                <div class="cb"></div>
                <span class="redball">0</span>
                <span class="redball">1</span><span class="redball">2</span><span class="redball">3</span><span class="redball">4</span>
                <span class="redball">5</span><span class="redball">6</span><span class="redball">7</span><span class="redball">8</span>
                <span class="redball">9</span>
            </div>
            <!--<div class="tab-content p10" id="kuadu" data-arr="8,14,18,20,20,18,14,8" data-type="4">
            	<p class="gerytext pl10">玩法提示：所选号码与开奖号码前三位最大值与最小值之差的值相同即中奖，奖金1,170元。</p>
                <span class="tz-tit-left">至少选择1个号码</span>
                <div class="cb"></div>
                <div class="clearfix">
                   <span class="redball">2</span>
                   <span class="redball">3</span><span class="redball">4</span><span class="redball">5</span>
                   <span class="redball">6</span><span class="redball">7</span><span class="redball">8</span>
                   <span class="redball">9</span>
                </div>
            </div>-->  
            <!--<div class="tab-content p10" id="dantuo">
                <span class="tz-tit-left"><font class="redtext">胆码区</font>至少选择1个，最多选择2个</span>
                <div class="cb"></div>
                <div class="clearfix" id="dan">
                    <span class="redball">0</span><span class="redball">1</span><span class="redball">2</span><span class="redball">3</span>
                    <span class="redball">4</span><span class="redball">5</span>
                	<span class="redball">6</span><span class="redball">7</span><span class="redball">8</span><span class="redball">9</span>
                </div>
                <span class="tz-tit-left mt10"><font class="redtext">拖码区</font>至少选择2个，最多选择9个</span>
                <div class="cb"></div>
                <div class="clearfix" id="tuo">
                    <span class="redball">0</span><span class="redball">1</span><span class="redball">2</span><span class="redball">3</span>
                    <span class="redball">4</span><span class="redball">5</span>
                	<span class="redball">6</span><span class="redball">7</span><span class="redball">8</span><span class="redball">9</span>
                </div>
              
            </div>-->
            <div  id="pailei" style="display:none;" data-type="1">
            	<p class="gerytext pl10">玩法提示：每位至少选择1个号码。</p>
            	<div class="clearfix pailei">
                    <div class="fl wei">百位</div>
                    <div class="fl">
                        <span class="redball">0</span><span class="redball">1</span><span class="redball">2</span><span class="redball">3</span>
                        <span class="redball">4</span><span class="redball">5</span><span class="redball">6</span><span class="redball">7</span>
                        <span class="redball">8</span><span class="redball">9</span>
                    </div>
                 </div>  
                 <div class="clearfix pailei">
                    <div class="fl wei">十位</div>
                    <div class="fl">
                         <span class="redball">0</span><span class="redball">1</span><span class="redball">2</span><span class="redball">3</span>
                        <span class="redball">4</span><span class="redball">5</span><span class="redball">6</span><span class="redball">7</span>
                        <span class="redball">8</span><span class="redball">9</span>
                    </div>
                 </div>  
                 <div class="clearfix pailei">
                    <div class="fl wei">三位</div>
                    <div class="fl">
                         <span class="redball">0</span><span class="redball">1</span><span class="redball">2</span><span class="redball">3</span>
                        <span class="redball">4</span><span class="redball">5</span><span class="redball">6</span><span class="redball">7</span>
                        <span class="redball">8</span><span class="redball">9</span>
                    </div>
                 </div>    
            </div>
        </div>
        <!--选球结束-->
        <!--选号列表-->
        <div class="xqll" style="display:none;">
            <span class="x-btn" onClick="xuanqiuShow()"><span class="clearfix"><img src="img/jia_bg.png" class="mr15"/>自选号码</span></span>
            <span class="x-btn" id="jxyz"><img src="img/jia_bg.png"/>机选一注</span>
            <div class="cb"></div>
            <p class="pl10">选号列表</p>
            <div id="xh-box"></div>
            <!--更多选项-->
            <div class="tz-more">
            	<div id="tz-more-btn" class="tz-more-btn"></div>
                <div id="tz-more-content" class="tz-more-content clearfix">
                	<div class="tz-more-content-box">
                        <div class="jj-k clearfix">
                            <span class="jj-k-left"></span>
                            <span class="jj-k-font">投</span><span><input type="text" class="no-boder" value="1"/></span><span class="jj-k-font2">倍</span>
                            <span class="jj-k-right"></span>
                        </div>
                        <div class="cb"></div>
                    </div>
                </div>
            </div>
            <!--end更多选项-->
        </div>
        <!--选号列表结束-->
    </div>    
<!--正文内容结束-->   
<!--投注底部开始-->
	<div class="footer-tz">
    	<span id="meizhu">
        	<span class="meizhu" style="display:block;">
    			<a class="del-red" href="javascript:void(-1)"></a>
        		<span class="fl">共<font class="redtext meizhushu" >0</font>注
           		<font class="redtext meizhuqian">0</font>元</span>  
             </span>
             <span class="meizhu">
    			<a class="del-red" href="javascript:void(-1)"></a>
        		<span class="fl">共<font class="redtext meizhushu" >0</font>注
           		<font class="redtext meizhuqian">0</font>元</span>  
             </span>
             <span class="meizhu">
    			<a class="del-red" href="javascript:void(-1)"></a>
        		<span class="fl">共<font class="redtext meizhushu" >0</font>注
           		<font class="redtext meizhuqian">0</font>元</span>  
             </span> 
        </span>
        <span id="qi-bei">
        	<span class="fl">共<font class="redtext" id="zhushu" >0</font>注
            <font class="redtext boq" id="beishu">1</font>倍
             <font class="redtext boq" id="qishu">1</font>期，
            <font class="redtext" id="qianshu">0</font>元</span>    
        </span>
       		
        <a class="xuanhao-btn step1 fr" href="javascript:void(-1)">选好了</a>
    </div>
     <script type="text/javascript" src="js/base.js"></script>
	 <script type="text/javascript" src="js/commontz.js"></script>
     <script type="text/javascript" src="js/fc3d_zu6.js"></script>
     <script type="text/javascript" src="js/contect.js"></script>
     <div id="game" style="display:none" data-game="T03" data-play="03"></div>
</div>
<!--弹出层-->
<div class="cover"></div>
<div class="pop pop-red-div clearfix">
	<span class="pop-red">5</span><span class="pop-red">6</span><span class="pop-red">7</span>
    <span class="pop-red">8</span><span class="pop-red">9</span>
    <span class="pop-red">10</span><span class="pop-red">11</span>
</div>
<div class="pop pop-renxuan-div pop-pl3 clearfix">
	<div class="text-center">请选择玩法</div>
    <div class="pop-renxuan-dd">
        <a href="pl3.jsp" class="pop-red">直选</a><a href="pl3_zu.jsp" class="pop-red">组选</a>
        <a href="pl3_zu3.jsp" class="pop-red">组选三</a><a href="pl3_zu6.jsp" class="pop-red">组选六</a>
    </div>
</div>
<!--弹出层结束-->
</body>
</html>
