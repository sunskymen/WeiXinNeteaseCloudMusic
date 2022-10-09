<template>
  <view class="detail">
    <view class="fixbg" :style="{ backgroundImage: 'url(' + songDetail.al.picUrl + ')' }"></view>
    <musichead :title="songDetail.name" :icon="true" color="white"></musichead>

    <view class="container" v-show="!isLoading">
      <scroll-view scroll-y="true">
        <!-- 点击播放 -->
        <view class="detail-play" @tap="handleToPlay">
          <image :src="songDetail.al.picUrl" :class="{ 'detail-play-run': isplayRotate }" mode=""></image>
          <text class="iconfont" :class="iconPlay"></text>
          <!-- 指针图片 -->
          <view :class="{avtive:isplayRotate,stop:!isplayRotate}"></view>
        </view>
        <!-- 歌词 -->
        <view class="detail-lyric">
          <view class="detail-lyric-wrap" :style="{ transform: 'translateY(' + -(lyricIndex - 1) * 82 + 'rpx)' }">
            <view class="detail-lyric-item" :class="{ active: lyricIndex == index }" v-for="(item, index) in songLyric" :key="index">{{ item.lyric }}</view>
          </view>
        </view>
        <!-- like -->
        <view class="detail-like">
          <view class="detail-like-head">喜欢这首歌的人也听</view>
          <view class="detail-like-item" v-for="(item, index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
            <view class="detail-like-img"><image :src="item.album.picUrl" mode=""></image></view>
            <view class="detail-like-song">
              <view>{{ item.name }}</view>
              <view>
                <!-- v-if="item.privilege.flag>60&&item.privilege.flag<70" -->
                <image src="../../static/dujia.png" mode=""></image>
                <!-- v-if="item.privilege.maxbr == 999000" -->
                <image src="../../static/SQ.png" mode=""></image>
                {{ item.album.artists[0].name }} - {{ item.name }}
              </view>
            </view>
            <!-- 播放按钮 -->
            <text class="iconfont icon-bofang"></text>
          </view>
        </view>
        <!-- 评论 -->
        <view class="detail-comment">
          <view class="detail-comment-head">精彩评论</view>
          <view v-for="(item, index) in songComment" :key="index" class="detail-comment-item">
            <view class="detail-comment-img"><image :src="item.user.avatarUrl" mode=""></image></view>
            <!-- 右 -->
            <view class="detail-comment-content">
              <!-- 上 -->
              <view class="detail-comment-title">
                <view class="detail-comment-name">
                  <view>{{ item.user.nickname }}</view>
                  <view>{{ item.time | formatTime }}</view>
                </view>
                <!-- 点赞 -->
                <view class="detail-comment-like">
                  {{ item.likedCount | formatCount }}
                  <text class="iconfont icon-icon"></text>
                </view>
              </view>
              <!-- 下 -->
              <view class="detail-comment-text">{{ item.content }}</view>
            </view>
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
// 引入接口
import { songDetail, songUrl, songSimi, songComment, songLyric } from '@/common/api.js';
export default {
  data() {
    return {
      songDetail: {
        al: {
          picUrl: ''
        }
      },
      songSimi: [],
      songComment: [],
      songLyric: [],
      lyricIndex: 0,
      iconPlay: 'icon-zanting',
      isplayRotate: true,
      isLoading: true
    };
  },
  methods: {
    // 封装api获取数据方法
    getMusic(id) {
      // store 存储下一个 id
      this.$store.commit('NEXT_ID', id);
      uni.showLoading({
        title: '加载中'
      });
      this.isLoading = true;

      Promise.all([songDetail(id), songSimi(id), songComment(id), songLyric(id), songUrl(id)]).then(res => {
        if (res[0][1].data.code === 200) {
          this.songDetail = res[0][1].data.songs[0];
        }
        if (res[1][1].data.code === 200) {
          this.songSimi = res[1][1].data.songs;
        }
        if (res[2][1].data.code === 200) {
          this.songComment = res[2][1].data.hotComments;
        }
        if (res[3][1].data.code === 200) {
          // 歌词字符串
          let lyric = res[3][1].data.lrc.lyric;
          // 正则
          // console.log(lyric)
          let re = /\[([^\]]+)\]([^\[]+)/g;
          let result = [];
          lyric.replace(re, ($0, $1, $2) => {
            result.push({ time: this.formatTimeToSec($1), lyric: $2 });
          });
          this.songLyric = result;
        }
        if (res[4][1].data.code === 200) {
          // 适配微信小程序
          // #ifdef MP-WEIXIN
          // 创建背景音频管理器实例
          this.bgAudioManager = uni.getBackgroundAudioManager();
          this.bgAudioManager.title = this.songDetail.name;
          // #endif

          // 适配网页H5
          // #ifdef H5
          // 假如实例已经存在则跳过创建
          if (!this.bgAudioManager) {
            this.bgAudioManager = uni.createInnerAudioContext();
          }
          this.isplayRotate = false;
          this.iconPlay = 'icon-bofang1';
          // #endif

          this.bgAudioManager.src = res[4][1].data.data[0].url || '';
          this.listenLyricIndex();
          // 监听播放事件
          this.bgAudioManager.onPlay(() => {
            this.listenLyricIndex();
            this.iconPlay = 'icon-zanting';
            this.isplayRotate = true;
          });
          // 监听暂停事件
          this.bgAudioManager.onPause(() => {
            this.iconPlay = 'icon-bofang1';
            this.isplayRotate = false;
            this.cancelLyricIndex();
          });
          // 监听播放结束
          this.bgAudioManager.onEnded(() => {
            let nextId = this.$store.state.nextId;
            this.getMusic(nextId);
          });
        }
        // 加载完成
        this.isLoading = false;
        uni.hideLoading();
      });
    },
    // 封装时间转秒数
    formatTimeToSec(value) {
      let arr = value.split(':');
      return (Number(arr[0] * 60) + Number(arr[1])).toFixed(1);
    },
    // 播放暂停点击事件
    handleToPlay() {
      if (this.bgAudioManager.paused) {
        this.bgAudioManager.play();
      } else {
        this.bgAudioManager.pause();
        this.cancelLyricIndex();
      }
    },
    // 监听播放时间
    listenLyricIndex() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        for (let i = 0; i < this.songLyric.length; i++) {
          if (this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time) {
            this.lyricIndex = this.songLyric.length - 1;
            break;
          }
          if (this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i + 1].time) {
            this.lyricIndex = i;
          }
        }
      }, 500);
    },
    // 清除定时器的方法
    cancelLyricIndex() {
      clearInterval(this.timer);
    },
    // 点击跳转相似歌曲方法
    handleToSimi(id) {
      this.getMusic(id);
    }
  },
  onLoad(options) {
    // console.log(options.id);
    this.getMusic(options.id);
    // 清除歌词定时器
    this.cancelLyricIndex();
  },
  onUnload() {
    // 清除歌词定时器
    this.cancelLyricIndex();
    // #ifdef H5
    // 网页h5中销毁实例
    this.bgAudioManager.destroy();
    // #endif
  },
  // 隐藏时
  onHide() {
    // 清除歌词定时器
    this.cancelLyricIndex();
    // #ifdef H5
    // 网页h5中销毁实例
    this.bgAudioManager.destroy();
    // #endif
  },
  components: {
    musichead
  }
};
</script>

<style lang="less" scoped>
// 动画
@keyframes move {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes needleMove {
  from {
    transform: rotate(-20deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.detail-play {
  position: relative;
  width: 580rpx;
  height: 580rpx;
  background: url(~@/static/disc.png);
  background-size: cover;
  margin: 214rpx auto 0 auto;
  .detail-play-run {
    animation-play-state: running;
  }
  image {
    position: absolute;
    width: 370rpx;
    height: 370rpx;
    border-radius: 50%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    animation: 10s linear move infinite;
    animation-play-state: paused;
  }
  text {
    position: absolute;
    width: 100rpx;
    height: 100rpx;
    font-size: 100rpx;
    color: white;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  view {
    position: absolute;
    left: 100rpx;
    right: 0;
    top: -200rpx;
    margin: auto;
    width: 230rpx;
    height: 360rpx;
    background: url(~@/static/needle.png);
    background-size: cover;
    transform: rotate(-20deg);
    // 旋转的点
    transform-origin: 20px 0;
    // 指针动画指针动画指针动画指针动画
    animation: needleMove 1s linear both;
    // animation-play-state: running;
  }
}
.detail-lyric {
  font-size: 32rpx;
  line-height: 82rpx;
  height: 246rpx;
  text-align: center;
  overflow: hidden;
  color: #6f6e73;
  .detail-lyric-wrap {
    transition: 0.5s;
    .detail-lyric-item {
      line-height: 82rpx;
      &.active {
        color: white;
      }
    }
  }
}
.detail-like {
  margin: 0 30rpx;
  .detail-like-head {
    font-size: 36rpx;
    color: white;
    margin: 50rpx 0;
  }
  .detail-like-item {
    display: flex;
    align-items: center;
    margin-bottom: 28rpx;
    .detail-like-img {
      width: 82rpx;
      height: 82rpx;
      border-radius: 20rpx;
      overflow: hidden;
      margin-right: 20rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .detail-like-song {
      flex: 1;
      color: #c6c2bf;
      view:nth-child(1) {
        font-size: 28rpx;
        color: white;
        margin-bottom: 12rpx;
      }
      view:nth-child(2) {
        font-size: 22rpx;
      }
      image {
        width: 26rpx;
        height: 20rpx;
        margin-right: 10rpx;
      }
    }
    text {
      font-size: 50rpx;
      color: #c6c2bf;
    }
  }
}

.detail-comment {
  margin: 0 30rpx;
  .detail-comment-head {
    font-size: 36rpx;
    color: white;
    margin: 50rpx 0;
  }
  .detail-comment-item {
    display: flex;
    margin-bottom: 28rpx;
    .detail-comment-img {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 18rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .detail-comment-content {
      flex: 1;
      color: #cbcacf;
      .detail-comment-title {
        display: flex;
        justify-content: space-between;
        .detail-comment-name {
          view:nth-child(1) {
            font-size: 26rpx;
          }
          view:nth-child(2) {
            font-size: 20rpx;
          }
        }
        .detail-comment-like {
          font-size: 28rpx;
        }
      }
      .detail-comment-text {
        font-size: 28rpx;
        line-height: 40rpx;
        color: white;
        margin-top: 20rpx;
        border-bottom: 1px solid #cbcacf;
        padding-bottom: 40rpx;
      }
    }
  }
}

.test {
}
</style>
