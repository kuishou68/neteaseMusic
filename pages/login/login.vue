<template>
	<view class="container bg-main pos-r">
		<musichead title="登录" :icon="true" :iconBlack="true"></musichead>
		<view class="padding-xl dflex-c dflex-flow-c">
			<view class="headimg-box margin-top margin-bottom-xl">
				<image class="headimg border-radius-c" src="/static/user/default.png"></image>
			</view>

			<swiper class="w-full" duration="200" disable-touch style="height: 190rpx;"
				:current="loginWay == 'code' ? 0 : 1">
				<!-- 验证码登录 -->
				<swiper-item>
					<view class="w-full dflex padding-bottom-sm">
						<view class="iconfont iconshouji margin-right"></view>
						<view class="flex1 dflex">
							<input class="border-line padding-sm flex1" type="number" data-key="mobile" maxlength="11"
								:value="mobile" @input="inputChange" placeholder="请输入手机号" />
							<view v-if="0 == 1" class="padding-tb-sm ft-dark" @click="send_code">获取</view>
						</view>
					</view>

					<use-smscode type="login" :mobile="mobile" :agreement="agreement"
						:agreementContent="agreementContent" @change="codeChange" @confirm="tologin"></use-smscode>
				</swiper-item>

				<!-- 账号密码登录 -->
				<swiper-item>
					<view class="w-full dflex padding-bottom-sm">
						<view class="iconfont iconshouji margin-right"></view>
						<view class="flex1 dflex">
							<input class="border-line padding-sm flex1" type="number" data-key="mobile" maxlength="11"
								:value="mobile" @input="inputChange" placeholder="请输入手机号" />
							<view v-if="0 == 1" class="padding-tb-sm ft-dark" @click="send_code">获取</view>
						</view>
					</view>

					<view class="w-full dflex">
						<view class="iconfont iconmima margin-right"></view>

						<view class="dflex flex1 border-line">
							<!-- #ifdef MP -->
							<input class="padding-sm flex1" type="text" password data-key="password" maxlength="20"
								:value="password" @input="inputChange" @confirm="tologin" placeholder="请输入密码" />
							<!-- #endif -->

							<!-- #ifndef MP -->
							<input class="padding-sm flex1" type="password" password data-key="password" maxlength="20"
								:value="password" @input="inputChange" @confirm="tologin" placeholder="请输入密码" />
							<!-- #endif -->

							<view class="pos-r">
								<view class="vertical-line" style="right: calc(100% + 20rpx);"></view>
								<view class="padding-tb-sm ft-dark" @click="toforget">忘记密码</view>
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>

			<view class="w-full margin-top-xxl">
				<view class="dflex-b border-radius-lg">
					<view class="tac padding-tb-sm flex1 bg-base fs" @click="tologin">登录</view>
				</view>
			</view>

			<view class="dflex-b w-full margin-bottom-sm ft-dark-4">
				<view v-if="loginWay == 'pwd'" class="padding-tb-sm" @click="loginWayChange('code')">验证码登录</view>
				<view v-if="loginWay == 'code'" class="padding-tb-sm" @click="loginWayChange('pwd')">账号密码登录</view>
				<view class="padding-tb-sm" @click="toregister">立即注册</view>
			</view>
			<view v-if="agreementDatas && agreementDatas.length > 0" class="dflex w-full margin-top"
				@click="toAgreement">
				<view v-if="agreement" class="iconfont iconxuanzhongzhuangtai margin-right-xs ft-base"></view>
				<view v-else class="iconfont iconweixuanzhongzhuangtai margin-right-xs"></view>
				<view class="ft-dark-3">
					登录即已同意<text v-for="(item, idx) in agreementDatas" :key="idx" class="ft-base"
						@click.stop="toContent(item)">《{{item.name}}》</text>
				</view>
			</view>
		</view>

		<view class="pos-f pos-bottom dflex-c w-full padding-bottom-lg">
			<!-- #ifdef MP -->
			<!-- #ifdef MP-WEIXIN -->
			<button class="dflex-c dflex-flow-c no-border btn" lang="zh_CN" @click="mpWeixinTologin">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl iconweixin"></view>
				<view class="dflex-c fs-sm ft-dark">微信 · 授权登录</view>
			</button>
			<!-- #endif -->
			<!-- #ifdef MP-BAIDU || MP-QQ -->
			<button class="dflex-c dflex-flow-c no-border btn" open-type="getUserInfo" lang="zh_CN"
				withCredentials="true" @getuserinfo="mpGetUserInfo">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c fs-sm ft-dark">{{ platform_name }} · 授权登录</view>
			</button>
			<!-- #endif -->

			<!-- #ifdef MP-ALIPAY -->
			<view class="dflex-c dflex-flow-c no-border btn" open-type="getAuthorize" scope="userInfo"
				@click="onGetAuthorize" @error="onAuthError">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c fs-sm ft-dark">{{ platform_name }} · 授权</view>
			</view>
			<!-- #endif -->

			<!-- #ifdef MP-TOUTIAO -->
			<view class="dflex-c dflex-flow-c no-border btn" open-type="getUserInfo" lang="zh_CN" withCredentials="true"
				@click="getUserInfo">
				<view class="iconfont padding-lr-sm border-radius-c fs-xxxl" :class="platform_icon"></view>
				<view class="dflex-c ft-dark">{{ platform_name }} · 授权</view>
			</view>
			<!-- #endif -->
			<!-- #endif -->


			<!-- #ifdef APP -->
			<view class="dflex-c dflex-flow-c w-full padding-lr">
				<view class="ft-dark fs-xxs doblue-line margin-tb">
					<text class="padding-lr-xs">第三方登录方式</text>
				</view>
				<view class="dflex-c login-area">
					<view class="dflex-c dflex-flow-c" @click="mpWeixinTologin">
						<image class="dflex-c image-60" src="/static/images/login/wechat.png"></image>
						<text class="fs-xxs margin-top-xs">微信</text>
					</view>
					<view class="dflex-c dflex-flow-c" @click="univerifyTologin">
						<image class="dflex-c image-60" src="/static/images/login/univerify.png"></image>
						<text class="fs-xxs margin-top-xs">手机</text>
					</view>
					<view v-if="hasApple" class="dflex-c dflex-flow-c" @click="appleTologin">
						<image class="dflex-c image-60" src="/static/images/login/apple.png"></image>
						<text class="fs-xxs margin-top-xs">Apple</text>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		
		<!-- <uni-popup ref="popup" type="center"></uni-popup> -->
		<uni-popup ref="popup" type="center" :mask-click="false" :animation="false">
			<text>登录成功</text>
			<button @click="close">关闭</button>
		</uni-popup>
	</view>
</template>

<script>
	// 引入返回上一级、返回首页 头部组件
	import musichead from '../../components/musichead/musichead.vue'
	// 引入 歌曲列表接口
	import { login } from '../../common/api.js'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				loginWay: 'pwd',
				agreement: true,
				agreementContent: '已阅读并同意',
				agreementDatas: [],
				ismp: false,
				platform: '',
				platform_name: '',
				platform_icon: '',

				env: {},

				mobile: '',
				password: '',
				code: '',
				codeValid: false,

				authorize: 0,
				hasApple: false,
				bindMobileShow: false
			};
		},
		computed: {
			...mapState(['member'])
		},
		// 局部组件
		components: {
			musichead
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
					_this.mobile = res.data || '';
				}
			});

			uni.getStorage({
				key: '__loginWay',
				success(res) {
					_this.loginWay = res.data || 0;
				}
			})

			// #ifndef APP || H5
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
			// #endif
		},
		onLoad() {
			let _this = this;

			// this.$api.get_env(res => {
			// 	this.env = res;
			// 	console.log('this.env', this.env);
			// 	this.ismp = this.env.is_mp;
			// 	this.platform = this.env.platform;
			// 	this.platform_icon = this.env.platform_icon;
			// 	this.platform_name = this.env.platform_name;
			// 	// #ifdef APP
			// 	this.hasApple = this.env.os.name == 'ios';
			// 	// #endif
			// });

			// this.$db['usemall-sys-agreement'].where({
			// 	type: '登录'
			// }).tolist().then(res => {
			// 	if (res.code == 200) {
			// 		this.agreementDatas = res.datas;

			// 		this.agreementContent += this.agreementDatas.map(x => x.name).join('、');
			// 	}
			// })
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
														console.log('openSetting', res
															.authSetting);
														_this.authorize = res
															.authSetting[
																'scope.userInfo'];
													},
													fail() {
														_this.$api.msg('打开当前设置失败',
															5000);
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
			loginWayChange(res) {
				this.loginWay = res;
			},
			codeChange(code) {
				this.code = code;
			},
			toContent(item) {
				const content =
					`<div class="__rich_text">${item.content.replace(/<h1/gi, '<h1 class="use-p"').replace(/<h3/gi, '<h3 class="use-p"').replace(/<p/gi, '<p class="use-p"')}</div>`;

				uni.setStorage({
					key: '__rich_text',
					data: content,
					success() {
						uni.navigateTo({
							url: '/pages/content/rich-text'
						})
					}
				})
			},
			toAgreement() {
				this.agreement = !this.agreement;
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
			async tologin(type) {
				let _this = this;
				if (_this.is_login) return;

				if (!this.mobile) {
					this.$api.msg('请输入手机号');
					return;
				}
				
				let url = 'member/login';
				let data = {
					// sharemid: uni.getStorageSync('__use_share_mid') || ''
				};
				if (this.loginWay == 'pwd') {
					if (!this.password) {
						this.$api.msg('请输入密码');
						return;
					}
					// if (this.$api.trim(this.password).length < 4) {
					// 	this.$api.msg('密码长度不能小于4位');
					// 	return;
					// }

					data.phone = this.mobile;
					data.password = this.password;
					console.log(data)
					// 登录请求
					login(data).then((res)=>{
						if (res[1].statusCode == 200) {
							console.log(res[1].data);	
							// 登录成功
							// this.$refs.popup.open('center')
							// 跳转至首页
							uni.navigateTo({
								url: '/pages/index/index',
								events: {
								    // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
								    acceptDataFromOpenedPage: function(data) {
								      console.log(data)
								    },
								    someEvent: function(data) {
								      console.log(data)
								    }
								    ...
								  },
								  success: function(res) {
								    // 通过eventChannel向被打开页面传送数据
								    res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'data from starter page' })
								  }
							});
						}
					});
				} else if (this.loginWay == 'code') {
					if (!this.code) {
						this.$api.msg('请输入验证码');
						return;
					}
					if (this.code.length != 6) {
						this.$api.msg('验证码错误');
						return;
					}

					url = 'member/loginBySms';
					data.mobile = this.mobile;
					data.code = this.code;
					// #ifdef APP-PLUS || MP-WEIXIN
					if (this.bindMobileShow) {
						data.wxcode = await this.getWeixinCode();

						// #ifdef MP-WEIXIN
						data.user = uni.getStorageSync('__wxuser') || {};
						data.from = 'mp';
						// #endif

						// #ifdef APP-PLUS
						data.from = 'app';
						// #endif

						// 解绑并绑定
						if (type == 'unbind-bind') data.type = type;
					}
					// #endif
				}

				if (!this.agreement) {
					this.$api.msg(this.agreementContent);
					return;
				}

				uni.showLoading({
					title: '登录中'
				})

				this.$func.usemall
					.call(url, data)
					.then(res => {
						uni.hideLoading();

						if (res.code == 100) {
							// 当前手机号已绑定其他微信号，弹窗询问是否解绑
							uni.showModal({
								content: '已绑定其他微信号，是否解绑并绑定当前微信号',
								cancelText: '取消',
								confirmText: '解绑并绑定',
								success: (res) => {
									if (res.confirm) {
										// 登录类型解绑并绑定
										this.tologin('unbind-bind');
									}
								}
							})
							return;
						}

						if (res.code == 200) {
							// 调用 store login
							if (res.datas.member && res.datas.member.is_plus === '付费会员' && res.datas.member
								.plus_time >= new Date().getTime()) {
								res.datas.member.vip = true;
							}
							uni.setStorage({
								key: '__mobile',
								data: _this.mobile
							})
							uni.setStorage({
								key: '__loginWay',
								data: _this.loginWay
							})
							_this.login(res.datas);

							this.$api.msg('登录成功');
							if (_this.$api.pages().length > 1) {
								// 返回上一页
								uni.navigateBack({});
								return;
							}
							// 首页
							_this.$api.tohome();
							return;
						}

						this.$api.msg(res.msg);
					});
			},
			close() {
				this.$refs.popup.close()
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

					uni.navigateBack();
					return false;
				}
				console.log('------- mpPhoneNumber 用户授权，并获取用户基本信息和加密数据------');
				console.log(mp_phonenumber.detail);
			},

			// 微信授权登录，获取用户信息
			mpGetUserInfo(userinfo) {
				if (!this.agreement) {
					this.$api.msg(this.agreementContent);
					return;
				}
				this.$api.msg('处理中');
				this.logout();

				this.$api.msg('请使用手机号+密码的方式登录');
				if (this.platform !== 'weixin' && this.platform !== 'baidu' && this.platform !== 'qq' && this.platform !==
					'toutiao') {
					this.$api.msg('请使用手机号+密码的方式登录');
					return;
				}
			},
			// #ifdef MP-ALIPAY
			onGetAuthorize() {
				if (!this.agreement) {
					this.$api.msg(this.agreementContent);
					return;
				}
				let _this = this;
				this.$api.msg('处理中');

				uni.login({
					scopes: ['auth_base'],
					success(mpres) {
						console.log('uni.login', mpres);
						if (mpres.errMsg == 'login:ok') {
							_this.$func.usemall
								.call('member/loginByAlipay', {
									sharemid: uni.getStorageSync('__use_share_mid') || '',
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

									_this.$api.msg(res.msg);
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
			// #ifdef MP-WEIXIN || APP
			mpWeixinTologin() {
				if (!this.agreement) {
					this.$api.msg(this.agreementContent);
					return;
				}
				uni.showLoading({
					title: '处理中'
				});
				let _this = this;

				// 获取用户数据
				_this.mpWeixinGetUserProfile((success, userRes) => {
					if (!success) {
						uni.hideLoading();
						return;
					}

					uni.login({
						provider: 'weixin',
						onlyAuthorize: true,
						success(mpres) {
							console.log('uni.login', mpres);
							if (mpres.errMsg == 'login:ok') {
								_this.$func.usemall
									.call('member/loginByWeixin', {
										sharemid: uni.getStorageSync('__use_share_mid') || '',
										code: mpres.code,
										user: userRes
									})
									.then(res => {
										uni.hideLoading();

										if (res.code == 100) {
											uni.setStorage({
												key: '__wxuser',
												data: userRes
											})
											// 未绑定手机号
											_this.bindMobileShow = true;
											_this.$api.msg(res.msg);
											return;
										}

										if (res.code == 200) {
											console.log('member/loginByWeixin', res);
											// 调用 store login
											_this.login(res.datas);

											// 存储已授权登录
											uni.setStorageSync('__usemall_login', _this.$api.format(
												new Date(), 'yyyyqq'));

											_this.$api.msg('登录成功');
											if (_this.$api.pages().length > 1) {
												// 返回上一页
												uni.navigateBack({});
												return;
											}
											// 首页
											_this.$api.tohome();
											return;
										}

										_this.$api.msg(res.msg);
									});
							}
						},
						fail(err) {
							console.log('uni.login', err);
							uni.hideLoading();
						}
					});
				});

			},
			mpWeixinGetUserProfile(callback) {
				// #ifdef APP
				callback(true, null);
				return;
				// #endif

				// 判断是否为首次登录
				if (uni.getStorageSync('__usemall_login') === this.$api.format(new Date(), 'yyyyqq')) {
					// 已登录
					callback(true, null);
					return;
				}

				uni.getUserProfile({
					desc: '更新会员信息',
					lang: 'zh_CN',
					success(res) {
						if (typeof callback === 'function') {
							callback(true, {
								nickname: res.userInfo.nickName,
								gender: res.userInfo.gender,
								avatar: res.userInfo.avatarUrl,
								comment: [res.userInfo.country, res.userInfo.province, res.userInfo.city]
									.filter(x => x).join('-')
							});
						}
					},
					fail(err) {
						console.log(err);
						callback(false, null);
					}
				});
			},
			async getWeixinCode() {
				return new Promise((resolve, reject) => {
					// #ifdef MP-WEIXIN
					uni.login({
						success: (res) => {
							resolve(res.code);
						},
						fail: (err) => {
							reject(err)
						}
					});
					// #endif
					// #ifdef APP-PLUS
					weixinAuthService.authorize((res) => {
						resolve(res.code)
					}, (err) => {
						console.log(err)
						reject(new Error('微信登录失败'))
					});
					// #endif
				})
			},
			// #endif
			codeChange(code) {
				this.code = code;
			},
			codeSent(res) {
				if (!res.bound) {
					// #ifdef MP-WEIXIN
					const ltype = '__usemall_login_sms_' + this.mobile;
					uni.removeStorage({
						key: ltype
					});
					// #endif
				}
			},

			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			verify() {
				this.codeValid = false;
				if (!this.mobile) {
					this.$api.msg('请输入手机号');
					return false;
				}
				if (!/(^1[0-9][0-9]{9}$)/.test(this.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return false;
				}

				this.codeValid = true;
				return true;
			}
		}
	};
</script>

<style>
	@import url("@/components/iconfont/iconfont.css");
	@import url("@/common/common.scss");
	.headimg-box image {
		width: 130rpx;
		height: 130rpx;
	}

	.login-area view {
		width: 25vw;
	}

	.bind-area {
		width: 100vw;
		padding: 80rpx;
		padding-top: 100rpx;
	}

	.bind-area .field {
		background-color: #f5f5f5;

	}

	.bind-area .field textarea {
		height: 100rpx !important;
	}
</style>
