/*订单提交，如果选择彩币支付，则投注数据payType为1，第三方投注支付，payType为0.*/
/*彩币支付提交以后，走正常流程。第三方支付提交以后，走支付接口，调用setWebitEvent("11111111", "LT03");
 */
var thisUrl = window.location.href;
var termCode = "";
$(document).ready(function () {
    var thisUrl = window.location.href;
    before();
    getJcData();//获取竞彩数据
    // getUserData();
    //筛选联赛
    $("#jc-ls-ok").click(function () {
        var arrJcl = [];
        if ($("#jc-liansai span.on").length < $("#jc-liansai span").length) {
            $("#jc-liansai span").each(function () {
                if (!$(this).hasClass("on")) {
                    var lshtml = $(this).html();
                    arrJcl.push(lshtml);
                }
            });
        }
        $(".jc-table").show();
        $(".lsname").each(function (index, element) {
            var bres = $.inArray($(this).html(), arrJcl);
            if (bres != -1) {
                $(this).parents(".jc-table").hide();
            }
            $("#jc-ss-pop").hide();
            $(".cover").hide();
        });
    });
    //五大联赛
    $("#jc-bigls").click(function () {
        var arrBigls = ["德甲", "法甲", "意甲", "西甲", "英超"];
        $("#jc-liansai span").removeClass("on");
        $("#jc-liansai span").each(function (index, element) {
            var bres = $.inArray($(this).html(), arrBigls);
            if (bres != -1) {
                $(this).addClass("on");
            }
        });
    });
    $("#tz-btn").click(function () {
        var qqshu = $("#qianshu").html();
        qqshu = parseInt(qqshu);
        var cs=$("table.on").length;
        if (cs > 8) {
            alert("最多只能选择8场比赛");
            return false;
        }
        if($("#beishu").val()>10000){
            alert("不能大于10000倍");
            return false;
        }
        if($("#danzhangbeishu").val()>99){
            alert("单张倍数不能超过99倍");
            return false;
        }
        if (qqshu > 20000) {
            alert("每单不能超过2万元");
            return false;
        }
        var login = sessionStorage.getItem("login");
        if (login == null) {//尚未登陆，需要处理登陆。
            alert("您未登录，请登录",function(){
                window.location.href="login.html";
            })
            return false;
        }
        before();
        submitJc(); //提交订单
    });
});
//提交竞彩订单
function submitJc() {
    //var userName = sessionStorage.getItem("name");
    //var passWord = sessionStorage.getItem("passWord");
    //if(userName == "" || userName == undefined || userName == null){
    //    alert("请先登录在进行提交");
    //    //return;
    //}
    var amount = $("#qianshu").html();
    amount = parseInt(amount) * 100;
    var betType = $("#chuanguan").attr("data-chuan");
    if(betType == undefined){
        alert("错误的玩法");
        return;
    }else{
        betType = betType.replace(/[a-z]/g, "");
    }

    var numbers = getJcNums();

    var playType = $("#game").attr("data-play");

    var tickets = [];
    var ticket = {
        'gameCode': $("#game").attr("data-game"),
        'termCode': termCode,
        'type': 0,
        'amount': amount,
        'bType': betType,
        'pType': playType,
        'number': numbers,
        'multiple': $("#beishu").val(),
        "presetTerminal":"0000",
        "outerId":new Date().getTime()+Math.random().toString(36).substr(8),
        "auditTime":new Date().format("yyyy-MM-dd hh:mm:ss")
    }
    tickets.push(ticket);
    // console.log(tickets.toString());

    var order = {
        'amount': amount,
        'outerId':new Date().getTime()+Math.random().toString(36).substr(8),
        'tickets': tickets
    };

    var body = {
        'order':order
    };
    console.log(body);
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
function jcTzSuccess(order, amount) {
    $.ajax({
        type: "POST",
        url: "jczqsucess.html",
        dataType: "html",
        success: function (result) {
            var href = "fanganjc.html#" + order['outerId'];
            $(".jc-bg").eq(0).find("div").hide();
            $(".jc-bg").append(result);
            $(".succ-amount").html(amount);
            $(".succ-link").attr("href", href);

        }
    });
}
//获取投注号码
function getJcNums() {
    var arrNum = [];
    $(".jc-list-item").each(function (index, element) {
        var str = "";
        var _this = this;
        if ($(_this).find(".jc-list-item-dan").hasClass("on")) {
            str += "$";
        }
        var cc =  $(this).attr("data-cc");
        var strNum = "";
        if (index ==  $(".jc-list-item").length - 1) {
            termCode = $(this).attr("data-cc");
        }
        $(_this).find(".jc-list-item-dw.on").each(function (i, val) {
            var self = this;
            var length = $(self).parent().find(".jc-list-item-dw.on").length;
            var test = $(self).attr("data-dit");
            if(i == 0){
                strNum = $(self).attr("data-type")+"|"+cc+"|"+ $(self).attr("data-dit").substring(1);
            }else if (i == $(self).parent().find(".jc-list-item-dw.on").length - 1) {
                strNum += "," +$(self).attr("data-dit").substring(1);
            }else{
                strNum += "," +$(self).attr("data-dit").substring(1) ;
            }
        });
        str += strNum;
        arrNum.push(str);
    });
    arrNum = arrNum.join(";");
    return arrNum;
}

//获取竞彩数据
function getJcData() {
    var playType = $("#game").attr("data-play");
    if(playType == "05"){
        playType = ["01", "02", "03", "04"];
    }else{
        playType = [playType];
    }

    var body = {
        "gameCode":"T52",
        "pType": playType
    };
    $.ajax({
        type: "POST",
        //url: "/bankServices/LotteryService/getInfo?timestamp=" + new Date().getTime(),
        url: "/bankServices/LotteryService/commonTransQuery?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            body: JSON.stringify(body),
            cmd:"CQ22"
        },
        success: function (result) {
            after();
            var obj = eval(result);
            var repCode = obj.repCode;
            if (repCode == '0000') {
                getMatchHhggInfo(obj.rst);
            } else {
                after();
                alert(result.description);
            }
        },
        error: onError
    });
}
function getMatchHhggInfo(obj){
    $.each(obj, function(index,item){

        var lsname = item.l_cn;
        var home_cn = item.home_cn;
        var guest_cn = item.guest_cn;
        var openTime  = item.openTime;
        var closeTime  = item.closeTime;
        var code = item.code;

        var sf = item.mnl;
        var sf_rf = item.hdc;
        var sfc = item.wnm;
        var dxf = item.hilo;

        var changciHtml;

        var screenHtml = '<div class="jc-tz-item" id="s_' + code + '" >' +
            '<div class="jc-title">编号' +
            '<span class="week">' + code + '</span>' +
            '<span class="screen-num"></span>场次比赛<a class="jc-toggle" href="javascript:void(-1)"></a>'
        '</div>';
        $("#jc-match").append(screenHtml);

        var open1 = '<td rowspan="3" width="18%"  onclick="selOpenClose(\'open'+code+'\')">弹出胜分差</td>';

        var sf_sOdds = '<td width="18%" class="false" >胜-</td>';
        var sf_fOdds =  '<td width="18%" class="false" >负-</td>';
        var sf_fixedOdds = '<td width="18%" class="false" ></td>';
        if(sf){
            sf_sOdds = '<td width="18%" data-dit="v1"  ptype = "02" onclick="seleMatch(this)" >胜'+sf.win + '</td>';
            sf_fOdds = '<td width="18%" data-dit="v2"  ptype = "02" onclick="seleMatch(this)" >负'+sf.lose + '</td>';
        }

        var sf_rfsOdds = '<td width="18%" class="false" >胜-</td>';
        var sf_rffOdds = '<td width="18%" class="false" >负-</td>';
        var sf_rffixedOdds = '<td width="18%" class="false" data-dit="" ptype = "01" ></td>';
        if(sf_rf){
            sf_rfsOdds = '<td width="18%" data-dit="v1"  ptype = "01" onclick="seleMatch(this)" >胜' + sf_rf.win + '</td>';
            sf_rffOdds = '<td width="18%" data-dit="v2"  ptype = "01" onclick="seleMatch(this)" >负' + sf_rf.lose + '</td>';
            sf_rffixedOdds = '<td width="18%" class="false" data-dit="" ptype = "01" >让球（' + sf_rf.fixedodds + '）</td>';
        }

        var dxfdOdds = '<td width="18%" class="false"  >大-</td>';
        var dxfxOdds ='<td width="18%" class="false"  >小-</td>';
        var dxffixedOdds = '<td width="18%" class="false" ></td>';;
        if(dxf){
            dxfdOdds = '<td width="18%" data-dit="v1"  ptype = "04" onclick="seleMatch(this)" >大' + dxf.big + '</td>';
            dxfxOdds = '<td width="18%" data-dit="v2"  ptype = "04" onclick="seleMatch(this)" >小' + dxf.small + '</td>';
            dxffixedOdds = '<td width="18%" class="false" data-dit=""  ptype = "04" >预设总分（' + dxf.fixedodds + '）</td>';
        }

        var oddsTag = '<tr class="jc-table-b">'+sf_sOdds+ sf_rfsOdds + dxfdOdds + open1 + '</tr>';
        var oddsTag1 = '<tr class="jc-table-b">'+sf_fixedOdds+  sf_rffixedOdds + dxffixedOdds + '</tr>';
        var oddsTag2 = '<tr class="jc-table-b">'+sf_fOdds+ sf_rffOdds + dxfxOdds + '</tr>';

        var oddsTag3 =  '<tr class="jc-table-b"><td width="12.5%" rowspan="3" style="background-color:#fff5d6;">胜分差</td><td width="12.5%"></td><td width="12.5%"  class="false">(1-5)</td><td width="12.5%"  class="false">(6-10)</td><td width="12.5%"  class="false">(11-15)</td><td width="12.5%"  class="false">(16-20)</td><td width="12.5%"  class="false">(21-25)</td><td width="12.5%"  class="false">(26+)</td></tr>'+
            '<tr class="jc-table-b"><td  width="12.5%" style="color:#AEAEAE">客胜</td><td  width="12.5%" class="false">-</td><td  width="12.5%" class="false">-</td><td  width="12.5%" class="false">-</td><td  width="12.5%" class="false">-</td><td  width="12.5%" class="false">-</td><td  width="12.5%" class="false">-</td></tr>'+
        '<tr class="jc-table-b"><td width="12.5%" style="color:#AEAEAE">主胜</td><td width="12.5%" class="false">-</td><td width="12.5%" class="false">-</td><td width="12.5%" class="false">-</td><td width="12.5%" class="false">-</td><td width="12.5%" class="false">-</td><td width="12.5%" class="false">-</td></tr>';
        if(sfc){
            oddsTag3 ='<tr class="jc-table-b"><td width="12.5%" rowspan="3" style="background-color:#fff5d6;">胜分差</td><td width="12.5%"></td><td width="12.5%"  class="false">(1-5)</td><td width="12.5%"  class="false">(6-10)</td><td width="12.5%"  class="false">(11-15)</td><td width="12.5%"  class="false">(16-20)</td><td width="12.5%"  class="false">(21-25)</td><td width="12.5%"  class="false">(26+)</td></tr>' +
            '<tr class="jc-table-b"><td  width="12.5%" style="color:#AEAEAE">客胜</td><td  width="12.5%" data-dit="v01"   ptype = "03"  onclick="seleMatch(this)">'+sfc.guestWin1+'</td><td  width="12.5%" data-dit="v02"   ptype = "03"  onclick="seleMatch(this)">'+sfc.guestWin2+'</td><td  width="12.5%" data-dit="v03"   ptype = "03"  onclick="seleMatch(this)">'+sfc.guestWin3+'</td><td  width="12.5%" data-dit="v04"   ptype = "03"  onclick="seleMatch(this)">'+sfc.guestWin4+'</td><td  width="12.5%" data-dit="v05"   ptype = "03"  onclick="seleMatch(this)">'+sfc.guestWin5+'</td><td  width="12.5%" data-dit="v06"   ptype = "03"  onclick="seleMatch(this)">'+sfc.guestWin6+'</td></tr>'
            + '<tr class="jc-table-b"><td width="12.5%" style="color:#AEAEAE">主胜</td><td width="12.5%" data-dit="v11"   ptype = "03"  onclick="seleMatch(this)">'+sfc.hostWin1+'</td><td width="12.5%" data-dit="v12"   ptype = "03"  onclick="seleMatch(this)">'+sfc.hostWin2+'</td><td width="12.5%" data-dit="v13"   ptype = "03"  onclick="seleMatch(this)">'+sfc.hostWin3+'</td><td width="12.5%" data-dit="v14"   ptype = "03"  onclick="seleMatch(this)">'+sfc.hostWin4+'</td><td width="12.5%" data-dit="v15"   ptype = "03"  onclick="seleMatch(this)">'+sfc.hostWin5+'</td><td width="12.5%" data-dit="v16"   ptype = "03"  onclick="seleMatch(this)">'+sfc.hostWin6+'</td></tr>'
        }

        changciHtml =
            '<table width="100%" data-des="' + home_cn + '&nbsp;&nbsp;VS&nbsp;&nbsp;' +guest_cn + '" data-cc="' + code + '" class="jc-table">' +
            '<tbody>' +
            '<tr class="jc-table-tbb ">' +
            '<td width="28%" class="jc-table-rb" rowspan="4"><p>' + code.substr(code.length - 3) + '</p><p>' + lsname + '</p><p class="time"><img src="img/sclock.png">' + closeTime + '</p></td>' +
            '<td width="72%" colspan="4"><span class="teamname">' + home_cn + '</span>V S<span class="teamname">' + guest_cn + '</span></td>' +
            '</tr>' +
            oddsTag +
            oddsTag1 +
            oddsTag2 +
            '<tr width="100%"  id="open' + code + '" style="display: none;"><td colspan="5">' +
            '<table width="100%"  >' +
            '<tbody>' +
            oddsTag3 +
            '</tbody>' +
            '</table>' +
            '</td></tr>'+
            '</tbody>' +
            '</table>';
        $("#s_" + code).append(changciHtml);
    });
    after();
}

function selOpenClose(id){
    var tableObj=$("#"+id);
    if(tableObj.is(":hidden")){
        tableObj.show();
        return;
    }
    tableObj.hide();
}


//生成3位字符串如022
function formNumber(num) {
    if (num < 10) {
        num = "00" + num;
    } else if (num >= 10 && num < 100) {
        num = "0" + num;
    }
    return num;
}
function toogle(evel) {
    if ($(evel).hasClass("on")) {
        $(evel).removeClass("on");
    } else {
        $(evel).addClass("on");
    }
}

function loginA04(name, password) {
    var body = {
        name: name,
        password: password
    };
    $.ajax({
        type: "POST",
        url: "/bankServices/LotteryService/commonTrans?timestamp=?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            cmd: 'A04',
            body: JSON.stringify(body)
        },
        success: function (result) {

        }
    });
}