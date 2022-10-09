<template>
  <view class="list">
    <view class="fixbg" :style="{ backgroundImage: 'url(' + playlist.coverImgUrl + ')' }"></view>
    <musichead title="歌单" :icon="true" color="white"></musichead>

    <view v-show="!isLoading" class="container">
      <scroll-view scroll-y="true">
        <view class="list-head">
          <!-- 左侧 -->
          <view class="list-head-img">
            <image :src="playlist.coverImgUrl" mode=""></image>
            <text class="iconfont icon-yousanjiao">{{ playlist.playCount | formatCount }}</text>
          </view>
          <!-- 右侧 -->
          <view class="list-head-text">
            <view class="first">{{ playlist.name }}</view>
            <view class="second">
              <image :src="playlist.creator.avatarUrl" mode=""></image>
              {{ playlist.creator.nickname }}
            </view>
            <view class="third">{{ playlist.description }}</view>
          </view>
        </view>
        <!-- 分享 -->
        <button class="list-share" open-type="share">
          <text class="iconfont icon-fenxiang"></text>
          分享给微信好友
        </button>
        <!-- 音乐列表 -->
        <view class="list-music">
          <!-- 头部 -->
          <view class="list-music-head">
            <text class="iconfont icon-bofang1"></text>
            <text>播放全部</text>
            <text>(共{{ playlist.trackCount }}首)</text>
          </view>
          <!-- 列表 -->
          <view class="list-music-item" v-for="(item, index) in playlist.tracks" :key="item.id" @tap="handleToDetail(item.id)">
            <view class="list-music-top">{{ index + 1 }}</view>
            <view class="list-music-info">
              <view class="name">{{ item.name }}</view>
              <view class="img">
                <image src="../../static/SQ.png" mode=""></image>
                <image src="../../static/dujia.png" mode=""></image>
                {{ item.ar[0].name }} - {{ item.name }}
              </view>
            </view>
            <text class="iconfont icon-bofang"></text>
          </view>
        </view>
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
import { list } from '@/common/api.js';
export default {
  data() {
    return {
      playlist: {
        creator: {
          avatarUrl: ''
        },
        coverImgUrl:''
      },
      // 用于判断是否 SQ 独家
      privileges: [],
      isLoading: true
    };
  },
  methods: {
    handleToDetail(id){
      uni.navigateTo({
        url: '/pages/detail/detail?id=' + id ,
      })
    }
  },
  onLoad(options) {
    uni.showLoading({
      title: '加载中'
    });
    list(options.id).then(res => {
      if (res[1].data.code === 200) {
        this.playlist = res[1].data.playlist;
        // 存储到store中
        this.$store.commit('INIT_TOPLISTIDS',res[1].data.playlist.trackIds)
        this.privileges = res[1].data.privileges;
        this.isLoading = false;
        uni.hideLoading()
      }
    });
  },
  components: {
    musichead
  }
};
</script>

<style lang="less" scoped>
.list-head {
  display: flex;
  margin: 30px;
  .list-head-img {
    position: relative;
    width: 264rpx;
    height: 264rpx;
    border-radius: 30rpx;
    overflow: hidden;
    margin-right: 42rpx;
    image {
      width: 100%;
      height: 100%;
    }
    text {
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      font-size: 26rpx;
      color: white;
    }
  }
  .list-head-text {
    flex: 1;
    color: #f0f2f7;
    .first {
      color: white;
      font-size: 34rpx;
    }
    .second {
      display: flex;
      margin: 20rpx 0;
      font-size: 24rpx;
      align-items: center;
      image {
        width: 54rpx;
        height: 54rpx;
        border-radius: 50%;
        margin-right: 14rpx;
      }
    }
    .third {
      line-height: 34rpx;
      font-size: 22rpx;
    }
  }
}
.list-share {
  width: 330rpx;
  height: 74rpx;
  border-radius: 37rpx;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  color: white;
  text-align: center;
  line-height: 74rpx;
  font-size: 28rpx;
  text {
    margin-right: 16rpx;
  }
}
.list-music {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 30rpx;
  margin-top: 40rpx;
  overflow: hidden;
  .list-music-head {
    height: 50rpx;
    margin: 30rpx 0 70rpx 22rpx;
    .iconfont {
      height: 50rpx;
      font-size: 50rpx;
    }
    text:nth-child(2) {
      font-size: 30rpx;
      margin: 0 10rpx 0 26rpx;
    }
    text:nth-child(3) {
      font-size: 26rpx;
      color: #b2b2b2;
    }
  }
  .list-music-item {
    display: flex;
    margin: 0 32rpx 66rpx 46rpx;
    align-items: center;
    color: #959595;
    .list-music-top {
      width: 58rpx;
      font-size: 30rpx;
      line-height: 30rpx;
    }
    .list-music-info {
      flex: 1;
      .name {
        font-size: 28rpx;
        color: black;
        width: 70vw;
        // 不换行
        white-space: nowrap;
        overflow: hidden;
        // 省略号
        text-overflow: ellipsis;
      }
      .img {
        font-size: 25rpx;

        width: 70vw;
        // 不换行
        white-space: nowrap;
        overflow: hidden;
        // 省略号
        text-overflow: ellipsis;
        image:nth-child(1) {
          width: 40rpx;
          height: 23rpx;
          margin-right: 3rpx;
        }
        image:nth-child(2) {
          width: 40rpx;
          height: 23rpx;
          margin-right: 5rpx;
        }
      }
    }
    text {
      font-size: 50rpx;
      color: #c7c7c7;
    }
  }
}

.text {
}
</style>
