/*11选5payType为1
 /*彩币支付提交以后，走正常流程。第三方支付提交以后，走支付接口，调用setWebitEvent("11111111", "LT03");
 */
var thisUrl = window.location.href;
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        }
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}


$(document).ready(function (e) {
    thisUrl = window.location.href;
    //获取期号和截止时间
    getData();
    //获取账户信息
    //getUserData();
    //提交订单
    $(".step2").die().live("click", function () {
        zhuss = $("#zhushu").html();
        if ($("#zhushu").html() == 0) {
            alert("至少选择1注");
            return false;
        }
        var login = sessionStorage.getItem("login");
        if (login == null) {
            alert("您未登录，请登录",function(){
                window.location.href="login.html";
            })
            return false;
        }

        var gameCode = $("#game").attr("data-game");
        if(gameCode=="F01" || gameCode=="F02"|| gameCode=="F03"){
            if($("#beishu").html()>50){
                alert("不能大于50倍");
                return false;
            }
        }else {
            if ($("#beishu").html() > 99) {
                alert("不能大于99倍");
                return false;
            }
        }

        before();//显示弹出层提示
        var iqishu = $(".jj-k").eq(1).find("input").eq(0).val();
        iqishu = parseInt(iqishu);
        if (iqishu > 1) {
            //追号
            var body = getZhBody(iqishu);
            doTzhuZh(body, iqishu);
        } else {
            //非追号
            var order = getOrder();
            doTzhu(order);
        }
    });
});
//追号
function doTzhuZh(body, issue) {
    var payType = 1;
    var userId = sessionStorage.getItem("UserId");
    $.ajax({
        type: "POST",
        url: "/bankServices/LotteryService/commonTrans?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            cmd: 'S01',
            Id: sessionStorage.getItem("Id"),
            St: sessionStorage.getItem("St"),
            payType: payType,
            body: JSON.stringify(body)
        },
        success: function (result) {
            var repCode = result.repCode;
            var cai_name = $(".top-relative").eq(0).find(".title").eq(0).html();
            if (repCode == '0000') {
                if (payType == 1) {
                    tzSuccesszh(cai_name, zhuss, result['scheme']);
                }
//                else {
//                    //银行卡支付
//                    setWebitEvent(result.envelopeData, "LT03");
//                }
            } else if (repCode == '1007') {
                after();//删除弹出层提示
                alert("账户余额不足，请充值");
            } else {
                after();//删除弹出层提示
                alert(result.description);
            }
        }
    });
}
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
            amount:order.amount,
            outerId:order.outerId,
            body: JSON.stringify(body)
        },
        success: function (result) {
            var repCode = result.repCode;
            if (repCode == '0000') {
                window.location.href="confirm.html#"+order.outerId;
                after();
                // tzSuccess(cai_name, order, zhuss, result.outerId);
            } else if (repCode == '1007') {
                alert("账户余额不足，请充值");
            } else {
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
        url: "success.html",
        dataType: "html",
        success: function (result) {
            var iszhuihao = ""
            if ($("#zhuijia").length > 0 && $("#zhuijia").hasClass("now")) {
                iszhuihao = "[追加]";
            }
            var zjine = toDecimalMoney(order['amount'] / 100);
            var href = "fangan.html#" + respondOrderId;
            sessionStorage.setItem("orderId",respondOrderId);
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
function tzSuccesszh(cai_name, zhuss, respondOrder) {
    $.ajax({
        type: "POST",
        url: "success.html",
        dataType: "html",
        success: function (result) {
            var iszhuihao = ""
            if ($("#zhuijia").length > 0 && $("#zhuijia").hasClass("now")) {
                iszhuihao = "[追加]";
            }
            var zjine = toDecimalMoney(respondOrder['amount'] / 100);
            var href = "fanganzh.html#" + respondOrder['id'];
            sessionStorage.setItem("orderId",respondOrder['id']);
            $("body").html(result);
            $("#caizhong").html(cai_name);
            $("#qihao").html("追" + respondOrder['orderCount'] + "期");
            $("#zjine").html(zjine + "元");
            $("#zhuss").html(zhuss + "注" + iszhuihao);
            $("#jrwdcp").attr("href", href);

            after();//删除弹出层提示
        }
    });
};
//获取追号订单信息
function getZhBody(issue) {
    var numList = getNumList();
    var amount = $("#qianshu").html();
    amount = parseFloat(amount) * 100;
    var winstop = false;
    if ($("#zjstop").hasClass("now")) {
        winstop = true;
    }
    var scheme = {
        'amount': amount,
        'platform': 'HTML5',
        'payType': payType,
        'gameCode': $("#game").attr("data-game"),
        'startTermCode': $("#termCode").html(),
        'winStop': winstop,
        'orderCount': issue,
        'numList': numList
    };
    var body = {"scheme": scheme};
    return body;
}
//获取非追号订单信息
function getOrder() {
    var tick = getTick();
    var amount = $("#qianshu").html();
    amount = parseFloat(amount) * 100;
    var order = {
        'outerId':new Date().getTime()+Math.random().toString(36).substr(8),
        'amount': amount,
        'tickets': tick
    };
    return order;
//获取追号的getNumList
}
function getNumList() {
    var getNumList = "";
    $(".qiulist").each(function (index, element) {
        var betTypeCode = $(this).attr("data-type");
        var numbers = $(this).attr("data-res");
        var multiple = $("#beishu").html();
        multiple = parseInt(multiple);
        var playTypeCode = "";
        var evprice = 200; //每注价格200
        if ($("#zhuijia").length > 0 && $("#zhuijia").hasClass("now")) {
            playTypeCode = "05";
            var evprice = 300; //每注价格200
        } else {
            playTypeCode = $("#game").attr("data-play");
        }
        if ($(this).attr("data-play")) {
            playTypeCode = $(this).attr("data-play");
        }
        var zhu = $(this).attr("data-zs");
        zhu = parseInt(zhu);
        if (index == $(".qiulist").length - 1) {
            getNumList += playTypeCode + "~" + betTypeCode + "~" + numbers + "~" + multiple * zhu * evprice + "~" + multiple;
        } else {
            getNumList += playTypeCode + "~" + betTypeCode + "~" + numbers + "~" + multiple * zhu * evprice + "~" + multiple + "!";
        }
    });
    return getNumList;
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
            'termCode': String($("#termCode").html()),
            'type': 1,
            'amount': multiple * zhu * evprice,
            'bType': betTypeCode,
            'pType': playTypeCode,
            'number': numbers,
            'multiple': multiple,
            "presetTerminal":"0000",
            "outerId":new Date().getTime()+Math.random().toString(36).substr(8),
            "auditTime":new Date().format("yyyy-MM-dd hh:mm:ss")
        };

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
        var days = Math.floor(date3 / (24 * 3600 * 1000));
        var leave1 = date3 % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));
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
        'gameCode':gameCode
    };
    $.ajax({
        type: "POST",
        url: "/bankServices/LotteryService/getTerms?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            body: JSON.stringify(body)
        },
        success: function (result) {
            if (result.repCode=="0000") {
                var termCode = result.termCode;
                var lastime = result.closeTime;
                var endTime = result.closeTime;
                lastime = lastime.substring(0, 16);
                lastime = lastime.replace("T", " ");
                // var now = result.nowTime;
                // now = stampTime(now);
                var now=new Date(endTime).getTime();
                getLastTime(endTime, now);
                $("#termCode").html(termCode);
                $("#lastime").html(lastime);
                $("#termCode").show();
                $("#lastime").show();
                //11选5倒计时
                if ($("#x115").length > 0) {
                    $("#x115").show();
                    var timer = null;
                    timer = setInterval(InterTime, 1000);
                }
            } else if(result.repCode=="-1"){
                alert(result.description);
            }
            else {
                $(".bar-tip").eq(0).html("<span>未开售</span>");
            }
        }
    });
}
