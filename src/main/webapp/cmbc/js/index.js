$(document).ready(function () {
    console.log('1111111111');
    var login = sessionStorage.getItem("login");
    if(login == null){
        $("#qiandao").show();
    }else{
        check();
    }
    $("#qiandao").click(function(){
        if(!login){
            alert("请登录",function(){
                window.location.href="login.html";
            })
        }else{
            submitQd();
        }
    })
});

function submitQd() {
    var body = {
        'userName':sessionStorage.getItem("name")
        //'userName':"gg365"
    };
    $.ajax({
        type: "POST",
        url: "/otherControl/score?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            userName: sessionStorage.getItem("name"),
            passWord: sessionStorage.getItem("passWord"),
            body: JSON.stringify(body)
        },
        success: function (result) {
            var repCode = result.repCode;
            //repCode = getScoreStatus(repCode);
            console.log(repCode);
            if (repCode == '0000') {
                var score = result.score;
                $("#qiandao").hide();
                $("#jifen").show();
                alert("第一次签到！");
                $("#jifen").html("总积分:"+score);
                after();
            } else if(repCode == '0001'){
                $("#qiandao").hide();
                $("#jifen").show();
                var score = result.score;
                alert("签到成功！");
                $("#jifen").html("总积分:"+score);
            }else if(repCode == '0002'){
                var score = result.score;
                $("#qiandao").hide();
                $("#jifen").show();
                alert("今天已经签到！");
                $("#jifen").html("总积分:"+score);
            }else{
                $("#qiandao").show();
                after();
                alert("签到失败");
            }

        }
    });
}
function check() {
    var body = {
        'userName':sessionStorage.getItem("name")
        //'userName':"gg365"
    };
    $.ajax({
        type: "POST",
        url: "/otherControl/check?timestamp=" + new Date().getTime(),
        dataType: "json",
        cache: false,
        data: {
            userName: sessionStorage.getItem("name"),
            passWord: sessionStorage.getItem("passWord"),
            body: JSON.stringify(body)
        },
        success: function (result) {
            var repCode = result.repCode;
            if (repCode == '0000') {
                var score = result.score;
                $("#jifen").show();
                $("#jifen").html("总积分:"+score);
                after();
            } else if(repCode == '0001'){
                var score = result.score;
                $("#qiandao").show();
                $("#qiandao").html("总积分:"+score);
            }else if(repCode == '0002'){
                var score = result.score;
                $("#qiandao").show();
                alert("从未签到！");
            }else{
                after();
                alert("签到失败");
            }

        }
    });
}


