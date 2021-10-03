import Vue from 'vue'
import Vuex from 'vuex'
// 引入API
import { songDetail , songUrl , songLyric , songSimi , songComment  } from '../common/api.js';

Vue.use(Vuex);
// new 一个Vuex 的实例对象
export default new Vuex.Store({
	// 初始数据
    state : {
        topIdList : [],// 歌曲列表空数组
		nextId : '',// 下一首歌曲iID
		// 全局播放信息
		songDetail : {
			al : { picUrl : '' },
			ar : { name : '' }
		},
		playicon : 'icon-suspend_icon',// 播放状态
		isplayrotate : true,// 暂停状态
    },
    mutations : {
		// 修改播放列表
		setPlayList(state, value){
			console.log('获取到播放列表')
		},
		// 初始化歌曲ID
        INIT_CHANGE(state,payload){
            state.topIdList = payload;
        },
		// 自动播放，得到下一个ID
		NEXT_ID(state,payload){
			// 遍历当前榜单所有歌曲ID
			for(var i=0;i<state.topIdList.length;i++){
				// 如果当前歌曲id 传递过来的歌曲ID相等
				if( state.topIdList[i].id == payload ){
					// 得到下一个歌曲ID
					state.nextId = state.topIdList[i+1].id;
				}
			}
		}
    }
});