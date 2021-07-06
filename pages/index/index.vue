<template>
	<view class="index">
		<musichead title="网易云音乐" :icon="false"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!--登录-->
				<view class="index-login">
					<text class="index-login-img iconfont icon-yonghu"></text>
					<text class="idnex-login-text">未登录</text>
					<button type="sumbit" plain="true" size="mini" >立即登录</button>
				</view>
				<!--搜索栏-->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-Magnifier"></text>
					<input type="text" value="" placeholder="搜索歌曲" />
				</view>
				<!--骨架屏-->
				<view class="skeleton" v-if="loading">
					<m-for-skeleton
					:avatarSize="200"
					:row="3"
					:title="false"
					:loading="loading"
					isarc="square"
					:titleStyle="{}"
					v-for="(item,key) in 4"
					:key="key">
					</m-for-skeleton>
				</view>
				<!--歌曲分类-->
				<view v-else class="index-list">
					<view class="index-list-item" v-for="(item,index) in topList" :key="index" @tap="handleToList(item.listId)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{ item.updateFrequency }}</text>
						</view>
						<view class="index-list-text">
							<view v-for="(item ,index) in item.tracks" :key="index">{{ index + 1 }}.{{item.first}} - {{item.second}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!--底部全局状态播放栏-->
		<!-- <Footer ></Footer> -->
	</view>
</template>

<script>
	// 引入返回上一级、返回首页 头部组件
	import musichead from '../../components/musichead/musichead.vue'
	// 引入底部导航栏 
	import Footer  from 'components/song-footer/song-footer.vue'
	// 引入css绝对路径
	import '../../common/iconfont.css'
	// 引入接口
	import { topList } from '../../common/api.js'
	// 导入循环骨架屏
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton"
	export default {
		data() {
			return {
				topList : [],
				loading: true,
				// 底部导航
				barList:[{
				    "pagePath": "pages/index/index",
				    "iconPath": "static/shouy1@2x.png",
				    "selectedIconPath": "static/shouy2@2x.png",
				    "text": "首页"
				},
				{
				    "pagePath": "pages/user/user",
				    "iconPath": "static/wd1@2x.png",
				    "selectedIconPath": "static/wd2@2x.png",
				    "text": "我的"
				}],
			};
		},
		// 局部组件
		components: {
			musichead,
			mForSkeleton,
			Footer
		},
		// 等整个页面加载完之后触发的
		onLoad() {
			topList().then((res)=>{
				if(res.length){
					setTimeout(()=>{
						this.topList = res;
						this.loading = false;
					},2000);
				}
			});
		},
		methods: {
			// 调转到list.vue播放页面
			handleToList(listId){
				uni.navigateTo({
					url: '/pages/list/list?id=' + listId
				});
			},
			// 搜索歌曲
			handleToSearch(){
				uni.navigateTo({
					url: '/pages/search/search'
				});
			}
		}
	}
</script>

<style>
	/*登录*/
	.index-login{ margin: auto; width:379px; }
	.index-login-img{ font-size:34px; vertical-align: middle; color:#dddddd;}
	.idnex-login-text{ font-size:14px; margin-left: 10px; color:#888; }
	.index-login button{ float:right; border:1px #dddddd solid; border-radius: 30px; }
	/*搜索栏*/
	.index-search{ display: flex; background:#f7f7f7; height:73rpx; margin:30rpx; border-radius: 50rpx; align-items: center;}
	.index-search text{ margin:0 27rpx;} 
	.index-search input{ font-size:26rpx; flex:1;}
	/*歌曲分类*/
	.index-list{ margin:0 30rpx;}
	.index-list-item{ display: flex; margin-bottom: 35rpx;}
	.index-list-img{ width:212rpx; height:212rpx; margin-right:20rpx; border-radius: 15rpx; overflow: hidden; position: relative;}
	.index-list-img image{ width:100%; height:100%;}
	.index-list-img text{ position: absolute; font-size:22rpx; color:white; bottom: 15rpx; left:15rpx;}
	.index-list-text{ flex:1; font-size:24rpx; line-height: 68rpx;}
</style>
