<template>
	<view class="index">
		<musichesd title="网易云音乐" :icon="false"></musichesd>
		<view class="container">
			<scroll-view scroll-y="true">
				<!--搜索栏-->
				<view class="index-search">
					<text class="iconfont iconsearch" @tap="handleToSearch"></text>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				<!--骨架屏-->
				<view v-if="isLoading">
					 <m-for-skeleton
							:avatarSize="200"
							:row="3"
							:loading="isLoading"
							isarc="square"
							v-for="(item,key) in 4"
							:titleStyle = "{}"
							:title = 'false'
							:key="key">
					  </m-for-skeleton>
				</view>
				<!--歌曲分类-->
				<view class="index-list" v-else>
					<view class="index-list-item" v-for="(item, index) in topList" :key="index" @tap="handleTopList(item.listId)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl" mode=""></image>
							<text>{{ item.updateFrequerycy }}</text>							
						</view>
						<view class="index-list-text">
							<view v-for="(item, index) in item.tracks" :key="index">{{ index + 1 }}.{{ item.first }} - {{ item.second }}</view>
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
	import musichesd from '../../components/musichead/musichead.vue'
	// 引入接口
	import { topList } from '../../common/api.js'
	// 导入循环骨架屏
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	export default {
		data() {
			return {
				topList:[],
				loading: true
			}
		},
		// 局部组件
		components : {
			musichesd,
			mForSkeleton
		},
		// 等整个页面加载完之后触发的
		onLoad() {
			topList().then((res)=>{
				if(res.length){
					setTimeout(()=>{
						this.topList = res;
						this.loading = false;
					},20000);
				}
			});
		},
		methods: {
			handleTopList(listId){
				uni.navigateTo({
					url: '/pages/list/list?listId=' + listId
				});
			},
			// 搜索
			handleToSearch(){
				uni.navigateTo({
					url:'./pages/search/search'
				})
			}
		}
	}
</script>

<style>
	/*搜索栏*/
	.index{}
	.index-search{display: flex; align-items: center; height:70rpx; margin:70rpx 30rpx 30rpx 30rpx;background:#f7f7f7; border-radius: 50rpx;}
	.index-search texct{ font-size:26rpx; margin-right:26rpx; margin-left:28rpx;}
	.index-search input{ font-size:28rpx; flex:1;}
	/*歌曲分类*/
	.index-list{ margin:0 30rpx;}
	.index-list-item{display: flex;margin-bottom: 34rpx;}
	.index-list-img{ width:212rpx; height: 212rpx; position: relative; border-radius: 30px;overflow:hidden; margin-right: 22rpx;}
	.index-list-img image{width:100%; height:100%;}
	.index-list-img text{ position:absolute; left:12px;bottom: 16rpx; color: white; font-size: 20rpx;}
	.index-list-text{ font-size:24rpx; line-height:66rpx;}
</style>
