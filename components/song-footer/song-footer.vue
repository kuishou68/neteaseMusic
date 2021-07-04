<template>
	<view class="container ios-safe-area">
		<!--底部旋转图片-->
		<image src="../../static/109951165806093811.jpg"></image>
		<view class="player-info">
			<text class="player-info-title" >半生雪半生雪半生雪半生雪半生雪半生雪半生雪半生雪</text><br/>
			<text class="player-info-singer" >肖邦肖邦肖邦</text>
		</view>
		<view class="player-controls">
			<!--播放按钮-->
			<text class="player-controls-button1 iconfont icon-bofang"></text>
			<!--下一首-->
			<text class="player-controls-button2 iconfont icon-kuaijin" ></text>
			<!--列表播放-->
			<text class="player-controls-button3 iconfont icon-list" ></text>
		</view>
	</view>
</template>

<script>
	// 引入iconfont 样式
	import '../../common/iconfont.css'
	// 引入API
	import { songDetail , songUrl , songLyric , songSimi , songComment  } from '../../common/api.js';
	
	export default {
		name:"footer",
		props:{
			barList:{
				type:Array,
				default: []
			}
		},
		data() {
			return {
				// clickIndex: uni.getStorageSync("currentFooterIndex"),
			};
		},
		methods:{
			// onBarClick(item,index){
			// 	this.clickIndex = index
			// 	uni.setStorageSync("currentFooterIndex",index)
			// 	uni.redirectTo({
			// 		url:item.url,
			// 	})
			// }
			getMusic(songId){
				Promise.all([ songLyric(songId) ]).then((res)=>{
					if( res[0][1].data.code == '200'){
						console.log(res);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.container {position: fixed; bottom: 0; left: 0; width: 100%; height: 98rpx; background: #FFFFFF; box-shadow: 0 2rpx 40rpx 0 rgba(0, 0, 0, 0.18); display: flex; justify-content: space-around; align-items: center; z-index: 9999;
	/*旋转图片*/
	image{width: 58px;height: 58px;left: 0;top: 0;right: 345px;bottom: 0;margin: auto;position: fixed;margin-bottom: 0px;border-radius: 50%;animation: 10s linear infinite move;animation-play-state: paused;}
	@keyframes move{
		from{ transform : rotate(0deg);}
		to{ transform : rotate(360deg);}
	}
	/*歌曲信息*/
	.player-info{flex: 1; font-size: 10pt; line-height: 38rpx; margin-left: 127rpx; padding-bottom: 8rpx;
		/*歌名超出部分隐藏并用省略号显示*/
		overflow: hidden;//超出部分隐藏
		text-overflow: ellipsis;//溢出用省略号显示
		white-space: nowrap;//溢出不换行
		/*歌手名*/
		.player-info-singer{ color: #888; }
	}
	/*播放控制*/
	.player-controls{
		/*播放按钮*/
		.player-controls-button1{ font-size:35px;}
		/*下一首*/
		.player-controls-button2{ font-size:34px; margin-left:15px; }
		/*列表播放*/
		.player-controls-button3{ font-size:35px; margin-left:15px; margin-right: 10px;}
	}

}
</style> 
