<template>
  <view :class="[displayInfo,'skeleton']" :animation="animationData" v-if="show">
	<div
	  class="skeleton-avatar"
	  v-if="avatar"
	  :style="{
		width:imgsize,
		height:imgsize,
		borderRadius:imgarc,
	}"
	/>
	<view class="skeleton-content">
	  <view v-if="title" class="skeleton-content-title" :style="titleInfo" />
	  <view v-for="(item,key) in rowDataInfo" :key="key" class="skeleton-content-row" :style="{width:rowInfo(key)}" />
	</view>
  </view>
</template>

<script>
var animation = uni.createAnimation({
  duration: 1000,
  timingFunction: "linear"
});
export default {
  data() {
	return {
	  animationData: {},
	  imgType: ["circular", "square"], //圆形----方形
	  displayType: ["vertical", "horizontal"], //垂直----水平
	  show: true //实际意义上的隐藏
	};
  },
  props: {
	// 是否显示--(明面上的意思)
	loading: {
	  type: Boolean,
	  default: true
	},
	// 是否显示标题
	title: {
	  type: Boolean,
	  default: true
	},
	// 是否显示头像
	avatar: {
	  type: Boolean,
	  default: true
	},
	// 头像大小
	avatarSize: {
	  type: Number | String,
	  default: 100
	},
	// 头像形状-圆形-方形
	isarc: {
	  type: String,
	  default: "square" //圆形
	},
	// title宽度
	titleSize: {
	  type: Number | String,
	  default: '50%'
	},
	// 标题sytle
	titleStyle: {
	  type: Object,
	  default: {}
	},
	// 几行
	row: {
	  type: Number,
	  default: 1
	},
	// 几行信息
	rowData: {
	  type: Array | String,
	  default: "80%"
	},
	// 显示类型-垂直-水平
	display: {
	  type: String,
	  default: "horizontal" //默认水平
	}
  },
  created() {
	this.animationData = animation;
  },
  watch: {
	loading(loading) {
	  if (!loading) {
		animation.opacity(0).step();
		this.animationData = animation.export();
		const time = setTimeout(() => {
		  this.show = false;
		  clearTimeout(time);
		}, 1000);
	  }
	}
  },
  computed: {
	// 循环体
	rowDataInfo() {
	  let rowArr = [];
	  for (let index = 0; index < this.row; index++) {
		rowArr.push(index);
	  }
	  return rowArr;
	},
	// tile修改字符串
	titleInfo() {
	  let titlData = "";
	  for (const key in this.titleStyle) {
		titlData += `${key}:${this.titleStyle[key]};`;
	  }
	  return titlData;
	},
	// 头像大小
	imgsize() {
	  switch (typeof this.avatarSize) {
		case "number":
		  return `${uni.upx2px(this.avatarSize)}px`;
		  break;

		default:
		  return `${uni.upx2px(parseFloat(this.avatarSize))}px`;
		  break;
	  }
	},
	// title宽度
	titlwidth() {
	  switch (typeof this.titleSize) {
		case "number":
		  return `${uni.upx2px(this.titleSize)}px`;
		  break;

		default:
		  return `${uni.upx2px(parseFloat(this.titleSize))}px`;
	  }
	},
	// 圆形
	imgarc() {
	  if (this.imgType.includes(this.isarc)) {
		if (this.isarc == "square") {
		  return "0%";
		}
		return "50%";
	  }
	  console.error(`输入错误${this.isarc}`);
	  return "0%";
	},
	// 显示类型
	displayInfo() {
	  if (this.displayType.includes(this.display)) {
		return this.display;
	  }
	  console.error(`输入错误${this.display}`);
	  return "horizontal";
	}
  },
  methods: {
	rowInfo(key) {
	  const rowTypeof = typeof this.rowData;
	  switch (rowTypeof) {
		  case 'string':
			  return this.rowData
			  break;
	  
		  case 'object':
			  // 如果没有就默认80%
			  if(!this.rowData[0]){
				return '80%';
			  } 
			  if(!this.rowData[key]){
				key = 0;
			  }
			  return (this.rowData[key].indexOf('%')>-1)?this.rowData[key]:`${uni.upx2px(parseFloat(this.rowData[key]))}px`;
			  break;
	  }
	}
  }
};
</script>

<style lang="scss" scoped>
$bg: #dddddd;

$height: 100upx;

$title-height: 40upx;

.skeleton {
  display: flex;
  padding: 20upx;
  box-sizing: border-box;
  &.vertical {
	flex-direction: column;
	align-items: center;
	.skeleton-content {
	  width: 100%;
	  margin-left: 0;
	  margin-top: 20upx;
	}
  }
  &-avatar {
	background: $bg;
	flex-shrink: 0;
  }

  &-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	margin-left: 20upx;
	overflow: hidden;

	&-title {
	  height: $title-height;
	  width: 50%;
	  background: $bg;
	}

	&-row {
	  width: 80%;
	  height: $title-height;
	  background: $bg;
	  margin-top: 20upx;
	}
  }
}
</style>
