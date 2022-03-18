<template>
	<view class="container bg-main pos-r">
		<view class="padding-xl dflex-c dflex-flow-c">
			<view class="portrait-box margin-bottom">
				<image class="headimg border-radius-c" :src="(member && member.member_headimg) || '/static/images/user/default.png'"></image>
			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconshouji margin-right"></view>
				<view class="flex1 dflex">
					<input class="border-line padding-sm flex1" type="number" data-key="mobile" maxlength="11" :value="mobile" @input="inputChange" placeholder="请输入手机号" />
					<view v-if="0 == 1" class="padding-tb-sm ft-dark" @click="send_code">获取</view>
				</view>
			</view>

			<view class="w-full dflex">
				<view class="iconfont iconmima margin-right"></view>
				<!-- #ifdef MP -->
				<input
					class="border-line padding-sm flex1"
					type="text"
					password
					data-key="password"
					maxlength="20"
					:value="password"
					@input="inputChange"
					@confirm="tologin"
					placeholder="请输入密码"
				/>
				<!-- #endif -->

				<!-- #ifndef MP -->
				<input
					class="border-line padding-sm flex1"
					type="password"
					password
					data-key="password"
					maxlength="20"
					:value="password"
					@input="inputChange"
					@confirm="tologin"
					placeholder="请输入密码"
				/>
				<!-- #endif -->
			</view>
			<view class="dflex-b w-full margin-bottom-sm">
				<view class="padding-tb-sm ft-dark" @click="toforget">忘记密码</view>
				<view class="padding-tb-sm ft-base" @click="toregister">立即注册</view>
			</view>
			<view class="w-full margin-top-xl">
				<view class="dflex-b border-radius-lg"><view class="tac padding-tb-sm flex1 bg-base fs" @click="tologin">登录</view></view>
			</view>
		</view>
		<view v-if="ismp" class="dflex-c margin-top-big">
			<!-- #ifdef MP-WEIXIN -->
			<button class="dflex-c dflex-flow-c no-border btn" lang="zh_CN" @click="mpWeixinTologin">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c fs-sm ft-dark">{{ platform_name }} · 授权登录</view>
			</button>
			<!-- #endif -->
			<!-- #ifdef MP-BAIDU || MP-QQ -->
			<button class="dflex-c dflex-flow-c no-border btn" open-type="getUserInfo" lang="zh_CN" withCredentials="true" @getuserinfo="mpGetUserInfo">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c fs-sm ft-dark">{{ platform_name }} · 授权登录</view>
			</button>
			<!-- #endif -->

			<!-- #ifdef MP-ALIPAY -->
			<view class="dflex-c dflex-flow-c no-border btn" open-type="getAuthorize" scope="userInfo" @click="onGetAuthorize" @error="onAuthError">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c fs-sm ft-dark">{{ platform_name }} · 授权</view>
			</view>
			<!-- #endif -->

			<!-- #ifdef MP-TOUTIAO -->
			<view class="dflex-c dflex-flow-c no-border btn" open-type="getUserInfo" lang="zh_CN" withCredentials="true" @click="getUserInfo">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c ft-dark">{{ platform_name }} · 授权</view>
			</view>
			<!-- #endif -->
		</view>

		<!-- 用云版权 -->
		<use-copyright class="pos-f w-full" style="bottom: -30rpx"></use-copyright>

		<!-- 弹出框 -->
		<view v-if="isshow" class="l-mask"></view>
		<view v-if="isshow" class="box-container">
			<view class="title"><text>授权手机号，同步会员|收货信息</text></view>
			<view class="btn-contaer">
				<button @click="cancel">取消</button>
				<button open-type="getPhoneNumber" @getphonenumber="mpPhoneNumber" withCredentials="true">授权</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	data() {
		return {
			ismp: false,
			platform: '',
			platform_name: '',
			platform_icon: '',

			env: {},
			isshow: false,

			mobile: '',
			password: '',

			authorize: 0
		};
	},
	computed: {
		...mapState(['member'])
	},

	onShow() {
		console.log('login Show');
		// #ifdef MP-WEIXIN
		let lopts = uni.getLaunchOptionsSync();
		console.log(lopts);
		// #endif
		let _this = this;

		uni.getStorage({
			key: '__mobile',
			success(res) {
				_this.mobile = res.data;
			}
		});

		// 查看用户是否已授权获取用户数据
		if (uni.canIUse('getSetting')) {
			uni.getSetting({
				success(res) {
					console.log('getSetting ', res);
					_this.authorize = res.authSetting['scope.userInfo'];
					console.log('getSetting scope.userInfo authorize ', _this.authorize);
				}
			});
		}
	},
	onLoad() {
		let _this = this;

		this.$api.get_env(res => {
			this.env = res;
			console.log('this.env', this.env);
			this.ismp = this.env.is_mp;
			this.platform = this.env.platform;
			this.platform_icon = this.env.platform_icon;
			this.platform_name = this.env.platform_name;
		});
	},
	methods: {
		...mapMutations(['login', 'logout', 'token']),
		openAuthSetting() {
			let _this = this;

			uni.authorize({
				scope: 'scope.userInfo',
				success() {
					console.log('scope.userInfo success');
				},
				fail() {
					uni.getSetting({
						success(res) {
							console.log('getSetting ', res);
							_this.authorize = res.authSetting['scope.userInfo'];
							console.log('getSetting scope.userInfo authorize ', _this.authorize);

							if (!_this.authorize) {
								uni.showModal({
									title: '提示',
									content: '打开授权后才能使用授权登录',
									success: function(res) {
										if (res.confirm) {
											uni.openSetting({
												success(res) {
													console.log('openSetting', res.authSetting);
													_this.authorize = res.authSetting['scope.userInfo'];
												},
												fail() {
													_this.$api.msg('打开当前设置失败', 5000);
												}
											});
										} else if (res.cancel) {
											console.log('用户点击取消');
										}
									}
								});
							}
						},
						fail() {
							_this.$api.msg('获取当前设置失败', 5000);
						}
					});
				}
			});
		},
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		toforget() {
			// 忘记密码
			uni.navigateTo({
				url: '/pages/login/forgot-password'
			});
		},
		toregister() {
			// 注册页
			uni.navigateTo({
				url: '/pages/login/register'
			});
		},

		tologin() {
			let _this = this;
			if (_this.is_login) return;

			if (!this.mobile) {
				this.$api.msg('请输入手机号');
				return;
			}

			if (!this.password) {
				this.$api.msg('请输入密码');
				return;
			}
			if (this.$api.trim(this.password).length < 4) {
				this.$api.msg('密码长度不能小于4位');
				return;
			}

			this.$func.usemall
				.call('member/login', {
					username: this.mobile,
					password: this.password
				})
				.then(res => {
					if (res.code == 200) {
						// 调用 store login
						_this.login(res.datas);

						_this.$api.alert('登录成功', () => {
							if (_this.$api.pages().length > 1) {
								// 返回上一页
								uni.navigateBack({});
								return;
							}
							// 首页
							_this.$api.tohome();
						});
						return;
					}

					this.$api.msg(res.msg);
				});
		},

		cancel() {
			this.isshow = false;
			uni.navigateBack();
		},

		mpPhoneNumber(mp_phonenumber) {
			this.$api.msg('处理中');

			if (!mp_phonenumber.detail.encryptedData) {
				if (mp_phonenumber.detail.errMsg === 'getPhoneNumber:fail no permission' && this.platform === 'qq') {
					uni.showToast({
						title: 'QQ暂无法获取手机号',
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '您取消了授权，操作失败',
						icon: 'none'
					});
				}

				this.isshow = false;
				uni.navigateBack();
				return false;
			}
			console.log('------- mpPhoneNumber 用户授权，并获取用户基本信息和加密数据------');
			console.log(mp_phonenumber.detail);
		},

		// 微信授权登录，获取用户信息
		mpGetUserInfo(userinfo) {
			this.$api.msg('处理中');
			this.logout();

			this.$api.msg('请使用手机号+密码的方式登录');
			if (this.platform !== 'weixin' && this.platform !== 'baidu' && this.platform !== 'qq' && this.platform !== 'toutiao') {
				this.$api.msg('请使用手机号+密码的方式登录');
				return;
			}
		},
		// #ifdef MP-ALIPAY
		onGetAuthorize() {
			let _this = this;
			this.$api.msg('处理中');
			
			console.log('------- onGetAuthorize 用户授权，并获取用户基本信息 ------');
			
			uni.login({
				scopes: ['auth_base'], 
				success(mpres) {
					console.log('uni.login', mpres);
					if (mpres.errMsg == 'login:ok') {
						_this.$func.usemall
							.call('member/loginByAlipay', {
								code: mpres.code
							})
							.then(res => {
								if (res.code == 200) {
									console.log('member/loginByAlipay', res);
									// 调用 store login
									_this.login(res.datas);
									
									_this.$api.alert('登录成功', () => {
										if (_this.$api.pages().length > 1) {
											// 返回上一页
											uni.navigateBack({});
											return;
										}
										// 首页
										_this.$api.tohome();
									});
									return;
								}
			
								this.$api.msg(res.msg);
							});
					}
				},
				fail(err) {
					console.log('uni.login', err);
				}
			});
			
			// 调用 store mp_login
			// _this.mp_login({
			// 	logintype: 'relogin',
			// 	type: _this.platform + '-mini',
			// 	callback: (loginres) => {
			// 		console.log('mp_login callback', loginres);
			// 		if (loginres.code !== 200) {
			// 			_this.$api.msg(loginres.msg, 5000);
			// 			return;
			// 		}
					
			// 		// 调用 store login
			// 		_this.login(loginres.datas);
					
			// 		_this.$api.alert('登录成功', () => {
			// 			uni.navigateBack();
			// 		});
			// 	}
			// });
		},
		onAuthError(res) {
			console.log('onAuthError', arguments);
			this.$api.msg(res.detail.errorMessage)
		},
		// #endif
		getUserInfo() {
			let _this = this;
			this.$api.msg('处理中');
			console.log('------- getUserInfo 用户授权，并获取用户基本信息和加密数据------');
		},
		getUserProfile() {
			uni.getUserProfile();
		},
		// #ifdef MP-WEIXIN
		mpWeixinTologin() {
			let _this = this;
			uni.login({
				provider: 'weixin',
				success(mpres) {
					console.log('uni.login', mpres);
					if (mpres.errMsg == 'login:ok') {
						_this.$func.usemall
							.call('member/loginByWeixin', {
								code: mpres.code
							})
							.then(res => {
								if (res.code == 200) {
									console.log('member/loginByWeixin', res);
									// 调用 store login
									_this.login(res.datas);
									
									_this.$api.alert('登录成功', () => {
										if (_this.$api.pages().length > 1) {
											// 返回上一页
											uni.navigateBack({});
											return;
										}
										// 首页
										_this.$api.tohome();
									});
									return;
								}

								this.$api.msg(res.msg);
							});
					}
				},
				fail(err) {
					console.log('uni.login', err);
				}
			});
		},
		// #endif
	}
};
</script>

<style lang="scss">
page {
	background: #f4f4f4;
}

.container {
	padding-top: 5vh;
	width: 100vw;
	min-height: 100vh;
	overflow: hidden;
}

.portrait-box {
	image {
		width: 130rpx;
		height: 130rpx;
		border: 5rpx solid #fff;
	}
}

.l-mask {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: rgba(51, 51, 51, 0.3);
	z-index: 99;
}

.box-container {
	position: absolute;
	width: 500rpx;
	height: 300rpx;
	background: #fff;
	left: 50%;
	transform: translate(-50%, -50%);
	top: 50%;
	z-index: 999;
	border-radius: 10rpx;
	text-align: center;
	padding: 30rpx;

	.title {
		margin-top: 40rpx;
		font-size: 30rpx;
	}

	.btn-contaer {
		display: flex;
		position: absolute;
		bottom: 30rpx;
		left: 30rpx;
		right: 30rpx;
	}

	button {
		background: #eee;
		color: #333;
		width: 50%;
		font-size: 28rpx;

		&:last-child {
			margin-left: 10px;
			background: #26a92e;
			color: #fff;
		}
	}
}
</style>
