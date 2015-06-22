package com.mcp.sv.alipay;


public class AlipayConfig {
	
	// 合作身份者ID，以2088开头由16位纯数字组成的字符串
	public static String partner = "2088911788270715";
	
	// 收款支付宝账号，以2088开头由16位纯数字组成的字符串
	public static String seller_id = partner;

	// MD5加密KEY
	public static String MD5_KEY="u30np0hbi0pt20p4nuhzj7zy3umnluuw";

	// 字符编码格式 目前支持 gbk 或 utf-8
	public static String input_charset = "utf-8";
	
	// 签名方式 不需修改
	public static String sign_type = "MD5";

	// 支付接口名称

	public static String service = "alipay.wap.create.direct.pay.by.user";

	//支付方式
	public static String payment_type="1";

	public static String notify_url="http://www.mcp8.net/alipay/dealRecharge.htm";

	public static String return_url="http://www.mcp8.net/cmbc/success_cz.jsp";

	public static String show_url="http://www.mcp8.net/cmbc/acount.html";



}
