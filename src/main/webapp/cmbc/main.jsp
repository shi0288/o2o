<%@ page language="java" pageEncoding="UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>中期彩</title>
    <meta name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
    <link type="text/css" rel="stylesheet" href="css/reset.css"/>
    <script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="js/common.js"></script>
    <jsp:include page="include/login.jsp" flush="true"/>
    <script type="text/javascript">
        $(document).ready(function () {
            getData();
        });
        function InterTime() {
            var oSec = $("#x115").find(".seconds").eq(0);
            var oMit = $("#x115").find(".minutes").eq(0);
            var sec = oSec.html();
            var mit = oMit.html();
            sec = parseInt(sec);
            mit = parseInt(mit);
            if (sec == 0 & mit == 0) {
                getData();
                return false;
            }
            if (sec == 0) {
                mit = mit - 1;
                oSec.html(59);
                oMit.html(mit);
            } else {
                sec = sec - 1;
                oSec.html(sec);
            }
        }
        function getData() {
            $.ajax({
                type: "POST",
                url: "/bankServices/LotteryService/commonTrans?timestamp=" + new Date().getTime(),
                dataType: "json",
                cache: false,
                data: {
                    cmd: 'Q11',
                    body: '{}'
                },
                success: function (result) {
                    var repCode = result.repCode;
                    if (repCode != 0000) {
                        $(".content").html("<div class='error-tip'>数据加载失败，请刷新</div>");
                        return false;
                    }
                    var now = result.nowTime;
                    now = stampTime(now);
                    $.each(result.games, function (key, val) {
                        getCaipiao(val, now);
                    });
                    var timer = null;
                    //11选5倒计时
                    //timer=setInterval(InterTime,1000);
                },
                error: onError
            });
        }
        function onError(a) {
            //alert(a.responseText);
        }
        function getCaipiao(obj, now) {
            switch (obj['code']) {
                //双色球
                case "F01":
                    var oQiu = $("#ssq");
                    if (obj['curTerm']) {
                        getDtim(obj, oQiu, now);
                    } else {
                        oQiu.find("p").remove();
                        oQiu.append("<p style='margin-top:12px;margin-left:2px;'>未开售</p>");
                    }
                    break;
                //福彩3D
                case "F02":
                    var oQiu = $("#fc3d");
                    if (obj['curTerm']) {
                        getDtim(obj, oQiu, now);
                    } else {
                        oQiu.find("p").remove();
                        oQiu.append("<p style='margin-top:12px;margin-left:2px;'>未开售</p>");
                    }
                    break;
                //七乐彩
                case "F03":
                    var oQiu = $("#qlc");
                    if (obj['curTerm']) {
                        getDtim(obj, oQiu, now);
                    } else {
                        oQiu.find("p").remove();
                        oQiu.append("<p style='margin-top:12px;margin-left:2px;'>未开售</p>");
                    }
                    break;
                //大乐透
                case "T01":
                    var oQiu = $("#dlt");
                    if (obj['curTerm']) {
                        getDtim(obj, oQiu, now);
                    } else {
                        oQiu.find("p").remove();
                        oQiu.append("<p style='margin-top:12px;margin-left:2px;'>未开售</p>");
                    }
                    break;
                //七星彩
                case "T02":
                    var oQiu = $("#qxc");
                    if (obj['curTerm']) {
                        getDtim(obj, oQiu, now);
                    } else {
                        oQiu.find("p").remove();
                        oQiu.append("<p style='margin-top:12px;margin-left:2px;'>未开售</p>");
                    }
                    break;
                //排列3
                case "T03":
                    var oQiu = $("#pl3");
                    if (obj['curTerm']) {
                        getDtim(obj, oQiu, now);
                    } else {
                        oQiu.find("p").remove();
                        oQiu.append("<p style='margin-top:12px;margin-left:2px;'>未开售</p>");
                    }
                    break;
                //排列5
                case "T04":
                    var oQiu = $("#pl5");
                    if (obj['curTerm']) {
                        getDtim(obj, oQiu, now);
                    } else {
                        oQiu.find("p").remove();
                        oQiu.append("<p style='margin-top:12px;margin-left:2px;'>未开售</p>");
                    }
                    break;
                //11选5
                case "T05":
                    var oQiu = $("#x115");
                    if (obj['curTerm']) {
                        getDtim(obj, oQiu, now);
                    } else {
                        oQiu.find("p").remove();
                        oQiu.append("<p style='margin-top:12px;margin-left:2px;'>未开售</p>");
                    }
                    break;
            }
        }
        function getDtim(objj, oQiu, now) {
            var endTime = objj['curTerm']['endTime'];
            endTime = stampTime(endTime);
            var date3 = endTime - now;
            //计算出相差天数
            var days = Math.floor(date3 / (24 * 3600 * 1000));
            var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));
            //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            //计算相差秒数
            var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            oQiu.find(".qi").html(objj['curTerm']['name']);
            if (oQiu.find(".days").length > 0) {
                oQiu.find(".days").html(days);
            }
            if (oQiu.find(".hours").length > 0) {
                oQiu.find(".hours").html(hours);
            }
            if (oQiu.find(".minutes").length > 0) {
                oQiu.find(".minutes").html(minutes);
            }
            if (oQiu.find(".seconds").length > 0) {
                oQiu.find(".seconds").html(seconds);
            }
            if (days == 0) {
                oQiu.find(".tian").hide();
            } else {
                oQiu.find(".fen").hide();
            }
            if (days == 0 && oQiu.find(".jiajiang").length > 0) {
                oQiu.find(".jiajiang").show();
            }
        }
    </script>
</head>
<body>
<div class="page-from-left index">
    <div class="top fix">
        <div class="top-relative clearfix"><a href="index.jsp" class="go-pre"></a><span class="title">购彩大厅</span></div>
    </div>
    <div class="cb"></div>
    <!--顶部结束-->
    <!--正文内容开始-->
    <div class="content">
        <!--l1-->
        <a class="list-item clearfix" href="dlt.jsp">
            <img class="list-item-logo" src="img/ico_dlt.png">

            <div class="fl" id="dlt">
                <h1 class="clearfix"><span>大乐透</span><span class="hot">火</span><span class="jiajiang"
                                                                                     style="display:none">今日开奖</span>
                </h1>

                <p>3元可中1600万</p>

                <p><span><img class="time-ico" src="img/sclock.png">
                      距<font class="qi"></font>   <span class="tian"><font class="redtext days"></font>天</span>
                      <font class="redtext hours"></font>小时<span class="fen"><font
                            class="redtext minutes"></font>分</span>
                   </span>
                    <!--  <span class="span2-margin">奖池<font class="redtext">897</font>万</span>-->
                </p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l2-->
        <a class="list-item clearfix" href="c11x5.jsp">
            <img class="list-item-logo" src="img/ico_11xuan5.png">

            <div class="fl" id="x115">
                <h1 class="clearfix"><span>11选5</span><span class="hot">火</span></h1>

                <p>每10分钟1期，好玩易中奖</p>

                <p><span><img class="time-ico" src="img/sclock.png">
                      <font class="qi"></font>  <font class="redtext minutes" style="display:none"></font><font
                            class="redtext seconds" style="display:none"></font>
                   </span>

                </p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l3-->
        <a class="list-item clearfix" href="jczq.jsp">
            <img class="list-item-logo" src="img/ico_jczq.png">

            <div class="fl" id="jczq">
                <h1 class="clearfix"><span>竞彩足球</span><span class="zuqiu"></span></h1>

                <p>倍投2串1，天天有收益</p>

                <p>只猜胜负更有趣</p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l4-->
        <!--<a class="list-item clearfix" href="jclq.html">
            <img class="list-item-logo" src="img/ico_jclq.png">
            <div class="fl" id="jclq">
                <h1 class="clearfix"><span>竞彩篮球</span><span class="lanqiu"></span></h1>
                <p>最近比赛：掘金VS快船</p>
                <p>返奖率69%只猜胜负 更有趣</p>
            </div>
            <span class="list-item-go"></span>
        </a>-->
        <!--l5-->
        <a class="list-item clearfix" href="ssq.jsp">
            <img class="list-item-logo" src="img/ico_ssq.png">

            <div class="fl" id="ssq">
                <h1 class="clearfix"><span>双色球</span><span class="hot">火</span><span class="jiajiang"
                                                                                     style="display:none">今日开奖</span>
                </h1>

                <p>2元可中1000万</p>

                <p><span><img class="time-ico" src="img/sclock.png">
                       距<font class="qi"></font> <span class="tian"><font class="redtext days"></font>天</span>
                       <font class="redtext hours"></font>小时<span class="fen"><font
                            class="redtext minutes"></font>分</span>
                   </span>
                    <!--<span class="span2-margin">奖池<font class="redtext">11,170</font>万</span>-->
                </p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l5-->
        <a class="list-item clearfix" href="fc3d.jsp">
            <img class="list-item-logo" src="img/ico_3d.png">

            <div class="fl" id="fc3d">
                <h1 class="clearfix"><span>福彩3D</span><span class="jiajiang" style="display:none">今日开奖</span></h1>

                <p>每天3个数，轻松投一注</p>

                <p><span><img class="time-ico" src="img/sclock.png">
                       距<font class="qi"></font> <span class="tian"><font class="redtext days"></font>天</span>
                       <font class="redtext hours"></font>小时<span class="fen"><font
                            class="redtext minutes"></font>分</span>
                   </span>
                    <!--<span class="span2-margin">奖池<font class="redtext">11,170</font>万</span>-->
                </p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l6-->
        <a class="list-item clearfix" href="pl3.jsp">
            <img class="list-item-logo" src="img/ico_pl3.png">

            <div class="fl" id="pl3">
                <h1 class="clearfix"><span>排列三</span><span class="jiajiang" style="display:none">今日开奖</span></h1>

                <p>选定个十百，每天博头彩</p>

                <p><span><img class="time-ico" src="img/sclock.png">
                        距<font class="qi"></font> <span class="tian"><font class="redtext days"></font>天</span>
                        <font class="redtext hours"></font>小时<span class="fen"><font
                            class="redtext minutes"></font>分</span>
                   </span>
                    <!--<span class="span2-margin">奖池<font class="redtext">897</font>万</span>-->
                </p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l7-->
        <a class="list-item clearfix" href="pl5.jsp">
            <img class="list-item-logo" src="img/ico_pl5.png">

            <div class="fl" id="pl5">
                <h1 class="clearfix"><span>排列五</span><span class="jiajiang" style="display:none">今日开奖</span></h1>

                <p>定位5码赢10万！每天开奖</p>

                <p><span><img class="time-ico" src="img/sclock.png">
                         距<font class="qi"></font> <span class="tian"><font class="redtext days"></font>天</span>
                        <font class="redtext hours"></font>小时<span class="fen"><font
                            class="redtext minutes"></font>分</span>
                   </span>
                    <!-- <span class="span2-margin">奖池<font class="redtext">897</font>万</span>-->
                </p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l8-->
        <a class="list-item clearfix" href="qlc.jsp">
            <img class="list-item-logo" src="img/ico_qlc.png">

            <div class="fl" id="qlc">
                <h1 class="clearfix"><span>七乐彩</span><span class="jiajiang" style="display:none">今日开奖</span></h1>

                <p>最高奖金500万</p>

                <p><span><img class="time-ico" src="img/sclock.png">
                        距<font class="qi"></font> <span class="tian"><font class="redtext days"></font>天</span>
                        <font class="redtext hours"></font>小时<span class="fen"><font
                            class="redtext minutes"></font>分</span>
                   </span>
                    <!--<span class="span2-margin">奖池<font class="redtext">897</font>万</span>-->
                </p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l9-->
        <a class="list-item clearfix" href="qxc.jsp">
            <img class="list-item-logo" src="img/ico_qxc.png">

            <div class="fl" id="qxc">
                <h1 class="clearfix"><span>七星彩</span><span class="jiajiang" style="display:none">今日开奖</span></h1>

                <p>最高奖金500万</p>

                <p><span><img class="time-ico" src="img/sclock.png">
                       距<font class="qi"></font> <span class="tian"><font class="redtext days"></font>天</span>
                        <font class="redtext hours"></font>小时<span class="fen"><font
                            class="redtext minutes"></font>分</span>
                   </span>
                    <!--<span class="span2-margin">奖池<font class="redtext">897</font>万</span>-->
                </p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l10-->
        <!--<a class="list-item clearfix" href="sfc.html">
            <img class="list-item-logo" src="img/ico_sfc.png">
            <div class="fl" id="sfc">
                <h1 class="clearfix"><span>胜负彩/任九场</span></h1>
                <p>不定期开奖</p>
                <p>2元擒1000万</p>
            </div>
            <span class="list-item-go"></span>
        </a>-->
        <!--l11-->
        <!--<a class="list-item clearfix lastone" href="jqc.html">
            <img class="list-item-logo" src="img/ico_jqc.png">
            <div class="fl" id="jqc">
                <h1 class="clearfix"><span>四场进球</span></h1>
                <p>不定期开奖</p>
                <p></p>
            </div>
            <span class="list-item-go"></span>
        </div>                                                         
    </a>-->
        <!--正文内容结束-->
        <!--底部开始-->
        <div class="footer">
            <a class="footer-nav nav-gc now" href="main.html">购彩</a> <a class="footer-nav nav-zh"
                                                                        href="acount.html">账户</a><a
                class="footer-nav nav-kj" href="result.html">开奖</a>
            <a class="footer-nav nav-xx" href="caiyuan.html">财园</a><a class="footer-nav nav-sz" href="more.html">更多</a>

            <div class="cb"></div>
        </div>
    </div>
</body>
</html>
