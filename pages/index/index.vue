<template>
	<view class="index">
		<musichead title="网易云音乐" :icon="false"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!--登录-->
				<view class="index-login">
					<!--icon-yonghu-->
					<text class="index-login-img iconfont icon-yonghu" :src="userInfo.avatarUrl || '../static/wangyiyunyinyue.png'"></text>
					<text class="idnex-login-text" @click="toLogin">{{ hasLogin ? userInfo.nickName || '未设置昵称' : '立即登录' }}</text>
					<!--#ifdef MP-WEIXIN-->
						<!--使用button登录授权登录必备参数 open-type="getUserInfo"-->
					<button type="sumbit" plain="true" size="mini" open-type="getUserInfo" @getuserinfo="getuserinfo" withCredentials="true">立即登录</button>
					<!-- <button class="confirm-btn" open-type="getUserInfo" @getuserinfo="wxLogin" :disabled="logining">微信授权登录</button> -->
					
					<!--#endif-->
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
	// 引入vuex
	import { mapState } from 'vuex';

	export default {
		data() {
			return {
				topList : [],
				loading: true,
				// 微信登录信息
				// appid : 'wx5635f2f0e6d49c80',
				// secret : '2a08bf4ccc5e158234de59a0a300dda4',
				// code : ''
			};
		},
		// 局部组件
		components: {
			musichead,
			mForSkeleton
		},
		// 等整个页面加载完之后触发的
		onLoad() {
			// 登录
			// _self = this,
			// // 验证登录
			// wx.getSetting({
			// 	success(res){
			// 		if(res.authSetting['scope.userInfo']){
			// 			console.log('登录成功！');
			// 		}else{
			// 			console.log('未登录！');
			// 		}
			// 	}
			// });
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
		computed: {
		       ...mapState(['hasLogin', 'userInfo'])
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
			},
			toLogin() {
			            if (!this.hasLogin) {
			                uni.navigateTo({
			                    url: 'pages/login/login'
			                });
			            }
			        }
			// 登录  
			// getuserinfo : function(res1){
			//    console.log(res1);
			  //  console.log(res1.detail.userInfo.avatarUrl);
			  //  console.log(res1.detail.userInfo.nickName);
			  //  //如果只需要opendid 和非加密数据至此登录完成
			  //  //此处连接数据库利用openid 就可以进行登录环节
			  //  wx.login({
			  //   success:function(res2){
			  //    //获取 sessionKey
			  //    wx.request({
				 //  url : 'https:///hoa.hcoder.net/xcxencode/?c=sk&appid=wxbb7f9f1f2c6f4f33&secret=739b970b832f0df158f54c494a08e440&code='+res2.code,
			  //     // url : 'https:///hoa.hcoder.net/xcxencode/?c=sk&appid='+ this.appid +'&secret='+ this.secret +'&code='+this.code,
			  //     success:function(res3){
			  //      console.log(res3);
				 
			  //      // sk和openid 信息记录到本地
			  //      try{
			  //       uni.setStorageSync('sk', res3.data.session_key);
			  //       uni.setStorageSync('openid', res3.data.openid);
			  //      }catch(e){
			  //       //TODO handle the exception
			  //      }
				 
			       // uni.hideLoading();
			       // //以下步骤可以获取加密信息，需要授权
			       // //获取加密信息
			       // if(!res1.detail.iv){
			       //  uni.showToast({
			       //   title:"您取消了授权,登录失败",
			       //   icon:"none"
			       //  });
			       //  return false;
			       // }
			       // try{
			       //  var sessionKey = uni.getStorageSync('sk');
			       //  console.log(sessionKey);
			       // }catch(e){
			       //  //TODO handle the exception
			       // }
			       // uni.request({
			       //  method : "POST",
			       //  url : 'https:///hoa.hcoder.net/xcxencode/',
			       //  header : {'content-type':'application/x-www-form-urlencoded'},
			       //  data : {
			       //   appid : "wx5635f2f0e6d49c80",
			       //   sessionKey : sessionKey,
			       //   iv : res1.detail.iv,
			       //   encryptedData : res1.detail.encryptedData
			       //  },
			       //  success:function(res4){
			       //   console.log(res4);
			         
			       //  }
			       // });
				   
			  //     }
			  //    })
			  //   }
			  //  });
			  // }
				  
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
