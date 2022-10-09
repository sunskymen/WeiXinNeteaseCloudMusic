// 引入 api 配置文件
import { baseUrl } from './config.js'

// 获取排行榜数据
export function topList(){
  return new Promise((resolve, reject)=>{
    uni.request({
      url: `${baseUrl}/toplist/detail`,
      method: 'GET',
      success: res =>{
        let result = res.data.list
        resolve(result)
      },
      fail: (reason) => {
        reject(reason)
      }
    })
  })
}
// 获取排行榜列表数据
export function list(id){
  return uni.request({
    url: `${baseUrl}/playlist/detail?id=${id}`,
    method:'get'
  })
}

// 获取歌单详细 调用例子 : /song/detail?ids=347230
export function songDetail(ids){
  return uni.request({
    url: `${baseUrl}/song/detail?ids=${ids}`,
    method:'GET'
  })
}

// 获取相似音乐 调用例子 : /simi/song?id=347230
export function songSimi(id){
  return uni.request({
    url: `${baseUrl}/simi/song?id=${id}`,
    method:'GET'
  })
}

// 获取歌曲评论 调用例子 : /comment/music?id=186016&limit=1
export function songComment(id){
  return uni.request({
    url: `${baseUrl}/comment/music?id=${id}`,
    method:'GET'
  })
}
// 获取歌词 调用例子 : /lyric?id=33894312
export function songLyric(id){
  return uni.request({
    url: `${baseUrl}/lyric?id=${id}`,
    method:'GET'
  })
}
// 获取获取音乐 url 调用例子 : /song/url?id=33894312
export function songUrl(id){
  return uni.request({
    url: `${baseUrl}/song/url?id=${id}`,
    method:'GET'
  })
}

// 热搜列表(详细) /search/hot/detail
export function searchHot(){
  return uni.request({
    url: `${baseUrl}/search/hot/detail`,
    method:'GET'
  })
}
// 搜索建议 /search/suggest?keywords=海阔天空&type=mobile
export function searchSuggest(keywords){
  return uni.request({
    url: `${baseUrl}/search/suggest?keywords=${keywords}&type=mobile`,
    method:'GET'
  })
}
// 搜索 /search?keywords=海阔天空
export function searchWord(keywords){
  return uni.request({
    url: `${baseUrl}/search?keywords=${keywords}`,
    method:'GET'
  })
}