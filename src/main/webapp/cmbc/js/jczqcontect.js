/*订单提交，如果选择彩币支付，则投注数据payType为1，第三方投注支付，payType为0.*/
/*彩币支付提交以后，走正常流程。第三方支付提交以后，走支付接口，调用setWebitEvent("11111111", "LT03");
 */
var termCode = "";
var matchinfo = [];
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
    var betType = $("#chuanguan").attr("data-chuan");
    if(betType==undefined){
        betType='11';
        amount=200;
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
        'matchinfo':matchinfo,
        'multiple': $("#beishu").val(),
        "presetTerminal":"0000",
        "outerId":new Date().getTime()+Math.random().toString(36).substr(8),
        "auditTime":new Date().format("yyyy-MM-dd hh:mm:ss")
    }
    tickets.push(ticket);
    var order = {
        'amount': amount,
        'outerId':new Date().getTime()+Math.random().toString(36).substr(8),
        'tickets': tickets
    };
    var body = {
        'order':order
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
                after();
            } else {
                alert("投注失败，请稍后重试。");
                after();
            }

        }
    });
}

//获取投注号码
function getJcNums() {
    var playType = $("#game").attr("data-play");
    var arrNum = [];
    $(".jc-list-item").each(function (index, element) {
        var str = "";
        var matchname="";
        matchname=$(this).find(".jc-list-item-ss").html().replace(/&nbsp;/ig, "");
        if ($(this).find(".jc-list-item-dan").hasClass("on")) {
            str += "$";
        }
        str += playType + "|" + $(this).attr("data-cc") + "|";
        if (index ==  $(".jc-list-item").length - 1) {
            termCode = $(this).attr("data-cc");
        }
        var strNum = "";
        $(this).find(".jc-list-item-dw.on").each(function (i, val) {
            if (i == $(this).parent().find(".jc-list-item-dw.on").length - 1) {
                strNum += $(this).attr("data-dit").substring(1);
            } else {
                strNum += $(this).attr("data-dit").substring(1) + ",";
            }

        });
        str += strNum;
        arrNum.push(str);
        matchinfo.push(matchname);
    });
    arrNum = arrNum.join(";");
    matchinfo = matchinfo.join(";");
    return arrNum;
}

//获取竞彩数据
function getJcData() {
    var pathName= window.location.pathname;
    var st=1;
    if('/cmbc/jczq.jsp'==pathName){
        st=2;
    }
    //if('/cmbc/jczq_rf.jsp'==pathName){
    //    st=2;
    //}
    if('/cmbc/jczq_zjqs.jsp'==pathName){
        st="ZJQS";
    }
    if('/cmbc/jczq_bqc.jsp'==pathName){
        st="BQCSPF";
    }
    if('/cmbc/jczq_bf.jsp'==pathName){
        st="BF";
    }

    var head = {
        "st":st
    };
    var body = {
        "gameCode":"T51",
        "pType":"05",
        "passType":"1"
    };
    $.ajax({
        type: "POST",
        url: "/bankServices/LotteryService/getJcInfo?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            head: JSON.stringify(head),
            body: JSON.stringify(body)
        },
        success: function (result) {
            after();
            var repCode = result.head.repCode;
            if (repCode == '0000') {
                var obj = eval(result.body);
                getMatchInfo(obj,st);
            } else {
                after();
                alert("请尝试刷新！");
                //alert(result.head.repCode);
            }
        },
        error: onError
    });
}
function getMatchInfo(obj,st){
    var Screen = [];//场次
    var arrls = [];//联赛
    $.each(obj, function (key, item) {
        var code = item.code;
        code = code.substring(0, 8);
        Screen.push(code);
        var liansai = item.matchInfo;
        $.each(liansai, function (index, match) {
            arrls.push(match.matchName);
        });
    });
    //联赛去重
    arrls = unique(arrls);
    $.each(arrls, function (i, val) {
        var lsHtml = '<span class="on" onclick="toogle(this)">' + val + '</span>';
        $("#jc-liansai").append(lsHtml);
    });
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
        var selling = item.selling;
        var closeTime = item.closeTime;
        closeTime = stampTime(closeTime)-1000*60*10;
        var now=new Date().getTime();
        if(now-closeTime>=0){
            return;
        }
        code = code.substring(0, 8);
        arrcounti[code] += 1;
        //var changci = formNumber(arrcounti[code]);
        var changci = item.code.substring(9, 12);
        var teamname = item.matchInfo;
        var matchTime = item.closeTime;
       // matchTime = matchTime.substring(0, 10);
        $.each(teamname, function (index, match) {
            var matchName=match.matchName;
            var oddsSingle=match.oddsSingle;
            var style="";
            var danguan="chuan";
            if(oddsSingle=='1'){
                style="background-image:url(./img/single.gif);background-repeat:no-repeat;background-position:left top;";
                danguan="danguan";
            }
            matchName = matchName.split("|");
            var oodsCode = match.oddsCode;
            var oodsTag;


            if(st==1){
                if(oodsCode=='cn02'){
                    return;
                }
            }else{
                if(oodsCode=='cn01'){
                    return;
                }
            }
            var changciHtml = "";
            if(oodsCode=='cn01'){
                var rqspfdata = match.oddsInfo;
                if (rqspfdata) {
                    rqspfdata = rqspfdata.split("|");
                    var spfdata_zero,rqspfdata_one,rqspfdata_two,rqspfdata_three,rang;
                    rang=matchName[3];
                    if(rang!='未开售'){
                        rang='让'+matchName[3];
                    }
                    spfdata_zero = '<td width="18%" data-dit="v4" style="background-color: #999999">' + rang + '</td>';
                    if(selling=="Selling"&&(closeTime-now>0)&&rqspfdata[0]!="--"){
                        rqspfdata_one = '<td width="18%" data-dit="v3" onclick="seleMatch(this)">胜' + rqspfdata[0] + '</td>';
                        rqspfdata_two = '<td width="18%" data-dit="v1" onclick="seleMatch(this)">平' + rqspfdata[1] + '</td>';
                        rqspfdata_three = '<td width="18%" data-dit="v0" onclick="seleMatch(this)">负' + rqspfdata[2] + '</td>';
                    }else{
                        rqspfdata_one = '<td width="18%" class="false" data-dit="v3" style="background-color: #838383">胜' + rqspfdata[0] + '</td>';
                        rqspfdata_two = '<td width="18%" class="false" data-dit="v1" style="background-color: #838383">平' + rqspfdata[1] + '</td>';
                        rqspfdata_three = '<td width="18%" class="false" data-dit="v0" style="background-color: #838383">负' + rqspfdata[2] + '</td>';
                    }
                } else {
                    rqspfdata_one = '<td width="18%" class="false" data-dit="v3">胜--</td>';
                    rqspfdata_two = '<td width="18%" class="false" data-dit="v1">平--</td>';
                    rqspfdata_three = '<td width="18%" class="false" data-dit="v0">负--</td>';
                }
                oodsTag='<tr data-wf="rf" class="jc-table-b rf-dd">'+ spfdata_zero + rqspfdata_one + rqspfdata_two + rqspfdata_three + '</tr>'
                changciHtml =
                    '<table width="100%" data-des="' + matchName[0] + '&nbsp;&nbsp;VS&nbsp;&nbsp;' + matchName[1] + '" data-cc="' + item.code + '" class="jc-table">' +
                    '<tbody><tr class="jc-table-tbb">' +
                    '<td width="28%" class="jc-table-rb" rowspan="3"><p>' + changci + '</p><p class="lsname">' + matchName[2] + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                    '<td width="72%" class="danguan" colspan="4" danguan="'+ danguan +'" style="'+ style +'"><span class="teamname">' + matchName[0] + '</span>V S<span class="teamname">' + matchName[1] + '</span></td>' +
                    '</tr>' +
                    oodsTag +
                    '</tbody>' +
                    '</table>';
            }else if(oodsCode=='cn02'){
                var spfdata = match.oddsInfo;
                if (spfdata) {
                    spfdata = spfdata.split("|");
                    var spfdata_zero,spfdata_one,spfdata_two,spfdata_three,rang;
                    rang=matchName[3];
                    if(rang!='未开售'){
                        rang='让'+matchName[3];
                    }
                    spfdata_zero = '<td width="18%" data-dit="v4" style="background-color: #999999">' + rang + '</td>';
                    if(selling=="Selling"&&(closeTime-now>0)&&spfdata[0]!="--"){
                        spfdata_one = '<td width="18%" data-dit="v3" onclick="seleMatch(this)">胜' + spfdata[0] + '</td>';
                        spfdata_two = '<td width="18%" data-dit="v1" onclick="seleMatch(this)">平' + spfdata[1] + '</td>';
                        spfdata_three = '<td width="18%" data-dit="v0" onclick="seleMatch(this)">负' + spfdata[2] + '</td>';
                    }else{
                        spfdata_one = '<td width="18%" class="false" data-dit="v3" style="background-color: #838383">胜' + spfdata[0] + '</td>';
                        spfdata_two = '<td width="18%" class="false"  data-dit="v1" style="background-color: #838383">平' + spfdata[1] + '</td>';
                        spfdata_three = '<td width="18%" class="false" data-dit="v0" style="background-color: #838383">负' + spfdata[2] + '</td>';
                    }
                } else {
                    spfdata_one = '<td width="18%" class="false" data-dit="v3">胜--</td>';
                    spfdata_two = '<td width="18%" class="false" data-dit="v1">平--</td>';
                    spfdata_three = '<td width="18%" class="false" data-dit="v0">负--</td>';
                }
                oodsTag='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_zero + spfdata_one + spfdata_two + spfdata_three + '</tr>' ;
                changciHtml =
                    '<table width="100%" data-des="' + matchName[0] + '&nbsp;&nbsp;VS&nbsp;&nbsp;' + matchName[1] + '" data-cc="' + item.code + '" class="jc-table">' +
                    '<tbody><tr class="jc-table-tbb">' +
                    '<td width="28%" class="jc-table-rb" rowspan="3"><p>' + changci + '</p><p class="lsname">' + matchName[2] + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                    '<td width="72%" class="danguan" colspan="4" danguan="'+ danguan +'" style="'+ style +'"><span class="teamname">' + matchName[0] + '</span>V S<span class="teamname">' + matchName[1] + '</span></td>' +
                    '</tr>' +
                    oodsTag +
                    '</tbody>' +
                    '</table>';
            }else if(st=='BF'){//比分
                var spfdata = match.oddsInfo;
                if (spfdata) {
                    spfdata = spfdata.split("|");
                    var spfdata_zero = '<td data-dit="v01" width="5.14%" >胜</td>';
                    if(selling=="Selling"&&(closeTime-now>0)&&spfdata[0]!=""){
                        var spfdata_one = '<td data-dit="v10" width="10%" onclick="seleMatch(this)"><p>1:0</p><p>' + spfdata[0] + '</p></td>';
                        var spfdata_two = '<td data-dit="v20" width="10%" onclick="seleMatch(this)"><p>2:0</p><p>' + spfdata[1] + '</p></td>';
                        var spfdata_three = '<td data-dit="v21" width="10%" onclick="seleMatch(this)"><p>2:1</p><p>' + spfdata[2] + '</p></td>';
                        var spfdata_four = '<td data-dit="v30" width="10%" onclick="seleMatch(this)"><p>3:0</p><p>' + spfdata[3] + '</p></td>';
                        var spfdata_five = '<td data-dit="v31" width="10%" onclick="seleMatch(this)"><p>3:1</p><p>' + spfdata[4] + '</p></td>';
                        var spfdata_six = '<td data-dit="v32" width="10%" onclick="seleMatch(this)"><p>3:2</p><p>' + spfdata[5] + '</p></td>';
                        var spfdata_seven = '<td data-dit="v40" width="10%" onclick="seleMatch(this)"><p>4:0</p><p>' + spfdata[6] + '</p></td>';
                        var spfdata_eight = '<td data-dit="v41" width="10%" onclick="seleMatch(this)"><p>4:1</p><p>' + spfdata[7] + '</p></td>';
                        var spfdata_nine = '<td data-dit="v42" width="10%" onclick="seleMatch(this)"><p>4:2</p><p>' + spfdata[8] + '</p></td>';
                        var spfdata_ten = '<td data-dit="v50" width="10%" onclick="seleMatch(this)"><p>5:0</p><p>' + spfdata[9] + '</p></td>';
                        var spfdata_eleven = '<td data-dit="v51" width="10%" onclick="seleMatch(this)"><p>5:1</p><p>' + spfdata[10] + '</p></td>';
                        var spfdata_twelve = '<td data-dit="v52" width="10%" onclick="seleMatch(this)"><p>5:2</p><p>' + spfdata[11] + '</p></td>';
                        var spfdata_thirteen = '<td data-dit="v90" width="10%" colspan="2" onclick="seleMatch(this)"><p>胜其他</p><p>' + spfdata[12] + '</p></td>';

                        var tr_one='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one + spfdata_two + spfdata_three + spfdata_four + spfdata_five + spfdata_six + spfdata_seven + '</tr>' ;
                        var tr_two='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_eight + spfdata_nine + spfdata_ten + spfdata_eleven + spfdata_twelve + spfdata_thirteen +'</tr>' ;
                        oodsTag=tr_one+tr_two;

                        var spfdata_zero2 = '<td data-dit="v11" width="5.14%" >平</td>';
                        var spfdata_one2 = '<td data-dit="v00" width="10%" onclick="seleMatch(this)"><p>0:0</p><p>' + spfdata[13] + '</p></td>';
                        var spfdata_two2 = '<td data-dit="v11" width="10%" onclick="seleMatch(this)"><p>1:1</p><p>' + spfdata[14] + '</p></td>';
                        var spfdata_three2 = '<td data-dit="v22" width="10%" onclick="seleMatch(this)"><p>2:2</p><p>' + spfdata[15] + '</p></td>';
                        var spfdata_four2 = '<td data-dit="v33" width="10%" onclick="seleMatch(this)"><p>3:3</p><p>' + spfdata[16] + '</p></td>';
                        var spfdata_five2 = '<td data-dit="v99" width="10%" colspan="3" onclick="seleMatch(this)"><p>平其他</p><p>' + spfdata[17] + '</p></td>';

                        var oddTag2 = '<tr data-wf="spf" class="jc-table-b spf-dd">' +spfdata_one2+spfdata_two2+spfdata_three2+spfdata_four2+spfdata_five2+'</tr>' ;

                        var spfdata_zero3 = '<td data-dit="v21" width="5.14%" >负</td>';
                        var spfdata_one3 = '<td data-dit="v01" width="10%" onclick="seleMatch(this)"><p>0:1</p><p>' + spfdata[18] + '</p></td>';
                        var spfdata_two3 = '<td data-dit="v02" width="10%" onclick="seleMatch(this)"><p>0:2</p><p>' + spfdata[19] + '</p></td>';
                        var spfdata_three3 = '<td data-dit="v12" width="10%" onclick="seleMatch(this)"><p>1:2</p><p>' + spfdata[20] + '</p></td>';
                        var spfdata_four3 = '<td data-dit="v03" width="10%" onclick="seleMatch(this)"><p>0:3</p><p>' + spfdata[21] + '</p></td>';
                        var spfdata_five3 = '<td data-dit="v13" width="10%" onclick="seleMatch(this)"><p>1:3</p><p>' + spfdata[22] + '</p></td>';
                        var spfdata_six3 = '<td data-dit="v23" width="10%" onclick="seleMatch(this)"><p>2:3</p><p>' + spfdata[23] + '</p></td>';
                        var spfdata_seven3 = '<td data-dit="v04" width="10%" onclick="seleMatch(this)"><p>0:4</p><p>' + spfdata[24] + '</p></td>';
                        var spfdata_eight3 = '<td data-dit="v14" width="10%" onclick="seleMatch(this)"><p>1:4</p><p>' + spfdata[25] + '</p></td>';
                        var spfdata_nine3 = '<td data-dit="v24" width="10%" onclick="seleMatch(this)"><p>2:4</p><p>' + spfdata[26] + '</p></td>';
                        var spfdata_ten3 = '<td data-dit="v05" width="10%" onclick="seleMatch(this)"><p>0:5</p><p>' + spfdata[27] + '</p></td>';
                        var spfdata_eleven3 = '<td data-dit="v15" width="10%" onclick="seleMatch(this)"><p>1:5</p><p>' + spfdata[28] + '</p></td>';
                        var spfdata_twelve3 = '<td data-dit="v25" width="10%" onclick="seleMatch(this)"><p>2:5</p><p>' + spfdata[29] + '</p></td>';
                        var spfdata_thirteen3 = '<td data-dit="v09" width="10%" colspan="2" onclick="seleMatch(this)"><p>负其他</p><p>' + spfdata[30] + '</p></td>';

                        var tr_three='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one3 + spfdata_two3 + spfdata_three3 + spfdata_four3 + spfdata_five3 + spfdata_six3 + spfdata_seven3 + '</tr>' ;
                        var tr_four='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_eight3 + spfdata_nine3 + spfdata_ten3 + spfdata_eleven3 + spfdata_twelve3 + spfdata_thirteen3 +'</tr>' ;

                        var oddTag3 = tr_three+tr_four;
                    }else{
                        var spfdata_one = '<td data-dit="v10" width="10%" style="background-color: #838383"><p>1:0</p><p>' + spfdata[0] + '</p></td>';
                        var spfdata_two = '<td data-dit="v20" width="10%" style="background-color: #838383"><p>2:0</p><p>' + spfdata[1] + '</p></td>';
                        var spfdata_three = '<td data-dit="v21" width="10%" style="background-color: #838383"><p>2:1</p><p>' + spfdata[2] + '</p></td>';
                        var spfdata_four = '<td data-dit="v30" width="10%" style="background-color: #838383"><p>3:0</p><p>' + spfdata[3] + '</p></td>';
                        var spfdata_five = '<td data-dit="v31" width="10%" style="background-color: #838383"><p>3:1</p><p>' + spfdata[4] + '</p></td>';
                        var spfdata_six = '<td data-dit="v32" width="10%" style="background-color: #838383"><p>3:2</p><p>' + spfdata[5] + '</p></td>';
                        var spfdata_seven = '<td data-dit="v40" width="10%" style="background-color: #838383"><p>4:0</p><p>' + spfdata[6] + '</p></td>';
                        var spfdata_eight = '<td data-dit="v41" width="10%" style="background-color: #838383"><p>4:1</p><p>' + spfdata[7] + '</p></td>';
                        var spfdata_nine = '<td data-dit="v42" width="10%" style="background-color: #838383"><p>4:2</p><p>' + spfdata[8] + '</p></td>';
                        var spfdata_ten = '<td data-dit="v50" width="10%" style="background-color: #838383"><p>5:0</p><p>' + spfdata[9] + '</p></td>';
                        var spfdata_eleven = '<td data-dit="v51" width="10%" style="background-color: #838383"><p>5:1</p><p>' + spfdata[10] + '</p></td>';
                        var spfdata_twelve = '<td data-dit="v52" width="10%" style="background-color: #838383"><p>5:2</p><p>' + spfdata[11] + '</p></td>';
                        var spfdata_thirteen = '<td data-dit="v90" width="10%" colspan="2" style="background-color: #838383"><p>胜其他</p><p>' + spfdata[12] + '</p></td>';

                        var tr_one='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one + spfdata_two + spfdata_three + spfdata_four + spfdata_five + spfdata_six + spfdata_seven + '</tr>' ;
                        var tr_two='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_eight + spfdata_nine + spfdata_ten + spfdata_eleven + spfdata_twelve + spfdata_thirteen +'</tr>' ;
                        oodsTag=tr_one+tr_two;

                        var spfdata_zero2 = '<td data-dit="v11" width="5.14%" >平</td>';
                        var spfdata_one2 = '<td data-dit="v00" width="10%" style="background-color: #838383"><p>0:0</p><p>' + spfdata[13] + '</p></td>';
                        var spfdata_two2 = '<td data-dit="v11" width="10%" style="background-color: #838383"><p>1:1</p><p>' + spfdata[14] + '</p></td>';
                        var spfdata_three2 = '<td data-dit="v22" width="10%" style="background-color: #838383"><p>2:2</p><p>' + spfdata[15] + '</p></td>';
                        var spfdata_four2 = '<td data-dit="v33" width="10%" style="background-color: #838383"><p>3:3</p><p>' + spfdata[16] + '</p></td>';
                        var spfdata_five2 = '<td data-dit="v99" width="10%" colspan="3" style="background-color: #838383"><p>平其他</p><p>' + spfdata[17] + '</p></td>';

                        var oddTag2 = '<tr data-wf="spf" class="jc-table-b spf-dd">' +spfdata_one2+spfdata_two2+spfdata_three2+spfdata_four2+spfdata_five2+'</tr>' ;

                        var spfdata_zero3 = '<td data-dit="v21" width="5.14%" >负</td>';
                        var spfdata_one3 = '<td data-dit="v01" width="10%" style="background-color: #838383"><p>0:1</p><p>' + spfdata[18] + '</p></td>';
                        var spfdata_two3 = '<td data-dit="v02" width="10%" style="background-color: #838383"><p>0:2</p><p>' + spfdata[19] + '</p></td>';
                        var spfdata_three3 = '<td data-dit="v12" width="10%" style="background-color: #838383"><p>1:2</p><p>' + spfdata[20] + '</p></td>';
                        var spfdata_four3 = '<td data-dit="v03" width="10%" style="background-color: #838383"><p>0:3</p><p>' + spfdata[21] + '</p></td>';
                        var spfdata_five3 = '<td data-dit="v13" width="10%" style="background-color: #838383"><p>1:3</p><p>' + spfdata[22] + '</p></td>';
                        var spfdata_six3 = '<td data-dit="v23" width="10%" style="background-color: #838383"><p>2:3</p><p>' + spfdata[23] + '</p></td>';
                        var spfdata_seven3 = '<td data-dit="v04" width="10%" style="background-color: #838383"><p>0:4</p><p>' + spfdata[24] + '</p></td>';
                        var spfdata_eight3 = '<td data-dit="v14" width="10%" style="background-color: #838383"><p>1:4</p><p>' + spfdata[25] + '</p></td>';
                        var spfdata_nine3 = '<td data-dit="v24" width="10%" style="background-color: #838383"><p>2:4</p><p>' + spfdata[26] + '</p></td>';
                        var spfdata_ten3 = '<td data-dit="v05" width="10%" style="background-color: #838383"><p>0:5</p><p>' + spfdata[27] + '</p></td>';
                        var spfdata_eleven3 = '<td data-dit="v15" width="10%" style="background-color: #838383"><p>1:5</p><p>' + spfdata[28] + '</p></td>';
                        var spfdata_twelve3 = '<td data-dit="v25" width="10%" style="background-color: #838383"><p>2:5</p><p>' + spfdata[29] + '</p></td>';
                        var spfdata_thirteen3 = '<td data-dit="v09" width="10%" colspan="2" style="background-color: #838383"><p>负其他</p><p>' + spfdata[30] + '</p></td>';

                        var tr_three='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one3 + spfdata_two3 + spfdata_three3 + spfdata_four3 + spfdata_five3 + spfdata_six3 + spfdata_seven3 + '</tr>' ;
                        var tr_four='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_eight3 + spfdata_nine3 + spfdata_ten3 + spfdata_eleven3 + spfdata_twelve3 + spfdata_thirteen3 +'</tr>' ;

                        var oddTag3 = tr_three+tr_four;
                    }
                    oodsTag = oodsTag + oddTag2 + oddTag3;
                } else {

                }
                changciHtml =
                    '<table width="100%" data-des="' + matchName[0] + '&nbsp;&nbsp;VS&nbsp;&nbsp;' + matchName[1] + '" data-cc="' + item.code + '" class="jc-table">' +
                    '<tbody><tr class="jc-table-tbb">' +
                    '<td width="28%" class="jc-table-rb" rowspan="14"><p>' + changci + '</p><p class="lsname">' + matchName[2] + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                    '<td width="72%" colspan="14" danguan="'+ danguan +'" style="'+ style +'"><span class="teamname">' + matchName[0] + '</span>V S<span class="teamname">' + matchName[1] + '</span></td>' +
                    '</tr>' +
                    oodsTag +
                    '</tbody>' +
                    '</table>';
            }else if(st=='ZJQS'){//总进球数
                var spfdata = match.oddsInfo;
                if (spfdata) {
                    spfdata = spfdata.split("|");
                    if(selling=="Selling"&&(closeTime-now>0)&&spfdata[0]!=""){
                        var spfdata_one = '<td data-dit="v0" width="18%" onclick="seleMatch(this)"><p>0球</p><p>' + spfdata[0] + '</p></td>';
                        var spfdata_two = '<td data-dit="v1" width="18%" onclick="seleMatch(this)"><p>1球</p><p>' + spfdata[1] + '</p></td>';
                        var spfdata_three = '<td data-dit="v2" width="18%" onclick="seleMatch(this)"><p>2球</p><p>' + spfdata[2] + '</p></td>';
                        var spfdata_four = '<td data-dit="v3" width="18%" onclick="seleMatch(this)"><p>3球</p><p>' + spfdata[3] + '</p></td>';
                        var spfdata_five = '<td data-dit="v4" width="18%" onclick="seleMatch(this)"><p>4球</p><p>' + spfdata[4] + '</p></td>';
                        var spfdata_six = '<td data-dit="v5" width="18%" onclick="seleMatch(this)"><p>5球</p><p>' + spfdata[5] + '</p></td>';
                        var spfdata_seven = '<td data-dit="v6" width="18%" onclick="seleMatch(this)"><p>6球</p><p>' + spfdata[6] + '</p></td>';
                        var spfdata_eight = '<td data-dit="v7" width="18%" onclick="seleMatch(this)"><p>7+球</p><p>' + spfdata[7] + '</p></td>';

                        var tr_one='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one + spfdata_two + spfdata_three + spfdata_four +'</tr>' ;
                        var tr_two='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_five + spfdata_six + spfdata_seven + spfdata_eight + '</tr>' ;

                        oodsTag=tr_one+tr_two;
                    }else{
                        var spfdata_one = '<td data-dit="v0" width="18%" style="background-color: #838383"><p>0球</p><p>' + spfdata[0] + '</p></td>';
                        var spfdata_two = '<td data-dit="v1" width="18%" style="background-color: #838383"><p>1球</p><p>' + spfdata[1] + '</p></td>';
                        var spfdata_three = '<td data-dit="v2" width="18%" style="background-color: #838383"><p>2球</p><p>' + spfdata[2] + '</p></td>';
                        var spfdata_four = '<td data-dit="v3" width="18%" style="background-color: #838383"><p>3球</p><p>' + spfdata[3] + '</p></td>';
                        var spfdata_five = '<td data-dit="v4" width="18%" style="background-color: #838383"><p>4球</p><p>' + spfdata[4] + '</p></td>';
                        var spfdata_six = '<td data-dit="v5" width="18%" style="background-color: #838383"><p>5球</p><p>' + spfdata[5] + '</p></td>';
                        var spfdata_seven = '<td data-dit="v6" width="18%" style="background-color: #838383"><p>6球</p><p>' + spfdata[6] + '</p></td>';
                        var spfdata_eight = '<td data-dit="v7" width="18%" style="background-color: #838383"><p>7+球</p><p>' + spfdata[7] + '</p></td>';

                        var tr_one='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one + spfdata_two + spfdata_three + spfdata_four +'</tr>' ;
                        var tr_two='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_five + spfdata_six + spfdata_seven + spfdata_eight + '</tr>' ;

                        oodsTag=tr_one+tr_two;
                    }

                } else {

                }
                changciHtml =
                    '<table width="100%" data-des="' + matchName[0] + '&nbsp;&nbsp;VS&nbsp;&nbsp;' + matchName[1] + '" data-cc="' + item.code + '" class="jc-table">' +
                    '<tbody><tr class="jc-table-tbb">' +
                    '<td width="28%" class="jc-table-rb" rowspan="8"><p>' + changci + '</p><p class="lsname">' + matchName[2] + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                    '<td width="72%" colspan="8" danguan="'+ danguan +'" style="'+ style +'"><span class="teamname">' + matchName[0] + '</span>V S<span class="teamname">' + matchName[1] + '</span></td>' +
                    '</tr>' +
                    oodsTag +
                    '</tbody>' +
                    '</table>';
            }else if(st=='BQCSPF'){//半全场胜平负
                var spfdata = match.oddsInfo;
                if (spfdata) {
                    spfdata = spfdata.split("|");
                    if(selling=="Selling"&&(closeTime-now>0)&&spfdata[0]!=""){
                        var spfdata_one = '<td data-dit="v33" width="14%" onclick="seleMatch(this)"><p>胜胜</p><p>' + spfdata[0] + '</p></td>';
                        var spfdata_two = '<td data-dit="v31" width="14%" onclick="seleMatch(this)"><p>胜平</p><p>' + spfdata[1] + '</p></td>';
                        var spfdata_three = '<td data-dit="v30" width="14%" onclick="seleMatch(this)"><p>胜负</p><p>' + spfdata[2] + '</p></td>';
                        var spfdata_four = '<td data-dit="v13" width="14%" onclick="seleMatch(this)"><p>平胜</p><p>' + spfdata[3] + '</p></td>';
                        var spfdata_five = '<td data-dit="v11" width="14%" onclick="seleMatch(this)"><p>平平</p><p>' + spfdata[4] + '</p></td>';
                        var spfdata_six = '<td data-dit="v10" width="14%" onclick="seleMatch(this)"><p>平负</p><p>' + spfdata[5] + '</p></td>';
                        var spfdata_seven = '<td data-dit="v03" width="14%" onclick="seleMatch(this)"><p>负胜</p><p>' + spfdata[6] + '</p></td>';
                        var spfdata_eight = '<td data-dit="v01" width="14%" onclick="seleMatch(this)"><p>负平</p><p>' + spfdata[7] + '</p></td>';
                        var spfdata_nine = '<td data-dit="v00" width="14%" onclick="seleMatch(this)"><p>负负</p><p>' + spfdata[8] + '</p></td>';

                        var tr_one='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one + spfdata_two + spfdata_three + spfdata_four + spfdata_five + '</tr>' ;
                        var tr_two='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_six + spfdata_seven + spfdata_eight + spfdata_nine + '</tr>' ;

                        oodsTag=tr_one+tr_two;
                    }else{
                        var spfdata_one = '<td data-dit="v33" width="14%" style="background-color: #838383"><p>胜胜</p><p>' + spfdata[0] + '</p></td>';
                        var spfdata_two = '<td data-dit="v31" width="14%" style="background-color: #838383"><p>胜平</p><p>' + spfdata[1] + '</p></td>';
                        var spfdata_three = '<td data-dit="v30" width="14%" style="background-color: #838383"><p>胜负</p><p>' + spfdata[2] + '</p></td>';
                        var spfdata_four = '<td data-dit="v13" width="14%" style="background-color: #838383"><p>平胜</p><p>' + spfdata[3] + '</p></td>';
                        var spfdata_five = '<td data-dit="v11" width="14%" style="background-color: #838383"><p>平平</p><p>' + spfdata[4] + '</p></td>';
                        var spfdata_six = '<td data-dit="v10" width="14%" style="background-color: #838383"><p>平负</p><p>' + spfdata[5] + '</p></td>';
                        var spfdata_seven = '<td data-dit="v03" width="14%" style="background-color: #838383"><p>负胜</p><p>' + spfdata[6] + '</p></td>';
                        var spfdata_eight = '<td data-dit="v01" width="14%" style="background-color: #838383"><p>负平</p><p>' + spfdata[7] + '</p></td>';
                        var spfdata_nine = '<td data-dit="v00" width="14%" style="background-color: #838383"><p>负负</p><p>' + spfdata[8] + '</p></td>';

                        var tr_one='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_one + spfdata_two + spfdata_three + spfdata_four + spfdata_five + '</tr>' ;
                        var tr_two='<tr data-wf="spf" class="jc-table-b spf-dd">' + spfdata_six + spfdata_seven + spfdata_eight + spfdata_nine + '</tr>' ;

                        oodsTag=tr_one+tr_two;
                    }

                } else {

                }
                changciHtml =
                    '<table width="100%" data-des="' + matchName[0] + '&nbsp;&nbsp;VS&nbsp;&nbsp;' + matchName[1] + '" data-cc="' + item.code + '" class="jc-table">' +
                    '<tbody><tr class="jc-table-tbb">' +
                    '<td width="28%" class="jc-table-rb" rowspan="9"><p>' + changci + '</p><p class="lsname">' + matchName[2] + '</p><p class="time"><img src="img/sclock.png">' + matchTime + '</p></td>' +
                    '<td width="72%" colspan="9" danguan="'+ danguan +'" style="'+ style +'"><span class="teamname">' + matchName[0] + '</span>V S<span class="teamname">' + matchName[1] + '</span></td>' +
                    '</tr>' +
                    oodsTag +
                    '</tbody>' +
                    '</table>';
            }

            $("#s_" + code).append(changciHtml);
        });
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

