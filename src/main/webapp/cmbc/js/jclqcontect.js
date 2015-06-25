/*订单提交，如果选择彩币支付，则投注数据payType为1，第三方投注支付，payType为0.*/
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

var eventName = "";
var eventCode = "0";
var session = {};
var _locked = false;
function lock() {
    if (_locked) {
        return true;
    }
    _locked = true;
    return false;
}
function unlock() {
    _locked = false;
}
function getWebkitEventCode() {
    return eventCode;
}
function getWebkitEvent() {
    return eventName;
}
function getWebkitValues() {
    return "";
}
function setWebkitValues(a) {
}
function clearEvent() {
    eventCode = "0";
    eventName = "";
}
function initWebkitTitleBar() {
    clearEvent();
    return {"title": "\u7cfb\u7edf\u6807\u9898", "leftButton": {"exist": false}, "rightButton": {"exist": true, "name": "", "func": "touchRightButton();"}};
}
function setWebkitSession(a) {
    session = a;
    clearEvent();
}
var _session_timeout = false;
function showTimeOut() {
    if (!_session_timeout) {
        _session_timeout = true;
        setWebitEvent("clearEvent()", "11");
    }
}
var _mevents = new Array();
function setWebitEvent(b, a) {

    if (b == "") {
        return;
    }
    if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
        _mevents.push(JsonToStr({code: a, name: b}));
    } else if (browser.versions.android) {
        setAndroidWebitEvent(b, a);
    } else {// other client
    }
}
function getWebkitEventCode() {
    return _mevents.length > 0 ? _mevents.shift() : "0";
}
function getWebkitEvent() {
    return "";
}
function JsonToStr(o) {
    var arr = [];
    var fmt = function (s) {
        if (typeof s == 'object' && s != null) return JsonToStr(s);
        return /^(string|number)$/.test(typeof s) ? '"' + s + '"' : s;
    }
    for (var i in o)
        arr.push('"' + i + '":' + fmt(o[i]));
    return "{" + arr.join(',') + "}";
}
// ---------------android js调用------------------
function setAndroidWebitEvent(param, evtCode) {
//	if(evtName.indexOf("()")==-1){
//		evtName += "()";
//	}

    switch (evtCode) {
        case "LT01":
            window.SysClientJs.goBack();
            break;
        case "LT02":  //code : "HY01":调用客户端登录接口,HY03:返回9宫格接口
            window.SysClientJs.toLoginJGCP(param)
            break;
        case "LT03":// 瀚银调支付接口
            window.SysClientJs.submitOrderJGCP(param)
            break;
    }
}
$(document).ready(function () {
    var thisUrl = window.location.href;
    getJcData();//获取竞彩数据
    //getJcDatatest();
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
        if($("#beishu").val()>99){
            alert("不能大于99倍");
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
    var payType = 0;
    if ($("#check-cb-jc").hasClass("now")) {
        payType = 1;
    }
    var amount = $("#qianshu").html();
    amount = parseInt(amount) * 100;
    if(amount <= 0 ){
        alert("金额错误");
        return;
    }
    var betType = $("#chuanguan").attr("data-chuan");
    console.log(betType);
    betType = betType.replace(/[a-z]/g, "");
    if(betType == undefined){
        alert("错误的玩法");
        return;
    }
    console.log(betType);
    var numbers = getJcNums();
    console.log(numbers);

    var playType = $("#game").attr("data-play");

    var tickets = [];
    var ticket = {
        'gameCode': $("#game").attr("data-game"),
        'termCode': new Date().getTime(),
        'type': 0,
        'amount': amount,
        'bType': betType,
        'pType': playType,
        'number': numbers,
        'multiple': $("#beishu").val(),
        "presetTerminal":"0000",
        "outerId":new Date().getTime()+Math.random()*(1000-390)+390,
        "auditTime":new Date().format("yyyy-MM-dd hh:mm:ss")
    }
    tickets.push(ticket);
    console.log(tickets.toString());

    var order = {
        'amount': amount,
        'outerId':new Date().getTime()+Math.random()*(1000-390)+390,
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
            var href = "fanganjc.html#" + order['id'];
            $(".jc-bg").eq(0).find("div").hide();
            $(".jc-bg").append(result);
            $(".succ-amount").html(amount);
            $(".succ-link").attr("href", href);

        }
    });
}
//获取投注号码
function getJcNums() {
    var playType = $("#game").attr("data-play");
    var arrNum = [];
    if(playType == '01'||playType == '02'){//让球胜平负（01）胜平负（02）
        $(".jc-list-item").each(function (index, element) {
            var str = "";
            if ($(this).find(".jc-list-item-dan").hasClass("on")) {
                str += "$";
            }
            str += playType + "|" + $(this).attr("data-cc") + "|";
            var strNum = "";
            $(this).find(".jc-list-item-dw.on").each(function (i, val) {
                if (i == $(this).parent().find(".jc-list-item-dw.on").length - 1) {
                    strNum += $(this).attr("data-dit").substring(1, 2);
                } else {
                    strNum += $(this).attr("data-dit").substring(1, 2) + ",";
                }

            });
            str += strNum;
            arrNum.push(str);
        });
        arrNum = arrNum.join(";");
    }else{
        $(".jc-list-item").each(function (index, element) {
            var str = "";
            if ($(this).find(".jc-list-item-dan").hasClass("on")) {
                str += "$";
            }
            str += playType + "|" + $(this).attr("data-cc") + "|";
            var strNum = "";
            $(this).find(".jc-list-item-dw.on").each(function (i, val) {
                if (i == $(this).parent().find(".jc-list-item-dw.on").length - 1) {
                    strNum += $(this).attr("data-dit").substring(1, 3);
                } else {
                    strNum += $(this).attr("data-dit").substring(1, 3) + ",";
                }

            });
            str += strNum;
            arrNum.push(str);
        });
        arrNum = arrNum.join(";");
    }
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
        "pType":playType
    };
    $.ajax({
        type: "POST",
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
                getMatchInfo(obj.rst);
            } else {
                after();
                alert(result.description);
            }
        },
        error: onError
    });
}
function getMatchInfo(obj){
    var playType = $("#game").attr("data-play");
    var Screen = [];//场次
    //var arrls = [];//联赛
    $.each(obj, function (key, item) {
        //console.log(item);
        var code = item.code;
        code = code.substring(0, 8);
        Screen.push(code);
       /* var liansai = item.matchInfo;
        $.each(liansai, function (index, match) {
            arrls.push(match.matchName);
        });*/
    });
    //联赛去重
   /* arrls = unique(arrls);
    $.each(arrls, function (i, val) {
        var lsHtml = '<span class="on" onclick="toogle(this)">' + val + '</span>';
        $("#jc-liansai").append(lsHtml);
    });*/
    //type(st);
    //场次去重
    var arrcounti = {};
    Screen = unique(Screen);
    $("#login-img").remove();
    $.each(Screen, function (i, val) {
        arrcounti[val] = 0;
        var arrweek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        var year = val.substring(0, 4);
        var month = val.substring(4, 6);
        var day = val.substring(6, 8);
        var date = new Date(year, (parseInt(month) - 1), day);
        var week = date.getDay();
        week = arrweek[week];
        var screenHtml = '<div class="jc-tz-item" id="s_' + val + '" >' +
            '<div class="jc-title">' + year + '年' + month + '月' + day + '日' + '<span class="week">' + week + '</span>' +
            '<span class="screen-num"></span>场比赛<a class="jc-toggle" href="javascript:void(-1)"></a>'
        '</div>';
        $("#jc-match").append(screenHtml);
    });
    //获取每场比赛
    $.each(obj, function (key, item) {
        var code = item.code;
        code = code.substring(0, 8);
        arrcounti[code] += 1;
        var changci = formNumber(arrcounti[code]);
        var matchTime = item.closeTime;
        matchTime = matchTime.substring(0, 10);
        console.log(matchTime);
        if(playType == "02" && item.mnl){
            var rqspfdata = item.mnl;
            if (rqspfdata) {
                var rqspfdata_one,rqspfdata_two,rqspfdata_three
                if(rqspfdata.win == '--'){
                    rqspfdata_one = '<td width="36%" class="false" data-dit="v1" >胜' + rqspfdata.win + '</td>';
                    rqspfdata_two = '<td width="36%" class="false" data-dit="v2" >负' + rqspfdata.lose + '</td>';
                }else{
                    rqspfdata_one = '<td width="36%" data-dit="v1" onclick="seleMatch(this)">胜' + rqspfdata["win"] + '</td>';
                    rqspfdata_two = '<td width="36%" data-dit="v2" onclick="seleMatch(this)">负' + rqspfdata["lose"] + '</td>';
                }
            } else {
                rqspfdata_one = '<td width="36%" class="false" data-dit="v1">胜--</td>';
                rqspfdata_two = '<td width="36%" class="false" data-dit="v2">负--</td>';
            }
            var classSingle = "";
            if(item.mnl.single == '1'){
                classSingle="single";
            }
            oodsTag='<tr data-wf="spf" class="jc-table-b spf-dd">' + rqspfdata_one + rqspfdata_two + '</tr>'
            changciHtml =
                '<table width="100%" data-des="' + item.home_cn + '&nbsp;&nbsp;VS&nbsp;&nbsp;' + item.guest_cn + '" data-cc="' + item.code + '" class="jc-table">' +
                '<tbody><tr class="jc-table-tbb">' +
                '<td width="28%" class="jc-table-rb" rowspan="3"><p>' + changci + '</p><p class="lsname">' + item.l_cn + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                '<td width="72%" colspan="2" class='+classSingle+'><span class="teamname">' + item.home_cn + '</span>V S<span class="teamname">' + item.guest_cn + '</span></td>' +
                '</tr>' +
                oodsTag +
                '</tbody>' +
                '</table>';
            }else if(playType== '01' && item.hdc){
                var spfdata = item.hdc;
                if (spfdata) {
                    var spfdata_one,spfdata_two,spfdata_three;
                    if( spfdata[0]=='--'){
                        spfdata_one = '<td width="36%" class="false" data-dit="v1">胜' + spfdata["win"] + '</td>';
                        spfdata_two = '<td width="36%" class="false" data-dit="v2">负' + spfdata["lose"] + '</td>';
                    }else{
                        spfdata_one = '<td width="36%" data-dit="v1" onclick="seleMatch(this)">胜' + spfdata["win"] + '</td>';
                        spfdata_two = '<td width="36%" data-dit="v2" onclick="seleMatch(this)">负' + spfdata["lose"] + '</td>';
                    }
                } else {
                    spfdata_one = '<td width="36%" class="false" data-dit="v1">胜--</td>';
                    spfdata_two = '<td width="36%" class="false" data-dit="v2">负--</td>';
                }
                oodsTag='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one + spfdata_two + '</tr>' ;
                var classSingle = "";
                if(item.hdc.single == '1'){
                    classSingle="single";
                }
                changciHtml =
                    '<table width="100%" data-des="' + item.home_cn + '&nbsp;&nbsp;VS&nbsp;&nbsp;' + item.guest_cn + '" data-cc="' + item.code + '" class="jc-table">' +
                    '<tbody><tr class="jc-table-tbb">' +
                    '<td width="28%" class="jc-table-rb" rowspan="3"><p>' + changci + '</p><p class="lsname">' + item.l_cn + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                    '<td width="72%" colspan="2" class='+classSingle+'><span class="teamname">' + item.home_cn + '</span>V S<span class="teamname">' + item.guest_cn + '</span></td>' +
                    '</tr>' +
                    oodsTag +
                    '</tbody>' +
                    '</table>';
            }else if(playType== '03' && item.wnm){//比分
                var spfdata = item.wnm;
                var classSingle = "";
                if(item.wnm.single == '1'){
                    classSingle="single";
                }
                if (spfdata) {
                    var home_cn = '<td width="10%" class="false" data-dit="v1">主胜</td>';
                    var home1 = '<td width="10%" data-dit="v01" onclick="seleMatch(this)">(1-5)' + spfdata["hostWin1"] + '</td>';
                    var home2 = '<td width="10%" data-dit="v02" onclick="seleMatch(this)">(6-10)' + spfdata["hostWin2"] + '</td>';
                    var home3 = '<td width="10%" data-dit="v03" onclick="seleMatch(this)">(11-15)' + spfdata["hostWin3"] + '</td>';
                    var home4 = '<td width="10%" data-dit="v04" onclick="seleMatch(this)">(16-20)' + spfdata["hostWin4"] + '</td>';
                    var home5 = '<td width="10%" data-dit="v05" onclick="seleMatch(this)">(20-15)' + spfdata["hostWin5"] + '</td>';
                    var home6 = '<td width="10%" data-dit="v06" onclick="seleMatch(this)">(26+)' + spfdata["hostWin6"] + '</td>';

                    oodsTag='<tr data-wf="spf" class="jc-table-b spf-dd">'+ home_cn + home1 + home2 + home3 + home4 + home5 + home6 +'</tr>' ;

                    var guest_cn = '<td width="10%" class="false" data-dit="v1">客胜</td>';
                    var guest1 = '<td width="10%" data-dit="v11" onclick="seleMatch(this)">(1-5)' + spfdata["guestWin1"] + '</td>';
                    var guest2 = '<td width="10%" data-dit="v12" onclick="seleMatch(this)">(6-10)' + spfdata["guestWin2"] + '</td>';
                    var guest3 = '<td width="10%" data-dit="v13" onclick="seleMatch(this)">(11-15)' + spfdata["guestWin3"] + '</td>';
                    var guest4 = '<td width="10%" data-dit="v14" onclick="seleMatch(this)">(16-20)' + spfdata["guestWin4"] + '</td>';
                    var guest5 = '<td width="10%" data-dit="v15" onclick="seleMatch(this)">(21-25)' + spfdata["guestWin5"] + '</td>';
                    var guest6 = '<td width="10%" data-dit="v16" onclick="seleMatch(this)">(26+)' + spfdata["guestWin6"] + '</td>';

                    var oddTag2 = '<tr data-wf="spf" class="jc-table-b spf-dd">'+ guest_cn + guest1 + guest2 + guest3 + guest4 + guest5 + guest6  +'</tr>' ;

                    oodsTag = oodsTag + oddTag2 ;

                }
                changciHtml =
                    '<table width="100%" data-des="' + item.home_cn + '&nbsp;&nbsp;VS&nbsp;&nbsp;' + item.guest_cn + '" data-cc="' + item.code + '" class="jc-table">' +
                    '<tbody><tr class="jc-table-tbb">' +
                    '<td width="30%" class="jc-table-rb" rowspan="4"><p>' + changci + '</p><p class="lsname">' + item.l_cn + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                    '<td width="70%" colspan="7" class="'+ classSingle+'"><span class="teamname">' + item.home_cn + '</span>V S<span class="teamname">' +item.guest_cn + '</span></td>' +
                    '</tr>' +
                    oodsTag +
                    '</tbody>' +
                    '</table>';
            }else if(playType = '04' && item.hilo){//大小分
                var spfdata = item.hilo ;
                var classSingle = "";
                if(item.hilo.single == '1'){
                    classSingle="single";
                }
                if (spfdata) {
                    var spfdata_one = '<td data-dit="v1" width="24%" onclick="seleMatch(this)">大' + spfdata["big"] + '</td>';
                    var spfdata_two = '<td data-dit="v0" width="24%"  class="false" >预设总分' + spfdata["fixedodds"] + '</td>';
                    var spfdata_three = '<td data-dit="v2" width="24%" onclick="seleMatch(this)">小' + spfdata["small"] + '</td>';

                    oodsTag='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one + spfdata_two + spfdata_three  + '</tr>' ;
                } else {
                    var spfdata_one = '<td class="false" data-dit="v1">大</td>';
                    var spfdata_two = '<td class="false" data-dit="v0">-</td>';
                    var spfdata_three = '<td class="false" data-dit="v2">小</td>';
                }
                changciHtml =
                    '<table width="100%" data-des="' + item.home_cn + '&nbsp;&nbsp;VS&nbsp;&nbsp;' +item.guest_cn + '" data-cc="' + item.code + '" class="jc-table">' +
                    '<tbody><tr class="jc-table-tbb">' +
                    '<td width="28%" class="jc-table-rb" rowspan="3"><p>' + changci + '</p><p class="lsname">' + item.l_cn + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                    '<td width="72%" colspan="3" class="'+ classSingle+'"><span class="teamname">' + item.home_cn + '</span>V S<span class="teamname">' +item.guest_cn + '</span></td>' +
                    '</tr>' +
                    oodsTag +
                    '</tbody>' +
                    '</table>';
            }
            $("#s_" + code).append(changciHtml);
        });
    $(".jc-tz-item").each(function () {
        var screennum = $(this).find(".jc-table").length;
        $(this).find(".screen-num").html(screennum);
    });
}
//

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

