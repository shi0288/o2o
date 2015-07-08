/*11选5payType为1
 /*彩币支付提交以后，走正常流程。第三方支付提交以后，走支付接口，调用setWebitEvent("11111111", "LT03");
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

        var now = new Date().getTime();
        var tempTime = new Date(lastime).getTime();
        if(now-tempTime>0){
            alert("本期正在开奖中，请稍后投注");
            return false;
        }

        if ($("#zhushu").html() == 0) {
            alert("至少选择1注");
            return false;
        }
        var login = sessionStorage.getItem("login");
        if (login == null) {
            alert("您未登录，请登录",function(){
                window.location.href="login.html";
            });
            return false;
        }
        if ($("#beishu").html() > 99) {
            alert("不能大于99倍");
            return false;
        }
        before();//显示弹出层提示
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

function getData() {
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
            var termCode = result.termCode;
            if (termCode!=undefined) {
                var lastime = result.closeTime;
                lastime=lastime.replace(new RegExp("-","gm"),"/");
                var endTime =new Date(lastime).getTime();
                var showTime = new Date(endTime - 10*6000);
                $("#termCode").html(termCode);
                $("#lastime").html(showTime.format("yyyy-MM-dd hh:mm:ss"));
                $("#termCode").show();
                $("#lastime").show();
            } else if(result.repCode=="-1"){
                alert(result.description);
            }
            else {
                $(".bar-tip").eq(0).html("<span>未开售</span>");
            }
        }
    });
}
