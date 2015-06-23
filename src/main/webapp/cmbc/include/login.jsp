<%@ page import="com.mcp.sv.util.CmbcConstant" %>
<%@ page import="com.mcp.sv.util.MD5" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script type="text/javascript" src="/cmbc/js/commontz.js"></script>
<script type="text/javascript">
    $(document).ready(function () {
        /*登录  */
        var flag = sessionStorage.getItem("login");
        var userInfo = <%=request.getParameter("userInfo")%>;
        if ( flag == null && userInfo != null) {//尚未登陆，需要处理登陆。
            var jsonUser = null;
            try{
                jsonUser = JSON.parse(userInfo);
            }catch (err){}
            sessionStorage.setItem("login", "login");
            sessionStorage.setItem("name", jsonUser["userName"]);
            sessionStorage.setItem("passWord", jsonUser["userName"]+"123456");
            sessionStorage.setItem("address", userInfo.address);
            sessionStorage.setItem("mobile", userInfo.mobile);
        }
    });
</script>
