package com.mcp.sv.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.mcp.sv.dao.LotteryDao;
import com.mcp.sv.message.resp.Article;
import com.mcp.sv.message.resp.MessageResponse;
import com.mcp.sv.util.CmbcConstant;
import com.mcp.sv.util.MongoUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * 
 * 创建人：herosky   
 * 创建时间：2015-3-30 下午5:13:57   
 * 描述：菜单点击事件，处理
 *
 */
public class MenuClickService {

	/**
	 * 
	 * 描述：@param eventKey
	 * 描述：@param fromUserName
	 * 描述：@param toUserName
	 * 描述：@return 接受用户点击事件，通过微信推送给用户消息，跳转页面，发送消息等
	 * 作者：herosky
	 */
	public static String getClickResponse(String eventKey, String fromUserName,
			String toUserName) {
		// TODO 判断evetKey事件处理
		if(eventKey.equals("recharge"))
		{
			String password = fromUserName+ CmbcConstant.CMBC_SIGN_KEY;
			try {
				String userJson = LotteryDao.getUser(fromUserName, password);
				JSONObject user = JSON.parseObject(userJson);
				long recharge = user.getLong("recharge");
				long count = LotteryDao.getWealthList(recharge);
				List<Article> messageList = new ArrayList<Article>();
				Article article = new Article();
				article.setTitle("财富榜："+ count + "余额："+ (recharge /100) +"元");
				article.setDescription("查看余额明细和充值");
				article.setUrl("https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + CmbcConstant.APPID + "&redirect_uri=http://www.mcp8.net/weixin/callback&response_type=code&scope=snsapi_base&state=acount#wechat_redirect");
				messageList.add(article);
				return MessageResponse.getNewsMessage(fromUserName, toUserName, messageList);
			}catch (Exception e){
				e.printStackTrace();
			}
		}
		else if (eventKey.equals("tuijian")){

		}
		return null;
	}

}
