import { baseUrl } from './config.js';

// 登录接口（可登录自己真实的网易云音乐账号）
export function login(params){
	return uni.request({
		url:`${baseUrl}/login/cellphone`,
		method: 'POST',
		data: params
	})
}
// 注册接口
export function register(params){
	return uni.request({
		url:`${baseUrl}/register/cellphone`,
		method: 'POST',
		data: params
	})
}
// 发送验证码
export function sendCode(params){
	return uni.request({
		url:`${baseUrl}/captcha/sent`,
		method: 'POST',
		data: params
	})
}
// 验证验证码
export function sendCodeVerify(params){
	return uni.request({
		url:`${baseUrl}/captcha/verify`,
		method: 'POST',
		data: params
	})
}
// 请求歌单详情接口
export function topList(){
	// 修改前，以前的接口依赖idx 
	// var listIds = ['3' , '0' , '2' , '1' ];
	// 修改后，id是不同版单的唯一值
	var listIds = ['19723756' , '3779629' , '2884035' , '3778678'];
	return new Promise(function(resolve,reject){
		uni.request({
			// 首页分类接口
			url: `${baseUrl}/toplist/detail`,
			// 请求方式
			method: 'GET',
			data: {},
			// 成功之后的结果
			success: res => {
				// 得到数组前四项
				let result = res.data.list;
				result.length = 4;	
				// 遍历一遍，把结果返回出去
				for(var i=0;i<result.length;i++){
					result[i].listId = listIds[i];
				} 
				resolve(result);
			},
			fail: (err) => {
				console.log(err);
			},
			complete: () => {}
		});
	});
}
// 歌曲列表接口
export function list(listId){
	return uni.request({
		// 旧接口，idx已经废弃了
		// url: `${baseUrl}/top/list?idx=${listId}`,
		// 新接口，后台做了登录拦截！
		url: `${baseUrl}/playlist/detail?id=${listId}`,
		method: 'GET'
	});
}
// 获取所有歌曲详情
export function songDetail(id){
	return uni.request({
		url : `${baseUrl}/song/detail?ids=${id}`,
		method : 'GET'
	})
}
// 获取音频地址
export function songUrl(id){
	return uni.request({
		url : `${baseUrl}/song/url?id=${id}`,
		method : 'GET'
	})
}
// 获取歌词
export function songLyric(id){
	return uni.request({
		url : `${baseUrl}/lyric?id=${id}`,
		method : 'GET'
	})
}
// 获取相似音乐
export function songSimi(id){
	return uni.request({
		url : `${baseUrl}/simi/song?id=${id}`,
		method : 'GET'
	})
}
// 歌曲评论
export function songComment(id){
	return uni.request({
		url : `${baseUrl}/comment/music?id=${id}`,
		method : 'GET'
	})
}
// 热搜列表(详细)
export function searchHot(){
	return uni.request({
		url : `${baseUrl}/search/hot/detail`,
		method : 'GET'
	})
}
// 搜索结果
export function searchWord(word){
	return uni.request({
		url : `${baseUrl}/search?keywords=${word}`,
		method : 'GET'
	})
}
// 搜索建议
export function searchSuggest(word){
	return uni.request({
		url : `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method : 'GET'
	})
}