<template>
	<view class="container ios-safe-area">
		<!--底部播放栏-->
		<!-- <image :src="src" :class="{ 'detail-play-run' : isplayrotate }" mode=""></image>
		<view class="player-info">
			<text class="player-info-title" >{{ title }}</text><br/>
			<text class="player-info-singer" >{{ singer }}</text>
		</view> -->
		<image :src="src" :class="{ 'detail-play-run' : isplayrotate }" mode=""></image>
		<view class="player-info">
			<text class="player-info-title" >{{ title }}</text><br/>
			<text class="player-info-singer" >{{ singer }}</text>
		</view>
		<!--右边按钮-->
		<view class="player-controls" >
			<!--播放按钮-->
			<text class="player-controls-button1 iconfont icon-bofang" :class="playicon" @click="playPause()"></text>
			<!--下一首-->
			<text class="player-controls-button2 iconfont icon-kuaijin" @click="playNext"></text>
			<!--列表播放-->
			<text class="player-controls-button3 iconfont icon-list" ></text>
		</view>
	</view>
</template>

<script>
	// 引入css绝对路径
	import '../../common/iconfont.css'
	// 引入全局
	import { mapState } from 'vuex'
	// 引入API
	import { songDetail , songUrl , songLyric , songSimi , songComment  } from '../../common/api.js';
	
	export default {
		data() {
			return {
				songDetail : {
					al : { picUrl : '' },
					ar : { name : '' }
				},
				playicon: 'icon-suspend_icon',// 播放状态
				isplayrotate : true,// 暂停状态
			};
		},
		computed: {
			...mapState(['songDetail'])
		},
		// 自定义组件属性
		props : ['title','singer','src'],
		onLoad(options){
			// 等待加载
			uni.showToast({
				title:'正在加载...'
			})
			this.playMusic(options.songId);
		},
		methods : {
			// 播放/暂停 按钮
			playPause(){
				// #ifdef MP-WEIXIN
				this.bgAudioMannager = uni.getBackgroundAudioManager();
				this.bgAudioMannager.title = this.songDetail.name;
				// #endif
				// #ifdef H5
				if(!this.bgAudioMannager){
					// 创建并返回内部 audio 上下文 innerAudioContext 对象
					this.bgAudioMannager = uni.createInnerAudioContext();
					console.log('播放/暂停');
				}
				this.playicon = 'icon-bofang';
				this.isplayrotate = false;
				// #endif
				// 如果是播放状态就开始播放
				if(this.bgAudioMannager.paused){
					this.bgAudioMannager.play();
				}else{ // 否则暂停播放
					this.bgAudioMannager.pause();
				}
				// this.playicon = 'icon-bofang';
				// 监听播放状态事件
				this.bgAudioMannager.onPlay(()=>{
					this.playicon = 'icon-suspend_icon';
					this.isplayrotate = true;
				});
				// 监听暂停状态事件
				this.bgAudioMannager.onPause(()=>{
					this.playicon = 'icon-bofang';
					this.isplayrotate = false;
				});
				// 监听上一首歌播放完毕，自动播放下一首歌
				this.bgAudioMannager.onEnded(()=>{
					this.playMusic(this.$store.state.nextId);
				});
				// onEnded 播放事件结束,
				// this.bgAudioMannager.onended(() =>{
				// 	this.getData(this.vuex_nextId)
				// })
			},
			// // 下一首 按钮
			// playNext(){
			// 	console.log('切换下一首...');
			// 	this.playMusic(this.vuex_nextId)
			// }
		},
		
	}
</script>

<style lang="scss" scoped>
.container { position: fixed; bottom: 0; left: 0; width: 100%; height: 98rpx; background: #FFFFFF; box-shadow: 0 2rpx 40rpx 0 rgba(0, 0, 0, 0.18); display: flex; justify-content: space-around; align-items: center; z-index: 9999;
	/*旋转图片*/
	image{ width: 58px;height: 58px;left: 0;top: 0;right: 345px;bottom: 0;margin: auto;position: fixed;margin-bottom: 0px;border-radius: 50%;animation: 10s linear infinite move;animation-play-state: paused; }
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
		.player-controls-button1{ font-size:35px; color: #dd001b;}
		/*下一首*/
		.player-controls-button2{ font-size:34px; margin-left:15px; color: #dd001b; }
		/*列表播放*/
		.player-controls-button3{ font-size:35px; margin-left:15px; margin-right: 10px; color: #dd001b;}
	}
}
</style> 
