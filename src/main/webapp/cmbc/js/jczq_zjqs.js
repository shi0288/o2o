//竞彩足球
$(document).ready(function() {
    $("#check-cb-jc").click(function(){
        if($(this).hasClass("now")){
            $(this).removeClass("now");
        }else{
            $(this).addClass("now");
        }
    });
    $(".jc-toggle").die().live("click",function(){
        var oTable=$(this).parent().siblings("table");
        if(oTable.hasClass("hide")){
            oTable.removeClass("hide");
            $(this).removeClass("candown");
        }else{
            oTable.addClass("hide");
            $(this).addClass("candown");
        }
    });
    /*	$(".jc-list-item-dan").die().live("click",function(){
     if($(this).hasClass("no")){
     return false;
     }
     var len=maxDan();
     if($(this).hasClass("on")){
     $(this).removeClass("on");
     $(".jc-list-item-dan").removeClass("no");
     }else{
     $(this).addClass("on");
     $("#duo-chuan").find(".chuan-item").hide();
     $("#duo-chuan").append("<p class='chuan-gtip'>胆拖不支持多串投注</p>");
     if($(".jc-list-item-dan.on").length==len){
     $(".jc-list-item-dan").each(function(index, element) {
     if(!$(this).hasClass("on")){
     $(this).addClass("no");
     }
     });
     }
     }
     jcSum();
     });*/
    $(".jc-del").click(function(){
        $("#jc-match").find("td").removeClass("on");
        $(".jc-list").eq(0).html("");
        $(".jc-table").removeClass("on");
        $("#zhushu").html(0);
        $("#qianshu").html(0);
        $("#jc-cs").html("至少选2场比赛");
    });
    $(".green-check").click(function(){
        togOn(this);
    });
    $(".mt-cancel").click(function(){
        $(".chuan-item").removeClass("on");
        $("#xchuan").find(".chuan-item[data-class=on]").addClass("on");
    });
    //加减注数
    $(".jc-k-right").click(function(){
        var zhu=$("#zhushu").html();
        zhu=parseInt(zhu);
        var bei=$(this).parent().find("input").val();
        bei=parseInt(bei);
        bei=bei+1;
        $(this).parent().find("input").val(bei);
        $("#qianshu").html(bei*zhu*2);
    });
    $(".jc-k-left").click(function(){
        var zhu=$("#zhushu").html();
        zhu=parseInt(zhu);
        var bei=$(this).parent().find("input").val();
        bei=parseInt(bei);
        if(bei>1){
            bei=bei-1;
            $(this).parent().find("input").val(bei);
            $("#qianshu").html(bei*zhu*2);
        }
    });
    $("#beishu").blur(function(){
        var zhu=$("#zhushu").html();
        zhu=parseInt(zhu);
        var bei=$(this).parent().find("input").val();
        bei=parseInt(bei);
        $(this).parent().find("input").val(bei);
        $("#qianshu").html(bei*zhu*2);
    });
    $(".jc-ok").eq(0).click(function(){
        if($("#jcdg").hasClass("check-org now")){
            var chuan=$(".jc-table.on").find(".danguan[danguan=chuan]");
            if(chuan.length>=1){
                alert('只能选择单关游戏');
                return false;
            }
            if($(".jc-table.on").length>=1){
                jcList();
                chuanChange();
                //算注数
                jcSum();
                jctwo();
                $("html,body").animate({'scrollTop':0}, 50);
            }else{
                alert("请至少选择1场比赛");
            }
        }else{
            if($(".jc-table.on").length>=2){
                jcList();
                chuanChange();
                //算注数
                jcSum();
                jctwo();
                $("html,body").animate({'scrollTop':0}, 50);
            }else{
                alert("请至少选择2场比赛");
            }
        }
    });
    $(".jc-xchuan").click(function(e){
        $(".cover").eq(0).show();
        $("#xchuan").show();
        e.stopPropagation();
    });
    /*$(".jc-list-item-close").die().live("click",function(){
     var datacc=$(this).parent().attr("data-cc");
     $(".jc-table[data-cc="+datacc+"]").eq(0).removeClass("on");
     $(".jc-table[data-cc="+datacc+"]").eq(0).find("td").removeClass("on");
     $(this).parent().remove();
     //算注数
     chuanChange();
     jcSum();

     });*/

    $(".mt-ok").click(function(){
        var html="";
        var data="";
        if($(".chuan-item.on").length<1){
            alert("至少选择一种过关方式");
            return false;
        }
        if($("#jcdg").hasClass("check-org now")){
            data="r1c1";
            html="单场固定";
        }else{
            $("#xchuan").find(".on").each(function(index) {
                if(index==$("#xchuan").find(".on").length-1){
                    html+=$(this).html();
                    data+=$(this).attr("data-chuan");
                }else{
                    html+=$(this).html()+",";
                    data+=$(this).attr("data-chuan")+",";
                }
            });
        }
        $("#chuanguan").attr("data-chuan",data);
        $("#chuanguan").html(html);
        jcSum();
        $(".chuanguan").hide();
        $(".cover").hide();
        $(".chuan-item").removeAttr("data-class");
        $(".chuan-item.on").attr("data-class","on");
        var changs=$(".jc-list-item").length;
        var len=maxDan();
        if(changs<=len+1){
            $(".jc-list-item-dan").addClass("no");
        }else{
            $(".jc-list-item-dan").removeClass("no");
        }
        if($("#duo-chuan .chuan-item").hasClass("on")){
            $(".jc-list-item-dan").addClass("no");
        }
    });
    /*$(".jc-list-item-dw").die().live("click",function(){
     var datacc=$(this).parents(".jc-list-item").attr("data-cc");
     var cctable=$(".jc-step1").eq(0).find(".jc-table[data-cc="+datacc+"]");
     var datawf=$(this).parent().attr("data-wf");
     var datadit=$(this).attr("data-dit");
     var wf=cctable.find(".jc-table-b[data-wf="+datawf+"]").eq(0);
     var att=wf.find("td[data-dit="+datadit+"]").eq(0);
     att.removeClass("on");
     if($(this).parents(".jc-list-item-cot").find(".jc-list-item-dw.on").length<2){
     cctable.removeClass("on");
     $(this).parents(".jc-list-item").remove();
     chuanChange();
     }else{
     $(this).remove();
     chuanList();
     }
     //算注数
     jcSum();
     });	*/
});
var xuanzeMap = {};
function seleMatch(evel){
    var key = $(evel).parents(".jc-table").attr("data-cc");
    if($(evel).hasClass("on")){
        if(xuanzeMap[key] && xuanzeMap[key]== 1){
            delete xuanzeMap[key];
        }else{
            xuanzeMap[key] = xuanzeMap[key] - 1;
        }
        var datacc=$(evel).parents('table').attr("data-cc");
        var datawf=$(evel).parent().attr("data-wf");
        var datadit=$(evel).attr("data-dit");
        $(evel).removeClass("on");
        $("#id_"+datacc).find("."+datawf).eq(0).find(".jc-list-item-dw[data-dit="+datadit+"]").removeClass("on");
        if($(evel).parents("table").find(".on").length<1){
            $(evel).parents("table").removeClass("on");
            $("#id_"+datacc).remove();
        }
    }else{
        if (xuanzeMap[key]) {
            xuanzeMap[key] = xuanzeMap[key] + 1;
        }else{
            var tableLength = Object.keys(xuanzeMap).length;
            if($("#jcdg").hasClass("check-org now")){
                if(tableLength>=8){
                    alert("单关最多能选8场比赛");
                    return false;
                }else{
                    xuanzeMap[key]=1;
                }
            }else{
                if(tableLength>=6){
                    alert("总进球最多能串6场比赛");
                    return false;
                }else{
                    xuanzeMap[key]=1;
                }
            }
        }
        $(evel).addClass("on");
        $(evel).parents("table").addClass("on");
    }
    var cs=getChangshu();
    if(cs>=1){
        $("#jc-cs").html("您选择了"+cs+"场比赛");
    }else{
        $("#jc-cs").html("至少选1场比赛");
    }
}
//最多可以设胆的数量
function maxDan(){
    var srr=[];
    var crr=$("#chuanguan").attr("data-chuan");
    if(!crr){
        return false;
    }
    crr=crr.split(",");
    $.each(crr,function(i,val){
        var iit=val.charAt(1);
        iit=parseInt(iit);
        srr.push(iit);
    });
    var len= Math.max.apply(Math,srr)-1;
    return len;
}
//删除该行选项
function closeClick(evel){
    var changci=getChangshu();
    if($("#jcdg").hasClass("check-org now")){
        if(changci<=1){
            alert("单关最少选1场比赛");
            return;
        }
    }else{
        if(changci<=2){
            alert("最少串2场比赛");
            return;
        }
    }
    var datacc=$(evel).parent().attr("data-cc");
    $(".jc-table[data-cc="+datacc+"]").eq(0).removeClass("on");
    $(".jc-table[data-cc="+datacc+"]").eq(0).find("td").removeClass("on");
    $(evel).parent().remove();
    //算注数
    chuanChange();
    jcSum();
    changci=getChangshu();
    $("#jc-cs").html("您选择了" + changci + "场比赛");
}
//删除某项
function delClick(evel){
    var jcList =  $(".jc-list-item").length;
    if(!$("#jcdg").hasClass("check-org now")){
        if(jcList<=2){
            if ($(evel).parents(".jc-list-item-cot").find(".jc-list-item-dw.on").length <= 1){
                alert("最少串2场比赛");
                return;
            }
        }
    }else{
        if(jcList<=1){
            if ($(evel).parents(".jc-list-item-cot").find(".jc-list-item-dw.on").length <= 1){
                alert("单关最少选1场比赛");
                return;
            }
        }
    }
    var datacc=$(evel).parents(".jc-list-item").attr("data-cc");
    var cctable=$(".jc-step1").eq(0).find(".jc-table[data-cc="+datacc+"]");
    var datawf=$(evel).parent().attr("data-wf");
    var datadit=$(evel).attr("data-dit");
    var wf=cctable.find(".jc-table-b[data-wf="+datawf+"]").eq(0);
   // var att=wf.find("td[data-dit="+datadit+"]").eq(0);
    var att=cctable.find("td[data-dit="+datadit+"]");
    att.removeClass("on");
    if($(evel).parents(".jc-list-item-cot").find(".jc-list-item-dw.on").length<2){
        cctable.removeClass("on");
        $(evel).parents(".jc-list-item").remove();
        chuanChange();
    }else{
        $(evel).remove();
        chuanList();
    }
    //算注数
    jcSum();
    var changci=getChangshu();
    $("#jc-cs").html("您选择了" + changci + "场比赛");
}
//点击胆
function danClick(evel){
    if($(evel).hasClass("no")){
        return false;
    }
    var len=maxDan();
    if($(evel).hasClass("on")){
        $(evel).removeClass("on");
        $(".jc-list-item-dan").removeClass("no");
    }else{
        $(evel).addClass("on");
        $("#duo-chuan").find(".chuan-item").hide();
        $("#duo-chuan").append("<p class='chuan-gtip'>胆拖不支持多串投注</p>");
        if($(".jc-list-item-dan.on").length==len){
            $(".jc-list-item-dan").each(function(index, element) {
                if(!$(this).hasClass("on")){
                    $(this).addClass("no");
                }
            });
        }
    }
    jcSum();
}
//列出选择列表
function jcList(){
    $(".jc-table.on").each(function(index) {
        var cc=$(this).attr("data-cc");
        var sfc=$(this).find(".jc-table-b").find('td.on');
        if($("#id_"+cc).length<1){
            var html='<div class="jc-list-item" id="id_'+cc+'" data-cc="'+cc+'">'+
                '<div class="jc-list-item-close" onClick="closeClick(this)"></div>'+
                '<div class="jc-list-item-dan" onClick="danClick(this)"></div>'+
                '<div class="jc-list-item-cot clearfix">'+
                '<div class="jc-list-item-ss">'+$(this).attr("data-des")+'</div>'+
                '<div class="spf" data-wf="spf">'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '</div>'+
                '<div class="cb"></div>'+
                '<div class="rf" data-wf="rf">'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '</div>'+
                '</div>'+
                '</div>';
            $(".jc-list").eq(0).append(html);
        }else{
            var htmls='<div class="jc-list-item-ss">'+$(this).attr("data-des")+'</div>'+
                '<div class="spf" data-wf="spf">'+
                '<span class="jc-list-item-dw"  onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '</div>'+
                '<div class="cb"></div>'+
                '<div class="rf" data-wf="rf">'+
                '<span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span><span class="jc-list-item-dw" onClick="delClick(this)"></span>'+
                '</div>';
            $("#id_"+cc).find(".jc-list-item-cot").eq(0).html(htmls);
        }
        if(sfc.length>0){
            sfc.each(function(aa){
                var datadit=$(this).attr("data-dit");
                var dataodds = $(this).attr("data-odds");
                $("#id_"+cc).find(".spf").eq(0).find(".jc-list-item-dw").eq(aa).addClass("on");
                $("#id_"+cc).find(".spf").eq(0).find(".jc-list-item-dw").eq(aa).html($(this).html());
                $("#id_"+cc).find(".spf").eq(0).find(".jc-list-item-dw").eq(aa).attr("data-dit",datadit);
                $("#id_" + cc).find(".spf").eq(0).find(".jc-list-item-dw").eq(aa).attr("data-odds", dataodds);
            });
        }
    });
    var iheight=$(document).height();
    if($(window).height()>$(document).height()){
        iheight=$(window).height();
    }
    $(".cover").height(iheight);
}
//更新选串信息
function chuanChange(){
    var changs=$(".jc-list-item-cot").length;
    if(changs>8){
        changs=8;
    }
    if($("#jcdg").hasClass("check-org now")){
        $("#chuanguan").html("单场固定");
        $("#chuanguan").attr("data-chuan","r1c1");
    }else{
        if(changs>=2){
            chuanList();
            var datachuan="r"+changs+"c1";
            var htmlchuan=changs+"串1";
            $("#chuanguan").attr("data-chuan",datachuan);
            $("#chuanguan").html(htmlchuan);
            var thischuan=$("#xchuan").find(".chuan-item[data-chuan="+datachuan+"]");
            $("#xchuan").find(".chuan-item").removeClass("on");
            $("#xchuan").find(".chuan-item").removeAttr("data-class");
            thischuan.addClass("on");
            thischuan.attr("data-class","on");
        }else{
            $("#chuanguan").html("过关方式");
            $("#chuanguan").removeAttr("data-chuan");
        }
    }
    var len=maxDan();
    if(changs<=len+1){
        $(".jc-list-item-dan").addClass("no");
    }else{
        $(".jc-list-item-dan").removeClass("no");
    }
}
//列出对应的串关
function chuanList(){
    var arrT=typeArr();
    var n=$(".jc-list-item").length;
    $("#zy-chuan").html("");
    $("#duo-chuan").html("");
    if($("#jcdg").hasClass("check-org now")){
        $("#zy-chuan").append('<span class="chuan-item" data-chuan="r1c1" onClick="togOn(this)">单场固定</span>');
    }else{
        $.each(arrT,function(i,item){
            if(item.charAt(1)<=n){
                var len=item.length;
                var chuanm=item.split(/[a-z]/);
                var chuanstr="";
                if(chuanm[1] != n){
                    return true;
                }else{
                    chuanstr=chuanm[1]+"串"+chuanm[2];
                }
                var chuanHtml='<span class="chuan-item" data-chuan="'+item+'" onClick="togOn(this)">'+chuanstr+'</span>';
                if(chuanm[2]=="1"){
                    //自由过关
                    $("#zy-chuan").append(chuanHtml);
                }else{
                    //多串过关
                    $("#duo-chuan").append(chuanHtml);
                }
            }
        });
    }
}
//获取选择的场数
function getChangshu(){
    var cs=$("table.on").length;
    return cs;
}
//显示第一步
function jcone(){
    $("#jc-two").hide();
    $("#jc-one").show();
    $(".jc-step2").hide();
    $(".jc-step1").show();
}
//显示第二步
function jctwo(){
    $("#jc-one").hide();
    $("#jc-two").show();
    $(".jc-step1").hide();
    $(".jc-step2").show();
}
//竞彩算注数
function jcSum(){
    var beishu=$("#beishu").val();
    beishu=parseInt(beishu);
    var sumzhu=0;
    var type=$("#chuanguan").attr("data-chuan");
    if(!type){
        $("#zhushu").html(0);
        $("#qianshu").html(0);
        return false;
    }
    if($(".jc-list-item").length<1){
        $("#zhushu").html(0);
        $("#qianshu").html(0);
        return false;
    }
    type=type.split(",");
    for(var j=0;j<type.length;j++){
        var chuan=type[j];
        var evzhu=0;
        var arr=[];
        var arrdan=[];
        var arrtuo=[];
        $(".jc-list-item").each(function(index, element) {
            var ssm=$(this).find(".jc-list-item-dw.on").length;
            if($(this).find(".jc-list-item-dan.on").length>0){
                arrdan.push(index);
            }else{
                arrtuo.push(index);
            }
            arr.push(ssm);

        });
        evzhu=sumAll(arrdan,arrtuo,arr,chuan);
        sumzhu+=evzhu;
    }
    $("#zhushu").html(sumzhu);
    $("#qianshu").html(sumzhu*2*beishu);
    checkCbbJc();//判断彩币支付是否勾选
}
