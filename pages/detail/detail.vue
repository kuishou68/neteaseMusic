<template>
	<view class="detail">
		<view class="fixbg" :style="{backgroundImage:'url('+ songDetail.al.picUrl +')'}"></view>
		<musichead  :title="songDetail.name" :icon="true" color="white"></musichead>
		<view class="ios-safe-area" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<!--播放转盘-->
				<view class="detail-play" @tap="handleToPlay">
					<!--网易云logo-->
					<view>
						<image src="../../static/logo.png" mode=""></image>
					</view>
					<!--播放旋转臂-->
					<view></view>
					<!--播放旋转图片、播放按钮-->
					<view>
						<image :src="songDetail.al.picUrl" :class="{ 'detail-play-run' : isplayrotate }" style="border-radius: 50%;" mode=""></image>
						<text class="iconfont" :class="playicon"></text>
					</view>
				</view>
				<!--歌词-->
				<view class="detail-lyric">
					<!--transform传递向Y轴滚动的位置，值为一个行高82rpx-->
					<view class="detail-lyric-wrap" :style="{ transform : 'translateY(' +  - (lyricIndex - 1) * 82  + 'rpx)' }">
						<view 
							class="detail-lyric-item" 
							:class="{ active : lyricIndex == index}" 
							v-for="(item,index) in songLyric" 
							:key="index"
							>{{ item.lyric }}
						</view>
					</view>
				</view>
				<!--喜欢这首歌的人也听-->
				<view class="detail-like">
					<view class="detail-like-title">喜欢这首歌的人也听</view>
					<view class="detail-like-list">
						<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
							<view class="detail-like-img"><image :src="item.album.picUrl" mode=""></image></view>
							<view class="detail-like-song">
								<view>{{item.name}}</view>
								<view>
									<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70" src="../../static/dujia.png" mode=""></image>
									<image v-if="item.privilege.maxbr == 999000" src="../../static/sq.png" mode=""></image>
									{{item.artists[0].name}} - {{item.name}}
								</view>
							</view>
							<!--播放按钮-->
							<text class="iconfont icon-bofang"></text>
						</view>
					</view>
				</view>
				<!--评论-->
				<view class="detail-comment">
					<view class="detail-comment-title">精彩评论</view>
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<view class="detail-comment-img">
							<!--评论用户头像-->
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-head">
								<view class="detail-comment-name">
									<view>{{ item.user.nickname }}</view>
									<view>{{ item.time | formatTime }}</view>
								</view>
								<view class="detail-comment-like">
									{{ item.likedCount | formatCount }} <text class="iconfont icon-dianzan"></text>
								</view>
							</view>
							<view class="detail-comment-text">
								{{ item.content }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!--底部全局状态播放栏-->
		<!-- <Footer :src="songDetail.al.picUrl"  :title="songDetail.name" :singer="songDetail.ar[0].name" ></Footer> -->
		<view class="container ios-safe-area">
			<!--底部播放栏-->
			<image :src="songDetail.al.picUrl" :class="{ 'detail-play-run' : isplayrotate }" mode=""></image>
			<view class="player-info">
				<text class="player-info-title" >{{ songDetail.name }}</text><br/>
				<text class="player-info-singer" >{{ songDetail.ar[0].name }}</text>
			</view>
			<!--右边按钮-->
			<view class="player-controls" >
				<!--播放按钮-->
				<text class="player-controls-button1 iconfont icon-bofang" :class="playicon" @click="handleToPlay"></text>
				<!--下一首-->
				<text class="player-controls-button2 iconfont icon-kuaijin" @click="playNext()"></text>
				<!--列表播放-->
				<text class="player-controls-button3 iconfont icon-list" ></text>
			</view>
		</view>
	</view>
</template>

<script>
	// 引入返回上一级、返回首页 头部组件
	import musichead from '../../components/musichead/musichead.vue'
	// 引入css绝对路径
	import '../../common/iconfont.css'
	// 引入API
	import { songDetail , songUrl , songLyric , songSimi , songComment  } from '../../common/api.js';
	// 引入底部组件
	// import Footer from '../../components/song-footer/song-footer.vue'
	export default {
		data() {
			return {
				songDetail : {
					al : { picUrl : '' },
					ar : { name : '' }
				},
				songSimi : [],
				songComment : [],
				songLyric : [],	// 歌词转换成秒的时间点数组
				lyricIndex : 0,	// 歌词选中状态
				playicon : 'icon-suspend_icon',// 播放状态，默认开启播放
				isplayrotate : true,// 暂停状态
				isLoading : true, // 加载状态
			}
		},
		// 接收传递过来的歌曲id
		onLoad(options){
			// 等待加载
			uni.showToast({
				title:'正在加载...'
			})
			this.playMusic(options.songId);
		},
		// 离开当前页面，回到上一级的时候，清除定时器
		onUnload(){
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioMannager.destroy();
			// #endif
		},
		// 回到首页的时候，清除定时器
		onHide(){
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioMannager.destroy(); 
			// #endif
		},
		methods: {
			playMusic(songId){
				// 通过保留歌曲id方式+1，得到下一首歌曲ID
				this.$store.commit('NEXT_ID',songId);
				// 等待加载
				uni.showToast({
					title:'正在加载...'
				});
				this.isLoading = true; 
				// 判断每个接口的状态是否正常
				Promise.all([songDetail(songId),songSimi(songId),songComment(songId),songLyric(songId),songUrl(songId)]).then((res)=>{
					if(res[0][1].data.code == '200'){
						this.songDetail = res[0][1].data.songs[0];
					}
					if( res[1][1].data.code == '200' ){
						this.songSimi = res[1][1].data.songs;
					}
					if( res[2][1].data.code == '200' ){
						this.songComment = res[2][1].data.hotComments;
					}
					// 歌词
					if(res[3][1].data.code == '200'){
						// 先拿到歌词
						let lyric = res[3][1].data.lrc.lyric;
						// 歌词停留的时间
						let result = [];
						// 正则表达式分隔歌词
						let re = /\[([^\]]+)\]([^[]+)/g;
						// $0是正则第一个小括号中的结果，$1是正则第二个小括号的结果，$2是歌词
						lyric.replace(re,($0,$1,$2)=>{
							// 存放到数组中
							result.push({ time : this.formatTimeToSec($1) , lyric : $2 });
						});
						// 进行映射
						this.songLyric = result;
					}
					// 获取音频地址
					if(res[4][1].data.code == '200'){
						// console.log(res)
						// 把歌曲信息 commit 到 stor.js 中
						// this.@store.commit('setPlayList', res)
						// 创建背景音频播放管理 实例
						// #ifdef MP-WEIXIN
						this.bgAudioMannager = uni.getBackgroundAudioManager();
						this.bgAudioMannager.title = this.songDetail.name;
						// #endif
						// #ifdef H5
						if(!this.bgAudioMannager){
							// 创建并返回内部 audio 上下文 innerAudioContext 对象
							this.bgAudioMannager = uni.createInnerAudioContext();
						}
						this.playicon = 'icon-bofang';
						this.isplayrotate = false;
						// #endif
						this.bgAudioMannager.src = res[4][1].data.data[0].url;
						this.listenLyricIndex();
						// 监听播放状态事件
						this.bgAudioMannager.onPlay(()=>{
							this.playicon = 'icon-suspend_icon';
							this.isplayrotate = true;
							this.listenLyricIndex();
						});
						// 监听暂停状态事件
						this.bgAudioMannager.onPause(()=>{
							this.playicon = 'icon-bofang';
							this.isplayrotate = false;
							this.cancelLyricIndex();
						});
						// 监听上一首歌播放完毕之后，调用playMusic(从Vuex中取出来的ID)
						this.bgAudioMannager.onEnded(()=>{
							this.playMusic(this.$store.state.nextId);
							console.log('即将自动播放下一首');
						});
					}
					// 整个加载完成之后
					this.isLoading = false;
					// 隐藏 loading 提示框
					uni.hideLoading();
				});
			},
			// 转化成秒的方法
			formatTimeToSec(time){
				// 分钟和秒分隔开后存放到数组中
				var arr = time.split(':');
				// 先把数字进行操作，再进行toFixed转换，最后返回转换成秒的结果
				return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
			},
			// 监听点击播放
			handleToPlay(){
				// 如果是播放状态就开始播放
				if(this.bgAudioMannager.paused){
					this.bgAudioMannager.play();
				}else{ // 否则暂停播放
					this.bgAudioMannager.pause();
				}
			},
			//  利用节流实现监听事件慢加载
			listenLyricIndex(){
				clearInterval(this.timer);
				// 监听歌词的变化,500毫秒监听一次
				this.timer = setInterval(()=>{
					// 歌词遍历
					for(var i=0;i<this.songLyric.length;i++){
						// 播放时间小于最后一条歌词的时候
						if( this.songLyric[this.songLyric.length-1].time < this.bgAudioMannager.currentTime ){
							this.lyricIndex = this.songLyric.length-1;
							break;
						}
						 // 播放时间小于上一条歌词
						if( this.songLyric[i].time < this.bgAudioMannager.currentTime && this.songLyric[i+1].time > this.bgAudioMannager.currentTime ){
							this.lyricIndex = i;
						}
					}
				});
			},
			// 优化性能，防止暂停的时候定时器继续，影响性能
			cancelLyricIndex(){
				clearInterval(this.timer);
			},
			// 跳转切换歌曲，拿到handleToSimi.id 更新整个数据
			handleToSimi(songId){
				this.playMusic(songId);
			},
			// 手动点击 下一首 按钮
			playNext(){
				console.log('切换下一首...');
				var nextId = this.$store.state.nextId
				console.log(this.$store)
				this.playMusic(nextId);
			}
		}
	}
</script>

<style scoped>
	/*歌词名 超出部分隐藏*/
	.detail-title{overflow: hidden; text-overflow: ellipsis;}
	
	.detail-play{ width:580rpx; height:580rpx; background:url(~@/static/disc.png); background-size:cover; margin:210rpx auto 44rpx auto; position: relative;}
	
	/*网易云logo*/
	.detail-play view:nth-child(1){position: absolute;width:240rpx; height:40rpx; align-items: center; margin-top: -180rpx;}
	.detail-play view:nth-child(1) image{width:80%; height:100%; margin-left: -60rpx;}
	/*旋转臂*/
	.detail-play view:nth-child(2){ position: absolute; width:170rpx; height:266rpx; position: absolute; left:60rpx; right:0;  margin:auto; top:-170rpx; background:url(~@/static/needle.png); background-size:cover;}
	/*播放旋转图片、播放按钮*/
	.detail-play .detail-play-run{ animation-play-state: running;}
	.detail-play image{ width:380rpx; height:380rpx;  position: absolute; left:0; top:0; right:0; bottom:0; margin:auto; animation:10s linear infinite move; animation-play-state: paused;}
	.detail-play view:nth-child(3) text{ width:100rpx; height:100rpx; font-size:100rpx; position: absolute; left:0; top:0; right:0; bottom:0; margin:auto; color:white;}
	@keyframes move{
		from{ transform : rotate(0deg);}
		to{ transform : rotate(360deg);}
	}
	
	.detail-lyric{ height:246rpx; line-height: 82rpx; font-size:32rpx; text-align: center; color:#949495; overflow: hidden;}
	.active{ color:white;}
	.detail-lyric-wrap{ transition: .5s;}
	.detail-lyric-item{ height:82rpx;}
	
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
		
	.container { position: fixed; bottom: 0; left: 0; width: 100%; height: 98rpx; background: #FFFFFF; box-shadow: 0 2rpx 40rpx 0 rgba(0, 0, 0, 0.18); display: flex; justify-content: space-around; align-items: center; z-index: 9999;}
	.container image{ width: 58px;height: 58px;left: 0;top: 0;right: 345px;bottom: 0;margin: auto;position: fixed;margin-bottom: 0px;border-radius: 50%;animation: 10s linear infinite move;animation-play-state: paused; }
	.container .detail-play-run{ animation-play-state: running;}
	@keyframes move{
		from{ transform : rotate(0deg);}
		to{ transform : rotate(360deg);}
	}
	/*歌曲信息*/
	.container .player-info{flex: 1; font-size: 10pt; line-height: 38rpx; margin-left: 127rpx; padding-bottom: 8rpx;
		/*歌名超出部分隐藏并用省略号显示*/
		overflow: hidden;//超出部分隐藏
		text-overflow: ellipsis;//溢出用省略号显示
		white-space: nowrap;//溢出不换行
	}
	/*歌手名*/
	.container .player-info .player-info-singer{ color: #888; }
	/*播放按钮*/
	.container .player-controls .player-controls-button1{ font-size:35px; color: #dd001b;}
		/*下一首*/
	.container .player-controls .player-controls-button2{ font-size:34px; margin-left:15px; color: #dd001b; }
		/*列表播放*/
	.container .player-controls .player-controls-button3{ font-size:35px; margin-left:15px; margin-right: 10px; color: #dd001b;}
</style>
