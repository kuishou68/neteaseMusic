<template>
	<view class="detail">
		<view 
			class="fixbg" 
			:style="{ 'background-image' : 'url('+ songDetail.al.+picUrl+')'}"
			>
		</view>
		<musichesd tite="歌单" :icon="true" color="white"></musichesd>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<!--播放转盘-->
				<view class="detail-play" @tap="handleToPlay">
					<image 
						:src="songDetail.al.picUrl" 
						:class="{ 'detail-play-run' : isPlayRotate}" 
						mode=""
						>
					</image>
					<text class="iconfont" :class="iconPlay" ></text>
					<view></view>
				</view>
				<!--歌词-->
				<view class="detail-lyric" :style="{transform : 'translateY('+ - (lyricIndex - 1)*82 +'rpx)'}">
					<view class="detail-lyric-item">
						<view 
							class="detail-lyric-item" 
							:class="{ active : lyricIndex == index }" 
							v-for="(item, index) in songLyric" 
							:key="index"
							>{{ item.lyric }}
						</view>
						
					</view>
				</view>
				<!--喜欢这首歌的人也听-->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<view 
						class="detail-like-item" 
						v-for="(item, index) in songSimi"
						:key="index"
						@tap="handleToSimi(item.id)"
						>
						<view class="detail-like-img">
							<image :src="item.album.picUrl"></image>
						</view>
						<view class="detail-like-song">
							<view>{{ item.name }}</view>
							<view>
								<image :src="item.privilege.flag"></image>
								<image :src="item.privilege.maxbr == 999000"></image>
								{{ item.album.artista[0].name }} - {{ item.name }}
							</view>
						</view>
						<text class="iconfont iconbofang"></text>
					</view>
				</view>
				<!--评论-->
				<view class="detail-comment">
					<view class="detail-comment-head">精彩评论</view>
					<view class="detail-comment-item" v-for="(item, index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{ item.user.nickname }}</view>
									<view>{{ item.time | formatTime}}</view>
								</view>
								<view class="detail-comment-like">
									{{ item.likedCount }}
									<text class="iconfont iconlike"></text>
								</view>
							</view>
							<view class="detail-comment-text">{{ item.content | formatTime}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 引入css绝对路径
	import '@/common/iconfont.css'
	// 引入组件
	import musichead from '../../components/musichead/musichead.vue'
	// 
	import { songDetail, songSimi, songComment, songLyric, songUrl } from '../../common/api.js'
	export default {
		data() {
			return {
				songDetail : {
					al : {
						picUrl : '',
					}
				},
				songSimi : [],
				songComment : [],
				songLyric : [],
				lyricIndex : 0,
				iconplay : 'iconpause', // 播放状态
				isPlayRotate : true,    // 暂停状态
				isLoading : true,
			}
		},
		components:{
			musichead
		},
		// 接收传递过来的id
		onLoad(options){
			// console.log(options.songId);
			// 等待加载
			uni.showToast({
				title:'正在加载...'
			})
			this.getMusic(options.songId);
		},
		// 离开当前页面，回到上一级的时候，清除定时器
		onUnload(){
			this.cancelLyricIndex();
			// #ifdef h5
			this.bgAudioMannager.destroy();
			// #endif
		},
		// 回到首页的时候，清除定时器
		onHide(){
			this.cancelLyricIndex();
			// #ifdef h5
			this.bgAudioMannager.destroy();
			// #endif
		},
		methods: {
			getMusic(songId){
				// 通过保留歌曲id方式+1，自动播放下一首歌曲
				this.$store.commit('NEXT_ID',songId);
				
				// 等待加载
				uni.showToast({
					title:'正在加载...'
				});
				this.isLoading = true; 
				// 
				Promise.all([ songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(songId)]).then((res)=>{
					if(res[0][1].data.code == '200){
						this.songDetail = res[0][1].data.songs[0];
					}
					if(res[1][1].data.code == '200){
						this.songSimi = res[1][1].data.songs;
					}
					if(res[2][1].data.code == '200){
						this.songDetail = res[2][1].data.hotComments;
					}
					// 歌词
					if(res[3][1].data.code == '200){
						// 先拿到歌词
						let lyric = res[3][1].data.lrc.lyric;
						// 正则表达式分隔歌词
						let re = /\[([^\]]+)\]([^\[]+)/g;
						// 歌词停留的时间
						var result = [];
						lyric.replace(re, function($0,$1,$2){
							result.push({ "time" : formatTimeToSec($1), "lyric" : $2 });
						});
						// 进行映射
						this.songLyric = result;
					}
					// 获取音频地址
					if( res[4][1].data.code == '200'){
						// 创建背景音频播放管理 实例
						// #ifdef MP-WEIXIN					
						this.bgAudioMannager = uni.getBackgroundAudioManager();
						this.bgAudioMannager.title = this.songDetail.name;
						// #endif 
						
						// #ifdef H5
						if(this.bgAudioMannager){
							this.bgAudioMannager = uni.createInnerAudioContext();
						}
						this.iconPlay = 'iconbofang1';
						this.isPlayRotate = false;
						// #endif
						
						this.bgAudioMannager.src = res[4][1].data.data[0].url || '';
						this.listenLyricIndex();
						// 监听播放状态事件
						this.bgAudioMannager.onPlay(()=>{
							this.iconplay = 'iconpause';
							this.isPlayRotate = true;
							this.listenLyricIndex();
						});
						// 监听暂停状态事件
						this.bgAudioMannager.onPause(()){
							this.iconplay = 'iconbofang1';
							this.isPlayRotate = false;
							this.cancelLyricIndex();
						});
						// 监听上一首歌播放完毕，自动播放下一首歌
						this.bgAudioMannager.onEnded(()=>{
							this.getMusic(this.$store.state.nextId);
						});
					}
					// 整个加载完成之后
					this.isLoading = false;
					uni.hideLoading();
				});
			},
			// 转化成秒
			formatTimeToSec(){
				// 分钟和秒分隔开后存放到数组中
				let arr = value.split(':');				
				// 先把数字进行操作，再进行toFixed转换，最后返回转换成秒的结果
				return (Number(arr[0]*60) + Number(arr[1])).toFixed(1);
			},
			// 监听点击播放
			handleToPlay(){
				// 如果是播放状态就开始播放
				if(this.bgAudioMannager.paused){
					this.bgAudioMannager.play();
				}else{  // 否则暂停播放
					this.bgAudioMannager.pause();
				}
			},
			//  利用节流实现监听事件慢加载
			this.listenLyricIndex(){
				clearInterval(this.tmer);
				// 监听歌词的变化,500毫秒监听一次
				this.timer = setInterval(()=>{
					 // 歌词遍历
					 for(var i=0;i<this.songLyric.length;i++){
						 // 播放时间小于最后一条歌词的时候
						 if(this.bgAudioMannager.currentTime > this.songLyic[this.songLyric.length-1]){
							 this.lyricIndex = this.songLyric.length-1;
							 break;
						 }
						 // 播放时间小于上一条歌词
						 if(this.bgAudioMannager.currentTime > this.songLyric[i].time && this.bgAudioMannager.currentTime > this.songLyric[i+1].time){
							 this.lyricIndex = i;
						 }
						 
					 } 
				},500);
			},
			// 优化性能，防止暂停的时候定时器继续，影响性能
			cancelLyricIndex(){
				clearInterval(this.timer);
			},
			// 跳转切换歌曲，拿到handleToSimi.id 更新整个数据
			handleToSimi(songId){
				this.getMusic(songId);
			}
		}
	}
</script>

<style>
	/*播放转盘*/
	.detail-play{ width:580rpx; height:580rpx; background:url(~@/static/disc.png); background-size:cover; margin:210rpx auto 44rpx auto; position: relative;}
	.detail-play image{ width:380rpx; height:380rpx; border-radius: 50%; position: absolute; left:0; top:0; right:0; bottom:0; margin:auto; animation:10s linear infinite move; animation-play-state: paused;}
	/*图片旋转*/
	@keyframes move{
		from{ transform : rotate(0deg);}
		to{ transform : rotate(360deg);}
	}
	.detail-play .detail-play-run{ animation-play-state: running;}
	.detail-play text{ width:100rpx; height:100rpx; font-size:100rpx; position: absolute; left:0; top:0; right:0; bottom:0; margin:auto; color:white;}
	.detail-play view{ position: absolute; width:170rpx; height:266rpx; position: absolute; left:60rpx; right:0;  margin:auto; top:-170rpx; background:url(~@/static/needle.png); background-size:cover;}
	/*歌词*/
	.detail-lyric{ height:246rpx; line-height: 82rpx; font-size:32rpx; text-align: center; color:#949495; overflow: hidden;}
	.active{ color:white;}
	.detail-lyric-wrap{ transition: .5s;} 
	.detail-lyric-item{ height:82rpx;}
	/**/
	.detail-like{ margin:0 32rpx;}
	.detail-like-title{ font-size:36rpx; color:white; margin:50rpx 0;}
	.detail-like-list{}
	.detail-like-item{ display: flex; margin-bottom:38rpx; align-items: center;}
	.detail-like-img{ width:82rpx; height:82rpx; border-radius: 15rpx; overflow: hidden; margin-right:20rpx;}
	.detail-like-img image{ width:100%; height:100%;}
	.detail-like-song{ flex:1;}
	.detail-like-song view:nth-child(1){ color:white; font-size:30rpx; width:70vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 10rpx;}
	.detail-like-song view:nth-child(2){ font-size:22rpx; color:#a2a2a2; width:70vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
	.detail-like-song image{ width:34rpx; height:22rpx; margin-right:10rpx;}
	.detail-like-item text{ font-size:50rpx; color:#877764;}
	
	.detail-comment{ margin:0 32rpx;}
	.detail-comment-title{ font-size:36rpx; color:white; margin:50rpx 0;}
	.detail-comment-item{ display: flex; margin-bottom:28rpx;}
	.detail-comment-img{ width:66rpx; height:66rpx; border-radius: 50%; overflow: hidden; margin-right:18rpx;}
	.detail-comment-img image{ width:100%; height:100%}
	.detail-comment-content{ flex:1; color:#cac9cd;}
	.detail-comment-head{ display: flex; justify-content: space-between;}
	.detail-comment-name view:nth-child(1){ font-size:24rpx;}
	.detail-comment-name view:nth-child(2){ font-size:20rpx;}
	.detail-comment-like{ font-size:30rpx;}
	.detail-comment-text{ line-height: 40rpx; color:white; font-size:28rpx; margin-top:16rpx; border-bottom:1px #595860 solid; padding-bottom: 40rpx;}
	
</style>
