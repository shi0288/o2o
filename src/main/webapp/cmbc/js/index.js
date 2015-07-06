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
            alert("���¼",function(){
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
        url: "/bankServices/OtherService/score?timestamp=" + new Date().getTime(),
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
                $("#jifen").show();
                alert("��һ��ǩ����");
                $("#jifen").html("<p>�ܻ���:</p><p>"+score+"</p>");
                after();
            } else if(repCode == '0001'){
                $("#jifen").show();
                var score = result.score;
                alert("ǩ���ɹ���");
                $("#jifen").html("<p>�ܻ���:</p><p>"+score+"</p>");
            }else if(repCode == '0002'){
                var score = result.score;
                $("#jifen").show();
                alert("�����Ѿ�ǩ����");
                $("#jifen").html("<p>�ܻ���:</p><p>"+score+"</p>");
            }else{
                $("#jifen").show();
                after();
                alert("ǩ��ʧ��");
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
        url: "/bankServices/OtherService/check?timestamp=" + new Date().getTime(),
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
                $("#jifen").html("<p>�ܻ���:</p><p>"+score+"</p>");
                after();
            } else if(repCode == '0001'){
                var score = result.score;
                $("#qiandao").show();
                $("#qiandao").html("<p>�ܻ���:</p><p>"+score+"</p>");
            }else if(repCode == '0002'){
                var score = result.score;
                $("#qiandao").show();
                alert("�����Ѿ�ǩ����");
                $("#qiandao").html("<p>�ܻ���:</p><p>"+score+"</p>");
            }else{
                after();
                alert("ǩ��ʧ��");
            }

        }
    });
}


