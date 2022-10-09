<template>
  <view class="index">
    <view class="usericon" @tap="handleToUser">
      <!-- <iconfont name="icon-yonghu1" size="30" /> -->
      <text class="iconfont icon-yonghu1" @tap="handleToUser"></text>
    </view>
    <musichead title="网易云音乐" :icon="false"></musichead>
    <view class="container">
      <scroll-view scroll-y="true" class="scroll">
        <view class="index-search" @tap="handleToSearch">
          <text class="iconfont icon-sousuo"></text>
          <input type="text" placeholder="歌曲搜索" />
        </view>
        
          <view class="index-list">
            <!-- 歌曲列表 -->
            <view class="index-list-item" v-for="(item, index) in topList1" :key="item.id" @tap="handleToList(item.id)">
              <view class="index-list-img">
                <image :src="item.coverImgUrl" mode=""></image>
                <text>{{ item.updateFrequency }}</text>
              </view>
              <view class="index-list-text">
                <view v-for="(track, index) in item.tracks" :key="index">{{ track.first }} - {{ track.second }}</view>
              </view>
            </view>
            <!-- list 2 -->
            <view class="index-list-item" v-for="(item, index) in topList2" :key="item.id" @tap="handleToList(item.id)">
              <view class="index-list-img">
                <image :src="item.coverImgUrl" mode=""></image>
                <text>{{ item.updateFrequency }}</text>
              </view>
              <view class="index-list2-text">{{ item.name }}</view>
            </view>
          </view>
        
      </scroll-view>
    </view>
    <view class="notice">
      <uni-notice-bar :speed="speed" showIcon scrollable show-close single text="小程序正在完善中, 欢迎提交你的想法! Star : https://github.com/Binaryify/NeteaseCloudMusicApi" />
    </view>
  </view>
</template>

<script>
// 引入头部组件
import musichead from '@/components/musichead/musichead.vue';
// 引入图标样式
import '@/common/iconfont.css';
// 引入 api 接口
import { topList } from '../../common/api.js';
export default {
  data() {
    return {
      title: 'Hello',
      topList1: [],
      topList2: [],
      speed: 50,
      loading:true
    };
  },
  components: {
    musichead
  },
  async onLoad() {
    // 请求排行榜数据
    const res = await topList();
    if (res.length) {
      this.topList1 = res.slice(0, 4);
      this.topList2 = res.slice(4);
      this.length = false
    }
  },
  methods: {
    handleToUser(){
      uni.navigateTo({
        url: '/pages/user/user'
      })
    },
    handleToList(id) {
      uni.navigateTo({
        url: '/pages/list/list?id=' + id
      });
    },
    handleToSearch() {
      uni.navigateTo({
        url: '/pages/search/search'
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .usericon {
    position: fixed;
    bottom: 50px;
    right: 10px;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: deeppink;
    // 权重问题
    z-index: 99;
    text {
      width: 40px;
      height: 40px;
      font-size: 23px;
    }
  }
.index {
  .notice {
    height: 40px;
    /* #ifndef APP-NVUE */
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0;
    margin: 0;
    // background-color: #fffbe8;
    /* #endif */
  }
  .container {
    .index-search {
      display: flex;
      align-items: center;
      height: 70rpx;
      margin: 70rpx 30rpx 30rpx 30rpx;
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
    .index-list2-text {
      width: 150px;
      height: 20px;
      margin: 42px 20px;
      font-size: 16px;
      overflow: hidden;
    }
    .index-list {
      display: flex;
      flex-direction: column;
      margin: 0px 20px;
      .index-list-item {
        display: flex;
        margin-bottom: 34rpx;
        .index-list-img {
          position: relative;
          width: 212rpx;
          height: 212rpx;
          border-radius: 30rpx;
          overflow: hidden;
          image {
            width: 100%;
            height: 100%;
          }
          text {
            position: absolute;
            bottom: 16rpx;
            left: 12rpx;
            color: white;
            font-size: 20rpx;
          }
        }
        .index-list-text {
          display: flex;
          flex: 1;
          margin-left: 22rpx;
          font-size: 26rpx;
          line-height: 66rpx;
          flex-direction: column;
          justify-content: space-around;
          overflow: hidden; // 超出的文本隐藏
          white-space: nowrap; // 溢出不换行
          view {
            overflow: hidden; // 超出的文本隐藏
            text-overflow: ellipsis; // 溢出用省略号显示
          }
        }
      }
    }
  }
}

.tew {
}
</style>
