import App from './App'
import Vue from 'vue'
// 引入store
import store from '@/store/index.js'

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('formatCount', (value)=>{
  if( value >= 10000 && value < 100000000 ){
    value /= 1000
    return value.toFixed(1) + '万'
  } else if (value > 100000000){
    value /= 100000000
    return value.toFixed(1) + '亿'
  } else {
    return value
  }
})
Vue.filter('formatTime',(value)=>{
  let date = new Date(value)
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
})

App.mpType = 'app'
const app = new Vue({
    ...App,
    store
})
app.$mount()