<template>
	<view>大风吹
			<image src="../../static/109951165806093811.jpg" mode=""></image>
			<text>大风吹</text>
			<!--播放按钮-->
			<text class="iconfont iconbofang"></text>
			<!--列表播放-->
			<text class="iconfont iconlist"></text>
	</view>
</template>

<script>
	import '../../common/iconfont.css'
	export default {
		name:"playerbar",
		data() {
			return {
				
			};
		},
		// 显示list 中使用到的属性
		props : ['title','icon','color']
	}
</script>

<style>
	.player{height: 75px;line-height: 980px; font-size: 16px; color: black;position: absolute;}
</style>
