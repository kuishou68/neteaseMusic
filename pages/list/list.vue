<template>
	<view class="list">
		<view class="fixbg" :style="{backgroundImage:'url('+ playlist.coverImgUrl +')'}"></view>
		<musichead title="歌单" :icon="true" color="white"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playlist.coverImgUrl" mode=""></image>
						<!--浏览次数-->
						<text class="iconfont icon-yousanjiao">{{ playlist.playCount | formatCount }}</text>
					</view>
					<view class="list-head-text">
						<view>{{ playlist.name }}</view>
						<!--网易云logo-->
						<view>
							<image :src="playlist.creator.avatarUrl" mode=""></image>
							<text>{{ playlist.creator.nickname }}</text>
						</view>
						<view>{{ playlist.description }}</view>
					</view>
				</view>
				<!--差异化对待，只有微信能识别这个标签-->
				<!-- #ifdef MP-WEIXIN -->
				<button v-show="isShow" class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				</button>
				<!--#endif -->
				<view class="list-music">
					<view v-show="isShow" class="list-music-title">
						<!-- 🔔播放全部还未实现循环播放歌单🔔 -->
						<text class="iconfont icon-arrow-" ></text>
						<text>播放全部</text>
						<text>(共{{ playlist.trackCount }}首)</text>
					</view>
					<view class="list-music-item" v-for="(item,index) in playlist.tracks" :key="item.id" @tap="handleToDetail(item.id)">
						<view class="list-music-top">{{ index + 1 }}</view>
						<view class="list-music-song">
							<view>{{ item.name }}</view>
							<view>
								<!--图标过滤-->
								<image v-if=" privileges[index].flag > 60 && privileges[index].flag < 70" src="../../static/dujia.png" mode=""></image>
								<image v-if="privileges[index].maxbr == 999000" src="../../static/sq.png" mode=""></image>
								{{ item.ar[0].name }} - {{ item.name }}
							</view>
						</view>
						<!--播放按钮-->
						<text class="iconfont icon-bofang"></text>
					</view>
				</view>
			</scroll-view>
		</view>
		<!--底部全局状态播放栏-->
		<!-- <Footer  ></Footer> -->
	</view>
</template>

<script>
	// 引入返回上一级、返回首页 头部组件
	import musichead from '../../components/musichead/musichead.vue'
	// 引入css绝对路径
	import '../../common/iconfont.css'
	// 引入 歌曲列表接口
	import { list , songDetail , songUrl } from '../../common/api.js'
	// 引入底部组件
	//import Footer from '../../components/song-footer/song-footer.vue'
	export default {
		data() {
			return {
				// 榜单背景图
				playlist : {
					coverImgUrl : '',
					trackCount : '',
					creator : ''
				},
				privileges : [],
				isShow : false,
				// 底部播放栏
				// songDetail : {
				// 	al : { picUrl : '' },
				// 	ar : { name : '' },
				// }
			}
		},
		// 注册局部组件
		components: {
			musichead,
			// Footer
		},
		// list接口是在onLoad()当中调用的,接收上一个页面传递过来的ID
		onLoad(playlist){
			// console.log(playlist);
			// 修改前
			// let listId = options.listId;
			// 修改后，修改 options 为 playlist ，之前的idx是在options，现在榜单的id在playlist下
			let listId = playlist.id;
			// console.log(listId); // 打印传递过来的id
			// 返回歌曲列表
			list(listId).then((res)=>{
				// 打印接口信息
				// console.log(res);
				// 判断接口状态
				if(res[1].data.code == '200'){
					this.playlist = res[1].data.playlist;
					this.privileges = res[1].data.privileges;
					// 向Vuex中INIT_CHANGE方法提交点击之后歌曲ID
					this.$store.commit('INIT_CHANGE',this.playlist.trackIds);
					this.isShow = true;
				}
			});

		},
		// 播放接口，点击之后传递songId出去
		methods: {
			handleToDetail(id){
				// 传递ID 的同时播放音乐
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + id
				});
			},
			
		}
	}
</script>

<style scoped>
	/*头部背景*/
	.list-head{ display: flex; margin:30rpx;}
	.list-head-img{ width:265rpx; height:265rpx; border-radius: 15rpx; margin-right:40rpx; overflow: hidden; position: relative;}
	.list-head-img image{ width:100%; height:100%;}
	.list-head-img text{ position: absolute; font-size:26rpx; color:white; right:8rpx; top:8rpx;}
	.list-head-text{ flex:1; font-size:24rpx; color:#c3d1e3;}
	.list-head-text image{ width:52rpx; height:52rpx; border-radius: 50%;}
	.list-head-text view:nth-child(1){ font-size:34rpx; color:#ffffff;}
	.list-head-text view:nth-child(2){ display: flex; align-items: center; margin:30rpx 0;}
	.list-head-text view:nth-child(2) text{ margin-left: 15rpx;}
	.list-head-text view:nth-child(3){ line-height: 38rpx;}
	/*分享音乐*/
	.list-share{ width:330rpx; height:72rpx; margin:0 auto; background:rgba(0,0,0,0.4); text-align: center; line-height: 72rpx; font-size:26rpx; color:white; border-radius: 36rpx;}
	.list-share text{ margin-right:15rpx;}
	/*歌单*/
	.list-music{ background:white; border-radius: 50rpx; overflow: hidden; margin-top:45rpx;}	
	.list-music-title{ height:58rpx; line-height: 58rpx; margin:30rpx 30rpx 70rpx 30rpx;}
	.list-music-title text:nth-child(1){ font-size:58rpx;}
	.list-music-title text:nth-child(2){ font-size:34rpx; margin:0 10rpx 0 25rpx;}
	.list-music-title text:nth-child(3){ font-size:28rpx; color:#b2b2b2;}
	.list-music-item{ display: flex; margin:0 30rpx 70rpx 44rpx; align-items: center;}
	.list-music-top{ width:56rpx; font-size:28rpx; color:#979797;}
	.list-music-song{ flex:1; line-height: 40rpx;}
	.list-music-song view:nth-child(1){ font-size:30rpx; width:70vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
	.list-music-song view:nth-child(2){ font-size:22rpx; color:#a2a2a2; width:70vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
	.list-music-song image{ width:34rpx; height:22rpx; margin-right:10rpx;}
	.list-music-item text{ font-size:50rpx; color:#c8c8c8;}
</style>
