import Vue from 'vue'
// import Vuex from "vuex"
import App from './App'
import store from './store/index.js'
// 引入底部导航组件
import Footer  from 'components/song-footer/song-footer.vue'
// 全局注册底部导航
Vue.component('Footer', Footer)

// Vue.config.productionTip = false
// 创建一个过滤器
Vue.filter('formatCount',function(value){
	// 判断在万~亿之间的访问量
	if( value >= 10000 && value < 100000000 ){
		value /= 10000; 
		return value.toFixed(1) + '万';
	}
	// 大于一亿的时候
	else if(value >= 100000000){
		value /= 100000000;
		// 末尾加上 ‘亿’
		return value.toFixed(1) + '亿';
	}
	else{
		return value;
	}
	
});
/*评论区域过滤器*/
Vue.filter('formatTime',function(value){
	// 定义一个时间数组
	var date = new Date(value);
	// 返回日期
	return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
	
});

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
