/*订单提交，如果选择彩币支付，则投注数据payType为1，第三方投注支付，payType为0.*/
/*
 */
var thisUrl = window.location.href;

$(document).ready(function (e) {
    thisUrl = window.location.href;
    //获取期号和截止时间
    getData();
    //提交订单
    $(".step2").die().live("click", function () {
        var lastime=$("#lastime").html();
        if(lastime==""||lastime==undefined){
            alert("本期未开售");
            return false;
        }
        zhuss = $("#zhushu").html();
        if ($("#zhushu").html() == 0) {
            alert("至少选择1注");
            return false;
        }
        var gameCode = $("#game").attr("data-game");
        if (gameCode == "F01" || gameCode == "F02" || gameCode == "F03") {
            if ($("#beishu").html() > 50) {
                alert("不能大于50倍");
                return false;
            }
        } else {
            if ($("#beishu").html() > 99) {
                alert("不能大于99倍");
                return false;
            }

        }
        var login = sessionStorage.getItem("login");
        if (login == null) {//尚未登陆，需要处理登陆。
            alert("您未登录，请登录", function () {
                window.location.href = "login.html";
            })
            return false;
        }
        before();
        var order = getOrder();
        doTzhu(order);
    });
});

//非追号
function doTzhu(order) {
    var body = {
        'order': order
    };
    $.ajax({
        type: "POST",
        url: "/bankServices/LotteryService/confirmOrders?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            userName: sessionStorage.getItem("name"),
            passWord: sessionStorage.getItem("passWord"),
            amount: order.amount,
            outerId: order.outerId,
            body: JSON.stringify(body)
        },
        success: function (result) {
            var repCode = result.repCode;
            if (repCode == '0000') {
                window.location.href = "confirm.html#" + order.outerId;
                after();
            } else if (repCode == '1007') {
                alert("账户余额不足，请充值");
            } else if (repCode == '1008') {
                alert("此订单已经支付");
            } else if (repCode == '1001') {
                alert("用户权限校验未通过");
            }
            else {
                alert("投注失败，请稍后重试。");
            }
            after();
        }
    });
}
//投注成功非追号
function tzSuccess(cai_name, order, zhuss, respondOrderId) {
    $.ajax({
        type: "POST",
        url: "success.html?timestamp=" + new Date().getTime(),
        dataType: "html",
        success: function (result) {
            var iszhuihao = ""
            if ($("#zhuijia").length > 0 && $("#zhuijia").hasClass("now")) {
                iszhuihao = "[追加]";
            }
            var zjine = toDecimalMoney(order['amount'] / 100);
            var href = "fangan.html#" + respondOrderId;
            sessionStorage.setItem("orderId", respondOrderId);
            $("body").html(result);
            $("#caizhong").html(cai_name);
            $("#qihao").html(order['termCode']);
            $("#zjine").html(zjine + "元");
            $("#zhuss").html(zhuss + "注" + iszhuihao);
            $("#jrwdcp").attr("href", href);
            after();//删除弹出层提示
        }
    });
}
//获取非追号订单信息
function getOrder() {
    if ($("#check-cb").hasClass("now")) {
        payType = 1;
    } else {
        payType = 0;
    }
    var tick = getTick();

    var amount = $("#qianshu").html();
    amount = parseFloat(amount) * 100;
    var order = {
        'amount': amount,
        'outerId': new Date().getTime() + Math.random().toString(36).substr(8),
        'tickets': tick
    };
    return order;
}
function getTick() {
    var tickets = [];
    $(".qiulist").each(function (index, element) {
        var betTypeCode = $(this).attr("data-type");
        var numbers = $(this).attr("data-res");
        var multiple = $("#beishu").html();
        var playTypeCode = "";
        var evprice = 200; //每注价格200
        if ($("#zhuijia").length > 0 && $("#zhuijia").hasClass("now")) {
            playTypeCode = "05";
            evprice = 300;
        } else {
            playTypeCode = $("#game").attr("data-play");
        }
        if ($(this).attr("data-play")) {
            playTypeCode = $(this).attr("data-play");
        }
        var zhu = $(this).attr("data-zs");
        zhu = parseInt(zhu);
        var ticket = {
            'gameCode': $("#game").attr("data-game"),
            'termCode': $("#termCode").html(),
            'type': 0,
            'amount': multiple * zhu * evprice,
            'bType': betTypeCode,
            'pType': playTypeCode,
            'number': numbers,
            'multiple': multiple,
            "presetTerminal": "0000",
            "outerId": new Date().getTime() + Math.random().toString(36).substr(8),
            "auditTime": new Date().format("yyyy-MM-dd hh:mm:ss")
        }
        tickets.push(ticket);
    });
    return tickets;
}
//弹出层
function popTick() {
    var html = '<div class="cover2"></div>' +
        '<div class="ticpop bluetext">数据正在传输，请稍等...</div>';
    $("body").append(html);
    $(".cover2").height($(document).height());
}
//删除弹出层
function removeTick() {
    $(".cover2").remove();
    $(".ticpop").remove();
}
//计算11选5剩余时间
function getLastTime(endTime, now) {
    if ($(".seconds").length > 0) {
        $("#x115").html('<span id="x115">距本期截止<font class="redtext minutes"></font>分<font class="redtext seconds"></font>秒</span>');
        endTime = stampTime(endTime);
        var date3 = endTime - now;
        //计算出相差天数
        var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);
        if (minutes < 0 || seconds < 0) {
            $("#x115").html("已截止销售");
        } else {
            $("#x115").find(".minutes").html(minutes);
            $("#x115").find(".seconds").html(seconds);
        }

    }
}
//11选5倒计时
function InterTime() {
    if ($("#x115").find(".seconds").length <= 0) {
        $("#x115").html("已截止销售");
        getData();
    } else {
        var oSec = $("#x115").find(".seconds").eq(0);
        var oMit = $("#x115").find(".minutes").eq(0);
        var sec = oSec.html();
        var mit = oMit.html();
        sec = parseInt(sec);
        mit = parseInt(mit);
        if (sec == 0 & mit == 0) {
            $("#x115").html("已截止销售");
            getData();
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
}

function getData() {
    //获取彩种名称
    var cai_name = $(".top-relative").eq(0).find(".title").eq(0).html();
    var zhuss = 0;
    cai_name = $.base.noHtml(cai_name);
    //显示期号和截止日期
    var gameCode = $("#game").attr("data-game");
    var body = {
        'gameCode': gameCode
    };
    $.ajax({
        type: 'POST',
        url: '/bankServices/LotteryService/getTerms?timestamp=' + new Date().getTime(),
        dataType: 'json',
        cache: false,
        data: {
            body: JSON.stringify(body)
        },
        success: function (result) {
            var termCode = result.termCode;
            if (termCode != undefined) {
                var lasTime = result.closeTime;
                var endTime = result.closeTime;
                lasTime = lasTime.substring(0, 16);
                lasTime = lasTime.replace("T", " ");
                // var now = result.nowTime;
                // now = stampTime(now);
                var now = new Date(endTime).getTime();
                getLastTime(endTime, now);
                $("#termCode").html(termCode);
                $("#lastime").html(lasTime);
                $("#termCode").show();
                $("#lastime").show();
                //11选5倒计时
                if ($("#x115").length > 0) {
                    $("#x115").show();
                }
            } else if (result.repCode == "9999") {
                alert(result.description);
            }
            else {
                $(".bar-tip").eq(0).html("<span>未开售</span>");
            }
        }
    });
}
