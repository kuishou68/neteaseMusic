<template>
	<view class="music-head" :style="{ color : color }">
		<view v-if="icon" class="music-head-icon" :class="{ 'music-head-iconBlack' : iconBlack }">
			<text @tap="handleToBack" class="iconfont icon-Rectangle"></text> | <text @tap="handleToHome" class="iconfont icon-icon-shouye"></text>
		</view>
		{{ title }}
	</view>
</template>

<script>
	import '../../common/iconfont.css'
	export default {
		data() {
			return {
				
			};
		},
		props : ['title','icon','color','iconBlack'],
		methods : {
			// 点击事件
			handleToBack(){
				uni.navigateBack();
			},
			// 回到首页
			handleToHome(){
				uni.navigateTo({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style>
.music-head{ height:75px; text-align: center; line-height: 80px; font-size:16px; color:black; overflow: hidden; position: relative;}
.music-head-icon{ width:97px; height:31px; background:rgba(0,0,0,0.4); border-radius: 15px; position: absolute; left:10px; top:25px; line-height: 31px; display: flex; justify-content: space-evenly; color:white;}
.music-head-iconBlack{ color:black; background:white; border:1px #dddddd solid;}
</style>
