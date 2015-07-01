<%@ page language="java" pageEncoding="UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>账户信息</title>
    <meta name="viewport"
          content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, width=device-width">
    <META HTTP-EQUIV="Pragma" CONTENT="no-cache">
    <META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
    <META HTTP-EQUIV="Expires" CONTENT="0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta name="format-detection" content="telephone=no"/>
    <link type="text/css" rel="stylesheet" href="css/reset.css"/>
    <link type="text/css" rel="stylesheet" href="css/common.css"/>
    <script type="text/javascript" src="js/jquery-1.8.2.min.js"></script>
    <script type="text/javascript" src="js/common.js"></script>
    <jsp:include page="include/login.jsp" flush="true"/>
    <script type="text/javascript">
        $(document).ready(function () {
            //判断是否一级页面
            /*判断登陆  */
            if (top.location != location) {
                top.location.href = location.href;
                return;
            }
            /*判断登陆  end */
            before();
            getUseData();
        });

        function getUseData() {
            //获取账户信息
            $.ajax({
                type: "POST",
                url: "/bankServices/LotteryService/getUser?timestamp=" + new Date().getTime(),
                dataType: "json",
                cache: false,
                data: {
                    userName: sessionStorage.getItem("name"),
                    passWord: sessionStorage.getItem("passWord")
                },
                success: function (result) {
                    var repCode = result.repCode;
                    if (repCode == '0000') {
                        if (result.acount == undefined) {
                            sessionStorage.setItem("recharge", 0);
                            sessionStorage.setItem("prize", 0);
                        } else {
                            sessionStorage.setItem("recharge", result.acount.recharge);
                            if (result.acount.prize == undefined) {
                                sessionStorage.setItem("prize", 0);
                            } else {
                                sessionStorage.setItem("prize", result.acount.prize);
                            }
                        }
                        sessionStorage.setItem("realName", result.user.realName);
                        sessionStorage.setItem("mobile", result.user.mobile);
                        sessionStorage.setItem("identityId", result.user.identityId);
                        var name = sessionStorage.getItem("name");
                        var recharge = sessionStorage.getItem("recharge");
                        var prize = sessionStorage.getItem("prize");
                        $('#user_name').html(name.substr(0, 11));
                        $('#recharge').html(toDecimalMoney(recharge / 100));
                        $('#bonus').html(toDecimalMoney(prize / 100));
                        var pageSize = 10;	//每页显示条数
                        getCaipiao($(".tab-content").eq(0), 1, pageSize, 1);
                    } else {
                        alert("获取用户信息失败");
                    }
                }
            });

            /*滚动加载*/
            $(window).scroll(function () {
                $(".top").css("position", "fixed");
                var dheight = $(document).height();
                var wheight = $(window).height();
                var sctop = $(window).scrollTop();
                if ($(".tab-nav").eq(0).hasClass("now")) {
                    var aPage = $(".tab-content").eq(0).find(".page");
                    if (aPage.attr("data-page") != false) {
                        if (sctop >= dheight - wheight) {
                            var curPage = parseInt(aPage.attr("data-page"));
                            var historyPage = parseInt(aPage.attr("cur-page"));
                            if (curPage == historyPage) {
                                return false;
                            }
                            getCaipiao($(".tab-content").eq(0), curPage, pageSize, 1);
                        }
                    }
                }
            });
            /*end 滚动加载*/
        }

        //获取状态
        function getOrderStatus(status) {
            switch (status) {
                case 1000:
                    return "等待支付";
                    break;
                case 4000:
                    return "出票完成";
                    break;
                case 5000:
                    return "已中奖";
                    break;
                default:
                    return "订单完成";
            }
        }
        function getCaipiao(obj, curPage, pageSize, type) {
            $.ajax({
                type: "POST",
                url: "/bankServices/LotteryService/getOrder?timestamp=" + new Date().getTime(),
                dataType: "json",
                cache: false,
                data: {
                    userName: sessionStorage.getItem("name"),
                    passWord: sessionStorage.getItem("passWord"),
                    curPage: curPage,
                    pageSize: pageSize
                },
                success: function (result) {
                    var repCode = result.repCode;
                    if (repCode == '0000') {
                        $(".index").show();
                        if (result['rst'].length <= 0) {
                            obj.find(".page").eq(0).attr("cur-page", curPage);
                            var nohtml = '<div class="zhanghu-nodata">您暂时没有投注记录，快去购彩大厅试试手气吧！</div>';
                            obj.append(nohtml);
                            after();
                            return false;
                        }
                        //var ind = obj.index(".tab-content");
                        //obj.find(".zhanghu-list").remove();
                        $.each(result['rst'], function (key, val) {
                            var objectOrder = JSON.parse(val);
                            var body = JSON.parse(objectOrder.body);
                            var order = body.order;
                            var firTick = order.tickets[0];
                            var caizhong = getGame(firTick);
                            var price = toDecimalMoney(order['amount'] / 100);
                            var tip = "";

                            var endTime = objectOrder['createTime'];
                            var tztime = endTime.substring(0, 10);
                            endTime = Date.parse(endTime);
                            var myDate = new Date();
                            var now = myDate.getTime();
                            var date3 = now - endTime;
                            var days = Math.floor(date3 / (24 * 3600 * 1000));
                            var atime = tztime.split("-");
                            tztime = '<br><strong>' + atime[2] + '</strong><br>' + atime[1] + '月';
                            if (days < 1) {
                                tip = '<span class="zhanghu-list-tit linhei80">今</span>';
                            } else {
                                tip = '<span class="zhanghu-list-tit">' + tztime + '</span>';
                            }
                            var _orderStatus = objectOrder['status'];
                            _orderStatus = parseInt(_orderStatus);
                            var state = getOrderStatus(_orderStatus);
                            var game = caizhong;
                            //todo
                            var funstr = "window.location.href='fangan.html#" + objectOrder['outerId'] + "#" + objectOrder['status'] + "'";
                            if (objectOrder['status'] == 1000) {
                                funstr = "window.location.href='confirm.html#" + objectOrder['outerId'] + "'";
                            }
                            var termHtml = firTick.termCode + '期'; //+ '&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp下单时间：';
                            //termHtml += objectOrder['createTime'];
                            var stateHtml = "";
                            if (state == undefined) {
                                alert(objectOrder['status']);
                                alert(getOrderStatus(objectOrder['status']));
                            }
                            if (state == '已中奖') {
                                stateHtml = '<span class="zhongjiang">中奖啦</span>'
                            } else {
                                stateHtml = '<span class="meizj">' + state + '</span>'
                            }

                            var html = '<div class="zhanghu-list  clearfix">' +
                                    tip +
                                    '<div class="zhanghu-list-cot clearfix" onclick="' + funstr + '">' +
                                    '<span class="fl">' +
                                    '<h1>' + game + '<span class="acount-qi">' + termHtml + '</span>' + '</h1>' +
                                    '<p>' + price + '元</p>' +
                                    '</span>' + stateHtml +
                                    '</div>' +
                                    '</div>';
                            obj.append(html);
                            obj.find(".zhanghu-list").eq(0).addClass("fist");
                        });
                        obj.find(".page").eq(0).attr("data-page", curPage + 1);
                        after();
                    } else {
                        //alert(result.description);
                    }
                },
                error: onError
            });
        }

    </script>
</head>
<body>
<div class="page-from-left index">
    <div class="top fix" style="position:absolute;">
        <div class="top-relative clearfix">
            <a href="index.jsp" class="go-pre"></a>
            <img style="float:right;" id="refresh" src="img/reflash.png" onClick="window.location.reload();"/>
            <span class="title"
                  style="float:none; display:block; width:220px; text-align:center; margin:0px auto;">我的记录</span>

        </div>
    </div>
    <div class="cb"></div>
    <!--顶部结束-->
    <!--正文内容开始-->
    <div class="content pt10">
        <div class="zhanghu-litt"></div>
        <div class="yingying mb10">
            <div class="zhanghu-box1 clearfix">
                <div class="touxiang-rightbox" style="padding-left:0px;">
                    <a href="usedata.html" class="username clearfix"
                       style=" display:block;position:relative; padding-left:15px;">
                        <span id="user_name" class="cott-touxiang" onClick="return false;"></span>
                        <span class="yellow-text">实名认证更安全</span><span class="list-item-go"></span>
                    </a>

                    <div class="sline-dark mb10"></div>
                    <a href="acdetail.html" style=" display:block;position:relative; padding-left:15px;">
                        <P class="clearfix"><span class="cott-touxiang">
                        	 	彩金：<font class="orgtext" id="recharge"></font> 元
                            </span>
                            <span class="yellow-text"> 彩金购彩更方便</span>
                        </P>

                        <p class="clearfix"><span class="cott-touxiang">
                        	奖金：<font class="orgtext" id="bonus"></font> 元
                            </span>
                            <span class="yellow-text"> 大奖小奖及时兑</span>
                        </p>
                        <span class="list-item-go"></span>
                    </a>
                </div>
                <div class="cb"></div>

            </div>
        </div>
        <center>
            <div class=" pb10 pl5 pr5 mt5 clearfix">
                <a href="getmoney.html" class="center-org ">提款</a><a href="ylzhifu.html" class="center-org ">充值</a>
                <a href="index.jsp" class="center-org ">去购彩</a>
            </div>
        </center>
        <div class="zhanghu-tab">
            <div class="nav-box clearfix">
                <a class="tab-nav now" href="acount.jsp" style="width:50%">我的记录</a>
                <!-- <a class="tab-nav" href="javascript:void(-1)" style="width:50%" id="my-zhuhao">我的追号</a>-->
                <!-- <a class="tab-nav" href="javascript:void(-1)">我的合买</a><a class="tab-nav" href="javascript:void(-1)">我的跟单</a>-->
            </div>
            <input type="hidden" id="typetogo" value="1"/>

            <div class="tab-content" style="display:block;"><span style="width:100%;height:0px;" class="page"
                                                                  data-page="0"></span></div>

            <div class="tab-content" id="zhuihao"><span style="width:100%;height:0px;" class="page" data-page="1"
                                                        cur-page="0"></span></div>

            <div class="clearfix zhanghu-dian"><span class="tab-dot now"></span><span class="tab-dot"></span></div>
        </div>
    </div>
    <!--正文内容结束-->
</div>
</body>
</html>
