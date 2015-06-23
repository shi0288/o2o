$(document).ready(function (e) {
    var outerId = window.location.href;
    outerId = outerId.split("#")[1];
    var ticketQuan;
    before();
    $("#address").val(sessionStorage.getItem("address"));
    $("#mobile").val(sessionStorage.getItem("mobile"));

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
                ticketQuan=firTick;
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
                    var t1 = val['pType'];
                    var t2 = val['bType'];
                    var ty = getType(t1, t2);
                    /*if(val['gameCode']=='T01' && val['playTypeCode']=='05'){
                     tzhu+="[追加]";
                     }*/
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
        var mobile="";
        var address="";
        if (!$("#check-cb").hasClass("now")) {

            payType = "2";
            address = $("#address").val();
            mobile = $("#mobile").val();
            if(address==""){
                alert("地址不能为空");
                return;
            }
            if(mobile==""){
                alert("手机为空");
                return;
            }
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
                payType: payType,
                address:address,
                mobile:mobile
            },
            success: function (result) {
                console.log(result);
                var repCode = result.repCode;
                if (repCode == '0000') {
                    after();
                    tzSuccess();
                } else if (repCode == '1007') {
                    alert("账户余额不足，请充值");
                } else {
                    alert("投注失败，请稍后重试。");
                }
                after();
            },
            error: onError
        })
    });
});

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
    }
}