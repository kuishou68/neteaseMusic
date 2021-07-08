<template>
    <view class="container">
        <view class="left-top-sign">LOGIN</view>
        <view class="welcome">欢迎回来！</view>
		 <button class="confirm-btn" open-type="getUserInfo" @getuserinfo="wxLogin" :disabled="logining">微信授权登录</button>

    </view>
</template>
​
<script>
import { mapMutations } from 'vuex'

export default {
    data() {
        return {
            logining: false
        };
    },
    onLoad() {},
    methods: {
        wxLogin(e) {
        const that = this;
        that.logining = true;
        let userInfo = e.detail.userInfo;
        uni.login({
            provider:"weixin",
            success:(login_res => {
                let code = login_res.code;
                uni.getUserInfo({
                    success(info_res) {
                        console.log(info_res)
                        uni.request({
							//  url : 'https:///hoa.hcoder.net/xcxencode/?c=sk&appid=wxbb7f9f1f2c6f4f33&secret=739b970b832f0df158f54c494a08e440&code='+res2.code,
                            // url:'http://127.0.0.1:29507/pages/index/index',
							url:'http://127.0.0.1:29507/login',
                            method:"POST",
                            header: {
                                              'content-type': 'application/x-www-form-urlencoded'
                                            },
                            data:{
                                code : code,
                                rawData : info_res.rawData
                            },
                            success(res) {
								console.log(res);
                                if(res.data.status == 200){
									console.log('22222222');
                                    that.$store.commit('login',userInfo);
                                    uni.setStorageSync("userInfo",userInfo);
                                    uni.setStorageSync("skey", res.data.data);
                                }else{
                                    console.log('服务器异常')
                                }
                            },
                            fail(error) {
                                console.log(error)
                            }
                        })
                        uni.hideLoading()
                        uni.navigateBack()
                    }
                })
                
            })
            })
        }
    }
};
</script>
​
<style lang="scss">

</style>
​