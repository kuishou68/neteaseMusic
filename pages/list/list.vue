<template>
	<view class="list">
		<view class="fixbg"></view>
		<musichesd tite="歌单" :icon="true" color="white"></musichesd>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<view class="list-head-img">
						<image src="../../static/wangyiyunyinyue.png" mode=""></image>
						<text class="iconfont iconyousanjiao">30亿</text>
					</view>
					<view class="list-head-text">
						<view>11111</view>
						<view>
							<image src="../../static/wangyiyunyinyue.png">2222</image>
						</view>
						<view>33333333333333</view>
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

	export default {
		data(){
			return{
				
			}
		},
		// 注册组件
		components:{
			musichead
		},
		onLoad(option){
			console.log(options.listId);
		},
		methods: {
			
		}
	}
</script>
	
<style>
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
	
	.list-share{ width:330rpx; height:72rpx; margin:0 auto; background:rgba(0,0,0,0.4); text-align: center; line-height: 72rpx; font-size:26rpx; color:white; border-radius: 36rpx;}
	.list-share text{ margin-right:15rpx;}
	
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
