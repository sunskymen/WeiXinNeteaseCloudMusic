<template>
  <view class="search">
    <musichead title="搜索" :icon="true" :iconblack="true"></musichead>
    <view class="container">
      <scroll-view scroll-y="true">
        <view class="search-search">
          <text class="iconfont icon-sousuo"></text>
          <input @confirm="handleToSearch(searchWord)" v-model="searchWord" type="text" placeholder="歌曲搜索" @input="handleToSuggest"/>
          <text v-show="searchType != 1" class="iconfont icon-guanbi" @tap="handleToClose"></text>
        </view>
        <!-- 搜索推荐 -->
        <block v-if="searchType == 1">
        <!-- 历史记录 -->
        <view class="search-history">
          <view class="head">
            <text>历史记录</text>
            <text class="iconfont icon-empty" @tap="handleToClear"></text>
          </view>
          <view class="list">
            <view v-for="(item,index) in searchHistory" :key="index" @tap="handleToWord(item)">{{item}}</view>
          </view>
        </view>
        <!-- 热搜区域 -->
        <view class="search-hot">
          <view class="head">
            热搜榜
          </view>
          <view v-for="(item,index) in searchHotList" :key="index" class="item" @tap="handleToWord(item.searchWord)">
            <view class="top">{{index + 1}}</view>
            <view class="word">
              <view>
                {{item.searchWord}} 
                <image :src="item.iconUrl" mode="aspectFit">
                </image>
              </view>
              <view>{{item.content}}</view>
            </view>
            <text class="count">{{item.score}}</text>
          </view>
        </view>
        </block>
        <!-- 搜素结果列表 -->
        <block v-else-if="searchType == 2">
          <view class="search-result">
            <view v-for="(item,index) in searchList" :key="index" class="item" @tap="handleToDetail(item.id)">
              <!-- 左 -->
              <view class="left">
                <view>
                  {{item.name}}
                </view>
                <view>
                  <image src="/static//dujia.png" mode=""></image>
                  <view>{{item.ar[0].name}} - {{item.al.name}}</view>
                </view>
              </view>
              <!-- 右 -->
              <view class="right">
                <text class="iconfont icon-bofang"></text>
              </view>
            </view>
          </view>
        </block>
        
        <!-- 搜索建议 -->
        <block v-else-if="searchType == 3">
          <view class="search-suggest">
            <view class="head">
              搜索 "{{searchWord}}"
            </view>
            <view class="item" v-for="(item,index) in searchSuggest" :key="index" @tap="handleToSearch(item.keyword)">
              <text class="iconfont icon-sousuo"></text>{{item.keyword}}
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// 引入头部组件
import musichead from '@/components/musichead/musichead.vue';
// 引入图标样式
import '@/common/iconfont.css';
// 引入 api 接口
import {searchHot, searchWord, searchSuggest } from '@/common/api.js'
export default {
  data() {
    return {
      searchHotList: [],
      searchWord: '',
      searchHistory: [],
      searchType: 1,
      searchList: [],
      searchSuggest: []
    };
  },
  onLoad(){
    // 热搜请求 api
    searchHot().then((res)=>{
      if(res[1].data.code === 200){
        this.searchHotList = res[1].data.data
      }
    }),
    // 本地取出历史记录
     uni.getStorage({
      key:'searchHistory',
      success: res => {
        this.searchHistory = res.data
      }
    })
  },
  methods: {
    // 点击热搜
    handleToWord(searchWord){
      this.searchWord = searchWord
      this.handleToSearch(searchWord)
    },
    // 按下搜索
    handleToSearch(word){
      if(this.searchHistory.indexOf(word) !== -1){
        // 已经存在则弹出
        this.searchHistory.pop(word)
      }
      // 添加最前面
      this.searchHistory.unshift(word)
      // 长度限制为10
      if(this.searchHistory.length > 10){
        this.searchHistory.length = 10
      }
      // 存储本地
      uni.setStorage({
        key:'searchHistory',
        data: this.searchHistory
      })
      // 获取搜索数据
      this.getSearchList(word)
    },
    // 清除本地
    handleToClear(){
      uni.removeStorage({
      	key: 'searchHistory',
        success: ()=>{
          this.searchHistory = []
        }
      })
    },
    // 获取搜索数据方法
    getSearchList(word){
      searchWord(word).then((res)=>{
        console.log(res)
        if(res[1].data.code == 200){
          this.searchList = res[1].data.result.songs
          this.searchType = 2
        }
      })
    },
    // 清除搜索
    handleToClose(){
      this.searchWord = ''
      this.searchType = 1
    },
    // 点击歌曲跳转详情
    handleToDetail(id){
      uni.navigateTo({
        url:'/pages/detail/detail?id=' + id,
      })
    },
    // 正在输入
    handleToSuggest(event){
      let value = event.detail.value
      // 为空则回到开始页
      if(!value){
        this.searchType = 1
        return
      }
      // 建议请求
      searchSuggest(value).then((res)=>{
        if(res[1].data.code == 200){
          this.searchSuggest = res[1].data.result.allMatch
          this.searchType = 3
        }
      })
    }
  },
  components: {
    musichead
  }
};
</script>

<style lang="less" scoped>
.container {
  // 搜索
  .search-search {
    display: flex;
    align-items: center;
    height: 70rpx;
    margin: 70rpx 30rpx 50rpx 30rpx;
    background-color: #f7f7f7;
    border-radius: 50rpx;
    padding-left: 50rpx;
    text {
      font-size: 26rpx;
      margin-right: 26rpx;
    }
    input {
      font-size: 28rpx;
      flex: 1;
    }
  }
  // 历史记录
  .search-history {
    margin: 0rpx 30rpx 50rpx 30rpx;
    font-size: 26rpx;
    .head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 36rpx;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      view {
        // 文字不确定不能设置盒子大小
        padding: 16rpx 28rpx;
        border-radius: 40rpx;
        margin-right: 30rpx;
        margin-bottom: 30rpx;
        background: #f7f7f7;
      }
    }
  }
  // 热搜
  .search-hot {
    margin: 0 30rpx;
    font-size: 26rpx;
    .head {
      margin-bottom: 36rpx;
    }
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 58rpx;
      .top {
        width: 60rpx;
        margin-left: 8rpx;
        color: #b22222;
      }
      .word {
        flex: 1;
        view:nth-child(1) {
          font-size: 30rpx;
          color: black;
          image {
            width: 48rpx;
            height: 22rpx;
          }
        }
        view:nth-child(2) {
          font-size: 24rpx;
          color: #878787;
        }
      }
      .count {
        color: #878787;
      }
    }
  }
  
  .search-result {
    border-top: 2px solid #e4e4e4;
    padding: 30rpx;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 30rpx ;
      margin-bottom: 30rpx;
      border-bottom: 2px solid #e4e4e4;
      .left {
        view:nth-child(1) {
          font-size: 28rpx;
          color: #253790;
          margin-bottom: 12rpx;
        }
        view:nth-child(2) {
          display: flex;
          align-items: center;
          font-size: 25rpx;
          color: #898989;
          view {
            height: 25rpx;
          }
          image {
            position: relative;
            top: 2rpx;
            width: 40rpx;
            height: 25rpx;
            margin-right: 15rpx;
          }
        }
      }
      .right {
        text {
          font-size: 50rpx;
        }
      }
    }
  }
  .search-suggest {
    border-top: 2px solid #e4e4e4;
    padding: 30rpx;
    font-size: 26rpx;
    .head {
      margin-bottom: 74rpx;
      color: #4574a5;
    }
    .item {
      margin-bottom: 74rpx;
      color: #5d5d5d;
      text {
        position: relative;
        top: 2rpx;
        margin-right: 28rpx;
        color: #bdbdbd;
      }
    }
  }
}

</style>
