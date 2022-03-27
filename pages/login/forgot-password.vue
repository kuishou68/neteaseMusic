<template>
	<view class="container bg-main pos-r">
		<musichead title="注册" :icon="true" :iconBlack="true"></musichead>
		<view class="padding-xl dflex-c dflex-flow-c">
			<view class="portrait-box margin-bottom">
				<image class="headimg border-radius-c" :src="(member && member.member_headimg) || '/static/images/user/default.png'"></image>
			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconshouji margin-right"></view>
				<view class="flex1 dflex">
					<input class="border-line padding-sm flex1" type="number" data-key="mobile" maxlength="11" :value="mobile" @input="inputChange"
					 placeholder="请输入手机号" />
					<view v-if="0 == 1" class="padding-tb-sm ft-dark">自动获取</view>
				</view>
			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconmima margin-right"></view>
				<!-- #ifdef MP -->
				<input class="border-line padding-sm flex1" type="text" password data-key="password" maxlength="20" :value="password"
				 @input="inputChange" placeholder="请输入新密码" />
				<!-- #endif -->
				<!-- #ifndef MP -->
				<input class="border-line padding-sm flex1" type="password" password data-key="password" maxlength="20" :value="password"
				 @input="inputChange" placeholder="请输入新密码" />
				<!-- #endif -->

			</view>

			<view class="w-full dflex padding-bottom-sm">
				<view class="iconfont iconyanzheng margin-right"></view>
				<view class="border-line flex1 dflex">
					<input class="padding-sm flex1" type="number" data-key="code" maxlength="6" :value="code" @input="inputChange"
					 @confirm="submit" placeholder="请输入验证码" />
					<view v-if="!is_send" class="padding-tb-sm ft-base" @click="sendCode">发送验证码</view>
					<view v-else class="padding-tb-sm ft-base">{{code_time}}s 重新获取</view>
				</view>
			</view>
			<view class="w-full margin-top-xl">
				<view class="dflex-b border-radius-lg">
					<view class="tac padding-tb-sm flex1 bg-base fs" @click="submit">确定</view>
				</view>
			</view>
		</view>

		<!-- 用云版权 -->
		<use-copyright class="pos-f w-full" style="bottom: -30rpx"></use-copyright>
	</view>
</template>

<script>
	// 引入返回上一级、返回首页 头部组件
	import musichead from '@/components/musichead/musichead.vue'
	import {
		mapState
	} from 'vuex';

	export default {
		data() {
			return {
				env: {},
				__token: '',
				is_show: false,

				mobile: '',
				password: '',
				code: '',

				is_submit: false,
				is_send: false,
				code_time: 30,
				timer: 0,
			};
		},
		computed: {
			...mapState(["member"])
		},
		// 局部组件
		components: {
			musichead
		},
		// 页面加载获取 wx.login code
		onShow() {
			// #ifdef MP-WEIXIN
			let lopts = uni.getLaunchOptionsSync();
			console.log(lopts);
			// #endif
		},
		onLoad() {
			this.$api.get_env((res) => {
				this.env = res;
				console.log(this.env);
				this.is_mp = this.env.is_mp;
				this.platform = this.env.platform;
				this.platform_icon = this.env.platform_icon;
				this.platform_name = this.env.platform_name;
			});
		},
		methods: {
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},

			// 发送验证码
			sendCode() {
				let _this = this;

				if (!this.mobile) {
					this.$api.msg('请输入手机号');
					return;
				}
				if (!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(this.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}

				if (this.is_send) return;

				uni.showLoading({
					title: '发送中'
				})
				
				
				this.code_time = 30;
				this.is_send = true;
				
				this.$func.usemall.call('member/sendSmsCode', {
					mobile: this.mobile,
					type: 'forgot-password',
					platform: _this.env.platform,
				}).then(res => {
					uni.hideLoading();
					
					if (res.code == 200) {
				
						this.$api.alert('验证码已发送', () => {
							this.timer = setInterval(() => {
								--this.code_time;
				
								if (this.code_time <= 0) {
									clearInterval(this.timer)
									this.is_send = false;
									this.code_time = 30;
									return;
								}
							}, 1000);
						});
						
						return;
					}
				
					this.$api.msg(res.msg);
				});
			},
			submit() {
				let _this = this;
				if (this.is_submit) return;

				if (!this.mobile) {
					this.$api.msg('请输入手机号');
					return;
				}
				if (!/(^1[3|4|5|7|8|9][0-9]{9}$)/.test(this.mobile)) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}

				if (!this.password) {
					this.$api.msg('请输入新密码');
					return;
				}
				if (this.$api.trim(this.password).length < 4) {
					this.$api.msg('密码长度不能小于4位');
					return;
				}

				if (!this.code) {
					this.$api.msg('请输入验证码');
					return;
				}
				
				const data = {
					mobile: _this.mobile,
					password: _this.password,
					code: _this.code,
					platform: _this.env.platform
				};
				console.log(data);

				_this.is_submit = true;
				
				this.$func.usemall.call('member/forgotPassword', data).then(res => {
					_this.is_submit = false;
					if (res.code == 200) {
					
						_this.$api.alert('密码已修改', () => {
							if (_this.$api.pages().length > 1) {
								uni.setStorage({
									key: '__mobile',
									data: _this.mobile
								})
								// 跳转登录
								uni.navigateBack();
								return;
							}
							// 登录页
							_this.$api.tologin();
							return;
						});
						
						return;
					}
					
					_this.$api.msg(res.msg);
				});
			},
		}
	};
</script>

<style lang="scss">
	@import url("@/components/iconfont/iconfont.css");
	@import url("@/common/common.scss");
	page {
		background: #f4f4f4;
	}

	.container {
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
</style>
