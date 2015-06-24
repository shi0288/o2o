<%@ page import="com.mcp.sv.util.CmbcConstant" %>
<%@ page import="com.mcp.sv.util.MD5" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script type="text/javascript" src="/cmbc/js/commontz.js"></script>
<script type="text/javascript">
    $(document).ready(function () {
        /*登录  */
        var flag = sessionStorage.getItem("name");
        var userInfo = <%=session.getAttribute("userInfo")%>;
        if ( flag == null && userInfo != null) {//尚未登陆，需要处理登陆。
            var key = "<%=CmbcConstant.CMBC_SIGN_KEY %>";
            if(userInfo != null){
                sessionStorage.setItem("login", "login");
                sessionStorage.setItem("name", userInfo["userName"]);
                var password =  userInfo["userName"]+ key;
                sessionStorage.setItem("passWord",password);
            }else{
                alert("未登录成功");
            }
        }else{

        }
    });
</script>
