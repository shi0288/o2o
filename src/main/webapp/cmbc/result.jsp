<%@ page language="java" pageEncoding="UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>中心线</title>
    <meta name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
    <meta name="format-detection" content="telephone=no" />
    <link type="text/css" rel="stylesheet" href="css/reset.css"/>
    <link type="text/css" rel="stylesheet" href="css/common.css"/>
    <script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="js/common.js"></script>
    <jsp:include page="include/login.jsp" flush="true"/>
    <script type="text/javascript">
        $(document).ready(function () {
            before();
            $.ajax({
                type: "POST",
                url: "/bankServices/LotteryService/getWinNum?timestamp=" + new Date().getTime(),
                dataType: "json",
                cache: false,
                data: {},
                success: function (result) {
                    var repCode = result.repCode;
                    if (repCode == "0000") {
                        $.each(result.rst, function (key, val) {
                            var winObj=JSON.parse(val);
                            $("#showdiv").show();
                            getResult(winObj);
                        });
                        $("#kaijiang").show();
                        after();
                    }

                },
                error: onError
            });
        });



        function getResult(obj) {
            switch (obj['gameCode']) {
                //双色球
                case "F01":
                    var oQiu = $("#ssq");
                    doRes(obj, oQiu, 1);
                    break;
                //福彩3D
                case "F02":
                    var oQiu = $("#fc3d");
                    doRes(obj, oQiu, 2);
                    break;
                //七乐彩
                case "F03":
                    var oQiu = $("#qlc");
                    doRes(obj, oQiu, 1);
                    break;
                //大乐透
                case "T01":
                    var oQiu = $("#dlt");
                    doRes(obj, oQiu, 1);
                    break;
                //七星彩
                case "T02":
                    var oQiu = $("#qxc");
                    doRes(obj, oQiu, 2);
                    break;
                //排列3
                case "T03":
                    var oQiu = $("#pl3");
                    doRes(obj, oQiu, 2);
                    break;
                //排列5
                case "T04":
                    var oQiu = $("#pl5");
                    doRes(obj, oQiu, 2);
                    break;
                //11选5
                case "T05":
                    var oQiu = $("#x115");
                    doRes(obj, oQiu, 1);
                    break;
            }
        }

        function doRes(obj, oQiu, type) {
            var schar = obj.wNum;
            var qi = "第" + obj.termCode + "期";
            var date = obj.createTime;
            var html = getKJnum(schar, type);//开奖号码解析在common.js
            date = date.substring(0, 10);
            oQiu.find(".kj-rq").html(date);
            oQiu.find(".kj-qi").html(qi);
            oQiu.find("p").html(html);
        }
        function onError(a) {
            //alert(a.responseText);
        }
    </script>
</head>
<body>
<div class="page-from-left index">

    <div class="top fix">
        <div class="top-relative clearfix"><!--<img id="top-lahuan" src="img/qian_top.png">-->
            <a href="index.jsp" class="go-pre"></a>
            <span class="title">最新开奖</span>
        </div>
    </div>
    <div class="cb"></div>
    <!--顶部结束-->
    <!--正文内容开始-->
    <div class="content" id="kaijiang" style="display:none;">
        <!--l1大乐透-->
        <a class="list-item clearfix" href="resultdet.html#T01">
            <img class="list-item-logo" src="img/ico_dlt.png">

            <div class="fl" id="dlt">
                <h1 class="clearfix"><span>大乐透</span><span class="kj-qi"></span><span class="kj-rq"></span></h1>

                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l2 11选5-->
        <a class="list-item clearfix" href="resultdet.html#T05">
            <img class="list-item-logo" src="img/ico_11xuan5.png">

            <div class="fl" id="x115">
                <h1 class="clearfix"><span>11选5</span><span class="kj-qi"></span><span class="kj-rq"></span></h1>

                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l5 双色球-->
        <a class="list-item clearfix" href="resultdet.html#F01">
            <img class="list-item-logo" src="img/ico_ssq.png">

            <div class="fl" id="ssq">
                <h1 class="clearfix"><span>双色球</span><span class="kj-qi"></span><span class="kj-rq"></span></h1>

                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l5 双色球-->
        <a class="list-item clearfix" href="resultdet.html#F02">
            <img class="list-item-logo" src="img/ico_3d.png">

            <div class="fl" id="fc3d">
                <h1 class="clearfix"><span>福彩3D</span><span class="kj-qi"></span><span class="kj-rq"></span></h1>

                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l6 排列3-->
        <a class="list-item clearfix" href="resultdet.html#T03">
            <img class="list-item-logo" src="img/ico_pl3.png">

            <div class="fl" id="pl3">
                <h1 class="clearfix"><span>排列三</span><span class="kj-qi"></span><span class="kj-rq"></span></h1>

                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l7 排列5-->
        <a class="list-item clearfix" href="resultdet.html#T04">
            <img class="list-item-logo" src="img/ico_pl5.png">

            <div class="fl" id="pl5">
                <h1 class="clearfix"><span>排列五</span><span class="kj-qi"></span><span class="kj-rq"></span></h1>

                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l8 七乐彩-->
        <a class="list-item clearfix" href="resultdet.html#F03">
            <img class="list-item-logo" src="img/ico_qlc.png">

            <div class="fl" id="qlc">
                <h1 class="clearfix"><span>七乐彩</span><span class="kj-qi"></span><span class="kj-rq"></span></h1>

                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l9 七星彩-->
        <a class="list-item clearfix" href="resultdet.html#T02">
            <img class="list-item-logo" src="img/ico_qxc.png">

            <div class="fl" id="qxc">
                <h1 class="clearfix"><span>七星彩</span><span class="kj-qi"></span><span class="kj-rq"></span></h1>

                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>
        <!--l10 胜负彩/任九场-->
        <!--<a class="list-item clearfix" href="resultdet.html">
            <img class="list-item-logo" src="img/ico_sfc.png">
            <div class="fl" id="sfc">
                <h1 class="clearfix"><span>胜负彩/任九场</span><span class="kj-qi">第140011509期</span><span class="kj-rq">2014-01-16</span></h1>
                <p></p>
            </div>
            <span class="list-item-go"></span>
        </a>-->
        <!--l11 四场进球-->
        <!--<a class="list-item clearfix lastone" href="resultdet.html">
            <img class="list-item-logo" src="img/ico_jqc.png">
            <div class="fl" id="jqc">
                <h1 class="clearfix"><span>四场进球</span><span class="kj-qi">第140011509期</span><span class="kj-rq">2014-01-16</span></h1>
                <p></p>
            </div>
            <span class="list-item-go"></span>                                                      
    </a>-->


    </div>
</div>
</body>
</html>
