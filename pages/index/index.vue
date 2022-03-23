<template>
	<view class="index">
		<musichead title="网易云音乐" :icon="false"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!--登录-->
				<view class="index-login">
					<view class="index-login-left">
						<image class="index-login-left-img" :src="userInfo.avatarUrl"></image>
					</view>
					<text class="idnex-login-text">{{ userInfo.nickName ||  '未登录' }}</text>
					<!--#ifdef MP-WEIXIN-->	
						<button type="sumbit" plain="true" size="mini" open-type="getUserInfo" @tap="login" @click="change" >{{ logState }}</button>
					<!--#endif -->
					<!--#ifdef H5-->
						<button type="sumbit" plain="true" size="mini" open-type="getUserInfo" @tap="handleToLogin" @click="change" >{{ logState }}</button>
					<!--#endif -->
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
				userInfo : {},
				logState : '立即登录'
			};
		},
		// 局部组件
		components: {
			musichead,
			mForSkeleton
		},
		// 等整个页面加载完之后触发的
		onLoad() {
			// 首页内容加载
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
			// 跳转到登录页面
			handleToLogin(){
				console.log('登录页面')
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			// 搜索歌曲
			handleToSearch(){
				uni.navigateTo({
					url: '/pages/search/search'
				});
			},
			// 登录部分
			login(){
				// 获取code 小程序专有，用户登录凭证。
				uni.getUserProfile({
					desc: "获取用户基本资料",
					success : (res)=>{
						this.userInfo = res.userInfo;
					},
					// 用户取消登录后的提示
					fail: (res)=>{
						uni.showModal({
							title:"授权用户信息失败！",
							// 是否显示取消按钮，默认为 true
							showCancel:false
						})
					}
				})
				//获取成功基本资料后开启登录，基本资料首先要授权
				uni.login({
					provider : 'weixin',
					success : (res)=>{
						console.log(res);
						if(res.errMsg == "login:ok"){
							let code =res.code;
							console.log(code);
						}
					}
				})
			},
			// 退出登录
			change(){
				// 这里只是改变了按钮文字内容，真正退出需要清除token，回到首页,还没找到头绪怎么做
				this.logState = '已登录';
				console.log('登录')
			}
		}
	}
</script>

<style>
	/*登录*/
	.index-login{ margin: auto; width:379px; }
	.index-login-left{ width:35px; height:35px;  position: absolute; overflow: hidden; background: url(../../static/user.png); }
	.index-login-left-img{ width:35px; height:35px;  border-radius: 50%; }
	.index-login-img-text{ font-size:34px; color:#dddddd; }
	.idnex-login-text{ font-size:14px; vertical-align: sub; margin-left: 45px; color:#888; }
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
	.index-list-text{ flex:1; font-size:24rpx; line-height: 68rpx; }
	.index-list-text view{ width:60vw; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
