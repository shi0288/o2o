$(document).ready(function (e) {
    var outerId = window.location.href;
    outerId = outerId.split("#")[1];
    var ticketQuan;
    before();
    $.ajax({
        type: "POST",
        url: "/bankServices/LotteryService/getOrder?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            userName: sessionStorage.getItem("name"),
            passWord: sessionStorage.getItem("passWord"),
            outerId: outerId
        },
        success: function (result) {
            var repCode = result.repCode;
            if (repCode == '0000') {
                var objectOrder = JSON.parse(result.rst[0]);
                var body = JSON.parse(objectOrder.body);
                var order = body.order;
                var firTick = order.tickets[0];
                console.log(firTick);
                var termCode = firTick['termCode'];
                var time = objectOrder['createTime'];
                var amount = order['amount'];
                var status = objectOrder['status'];
                gameD(firTick);
                amount = toDecimalMoney(amount / 100);
                time = time.substring(0, 19);
                time = time.replace("T", " ");
                status = getOrderStatus(status);
                var outerId = objectOrder.outerId;
                $("#state").html(status);
                $("#czqi").html(termCode);
                $("#cztime").html(time);
                $("#orderId").html(outerId);
                $("#amount").html(amount);
                var gameCode = firTick['gameCode'];
                $.each(order.tickets, function (index, val) {
                    var numbers = val['number'];
                    var tzhu = val['amount'] / 200;
                    tzhu = tzhu / val['multiple'];
                    var bei = val['multiple'];
                    var zhu = val['amount'];
                    var ty='';
                    var t1 = val['pType'];
                    var t2 = val['bType'];
                    if(gameCode=='T51' || gameCode=='T52'){
                        ty = getJcType(gameCode,t1, t2);
                    }else{
                        ty = getType(t1, t2);
                    }
                    if(gameCode=='T01' && val['pType']=='05'){
                        tzhu+="[追加]";
                    }
                    var cotHtml = '<div class="faxq-out gerytext"><div><p>' + numbers + ty + '</p></div><p>倍数：' + bei + '</p><p>注数：' + tzhu + '</p></div>';
                    $("#tzcot").append(cotHtml);
                });
                after();
            } else {
                after();
                alert(result.description);
            }
        },
        error: onError
    });


    $("#pay_btn").click(function () {

        if ($("#check-cb").hasClass("now") && $("#huodao").hasClass("now")) {
            alert("不能同时选择两种支付类型");
            return;
        }
        if (!$("#check-cb").hasClass("now") && !$("#huodao").hasClass("now")) {
            alert("请选择一种支付方式");
            return;
        }
        var payType = "1";

        if (!$("#check-cb").hasClass("now")) {
            payType = "2";
        }

        $.ajax({
            type: "POST",
            url: "/bankServices/LotteryService/commitOrders?timestamp=" + new Date().getTime(),
            dataType: "json",
            cache: false,
            data: {
                userName: sessionStorage.getItem("name"),
                passWord: sessionStorage.getItem("passWord"),
                outerId: outerId,
                payType: payType
            },
            success: function (result) {
                console.log(result);
                var repCode = result.repCode;
                if (repCode == '0000') {
                    after();
                    tzSuccess();
                } else if (repCode == '1007') {
                    alert("账户余额不足，请充值");
                } else if (repCode == '1008') {
                    alert("此订单已经支付");
                }
                else {
                    alert(result.description);
                }
                after();
            },
            error: onError
        })
    });
});

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


//获取状态
function getJcType(gameCode,t1,t2) {
    var otype1;
    var otype2;
    if(gameCode=='T51'){
        otype1={"01":"让球胜平负","02":"胜平负","03":"比分","04":"总进球数","05":"半全场","06":"混合投注"};
        otype2='串';
    }else if(gameCode='T52'){
        otype1={"01":"让分胜负","02":"胜负","03":"胜分差","04":"大小分差","05":"混合投注"};
        otype2='串';
    }
    var type="["+otype1[t1]+'   '+t2.split('')[0]+otype2+t2.split('')[1]+"]";
    return type;
}


function tzSuccess() {
    $.ajax({
        type: "POST",
        url: "success.html?timestamp=" + new Date().getTime(),
        dataType: "html",
        success: function (result) {
            $("body").html(result);
            after();//删除弹出层提示
        }
    });
}

function gameD(obj) {
    switch (obj['gameCode']) {
        //双色球
        case "F01":
            $("#czimg").attr("src", "img/ico_ssq.png");
            $("#czfont").html("双色球");
            break;
        //福彩3D
        case "F02":
            $("#czimg").attr("src", "img/ico_3d.png");
            $("#czfont").html("福彩3D");
            break;
        //七乐彩
        case "F03":
            $("#czimg").attr("src", "img/ico_qlc.png");
            $("#czfont").html("七乐彩");
            break;
        //大乐透
        case "T01":
            $("#czimg").attr("src", "img/ico_dlt.png");
            $("#czfont").html("大乐透");
            break;
        //七星彩
        case "T02":
            $("#czimg").attr("src", "img/ico_qxc.png");
            $("#czfont").html("七星彩");
            break;
        //排列3
        case "T03":
            $("#czimg").attr("src", "img/ico_pl3.png");
            $("#czfont").html("排列三");
            break;
        //排列5
        case "T04":
            $("#czimg").attr("src", "img/ico_pl5.png");
            $("#czfont").html("排列五");
            break;
        //11选5
        case "T05":
            $("#czimg").attr("src", "img/ico_11xuan5.png");
            $("#czfont").html("11选5");
            break;
        case "T52":
            $("#czimg").attr("src", "img/ico_jclq.png");
            $("#czfont").html("竞彩篮球");
            break;
        case "T51":
            $("#czimg").attr("src", "img/ico_jczq.png");
            $("#czfont").html("竞彩足球");
            break;
    }
}