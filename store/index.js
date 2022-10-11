import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    topListIds: [],
    nextId: '',
    savelist: {},
  },
  mutations: {
    // 100条id
    INIT_TOPLISTIDS(state, payload) {
      state.topListIds = payload
    },
    // 根据当前id 获取下一个id
    NEXT_ID(state, payload) {
      for (let i = 0; i < state.topListIds.length; i++) {
        if (state.topListIds[i].id == payload) {
          state.nextId = state.topListIds[i + 1].id
        }
      }
    },
    // 收藏
    SAVE_SONG(state, SONG) {
      uni.getStorage({
        key: 'saveList',
        success: function(res) {
          state.savelist.push(res)
          console.log(res)
        }
      })
      if (!state.savelist.find(item => item.id == SONG.id)) {
        state.savelist.push(SONG)
        console.log(state.savelist)
      }
      uni.setStorage({
      	key: 'saveList',
      	data: JSON.stringify(state.savelist),
      	success: function () {
      		console.log('收藏成功');
      	}
      });
    },
    // 取消收藏
    REMOVE_SONG(state, SONG) {
      uni.getStorage({
        key: 'saveList',
        success: function(res) {
          state.savelist = res
          console.log(res)
        }
      })
      state.savelist = state.savelist.filter(item => item.id !== SONG.id)
      uni.setStorage({
      	key: 'saveList',
      	data: JSON.stringify(state.savelist),
      	success: function () {
      		console.log('取消收藏');
      	}
      });
    }
  }
})
