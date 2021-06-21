import Vue from  'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state:{
		topListIds:[],
		nextId:''
	},
	mutations:{
		INIT_TPLISTIDS(statr, playload){
			state.topListIds = payload;
		},
		// 得到下一个ID
		NEXT_ID(state, payload){
			for(var i = 0;i<state.topListIds.length;i++){
				if(state.topListIds[i].id == payload){
					state.nextId = state.topListIds[i+1].id;
				}
			}
		}
	}
})