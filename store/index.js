import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    topListIds:[],
    nextId: ''
  },
  mutations:{
    // 100条id
    INIT_TOPLISTIDS(state, payload){
      state.topListIds = payload
    },
    // 根据当前id 获取下一个id
    NEXT_ID(state, payload){
      for(let i = 0; i < state.topListIds.length; i++){
        if(state.topListIds[i].id == payload){
          state.nextId = state.topListIds[i+1].id
        }
      }
    }
  }
})