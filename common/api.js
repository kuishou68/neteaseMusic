// 引入config.js配置文件
import { baseUrl } from './config.js';
// 请求接口
export function topList(){
	var listIds = ['3' , '0' , '2' , '1' ];
	return new Promise(function(resolve,reject){
		uni.request({
			// 请求地址
			url: `${baseUrl}/toplist/detail`,
			// 请求方式
			method: 'GET',
			data: {},
			// 成功之后的结果
			success: res => {
				// 得到数组前四项
				let result = res.data.list;
				result.length = 4;
				for(let i=0;i<result.length;i++){
					// 遍历一遍，把结果返回出去
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
/*歌曲列表接口*/
export function list(listId){
	return uni.request({
		url: `${baseUrl}/top/playlist?idx=${listId}`,
		method: 'GET'
	});
}

export function songDetail(id){
	return uni.request({
		url : `${baseUrl}/song/detail?ids=${id}`,
		method : 'GET'
	})
}
/*获取音频地址*/
export function songUrl(id){
	return uni.request({
		url : `${baseUrl}/song/url?id=${id}`,
		method : 'GET'
	})
}
/*获取歌词*/
export function songLyric(id){
	return uni.request({
		url : `${baseUrl}/lyric?id=${id}`,
		method : 'GET'
	})
}
/*获取相似音乐*/
export function songSimi(id){
	return uni.request({
		url : `${baseUrl}/simi/song?id=${id}`,
		method : 'GET'
	})
}

export function songComment(id){
	return uni.request({
		url : `${baseUrl}/comment/music?id=${id}`,
		method : 'GET'
	})
}
/*热搜列表(详细)*/
export function searchHot(){
	return uni.request({
		url : `${baseUrl}/search/hot/detail`,
		method : 'GET'
	})
}
/*搜索结果*/
export function searchWord(word){
	return uni.request({
		url : `${baseUrl}/search?keywords=${word}`,
		method : 'GET'
	})
}
/*搜索建议*/
export function searchSuggest(word){
	return uni.request({
		url : `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method : 'GET'
	})
}