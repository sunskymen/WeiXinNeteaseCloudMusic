<template>
  <view class="music-head" :style="{ color:color }">
    <view class="music-head-icon" v-if="icon" :class="{ 'music-head-iconblack' : iconblack}">
      <text class="iconfont icon-zuojiantou" @tap="handleToBack"></text> |     <text class="iconfont icon-shouye" @tap="handleToHome"></text>
    </view>
    {{ title }}
  </view>
</template>

<script>
  export default {
    name:"musichead",
    props:['title', 'icon', 'color', 'iconblack'],
    data() {
      return {
        
      };
    },
    methods:{
      handleToBack(){
        uni.navigateBack()
      },
      handleToHome(){
        uni.navigateTo({
          url:'/pages/index/index'
        })
      }
    }
  }
</script>

<style scoped>
  .music-head {
    position: relative;
    padding-top: 40rpx;
    width: 100%;
    height: 55px;
    font-size: 16px;
    line-height: 80px;
    text-align: center;
    color: black;
    
  }
  .music-head-icon {
    position: absolute;
    left: 8px;
    top: 42px;
    width: 90px;
    height: 31px;
    line-height: 31px;
    background-color: rgba(0,0,0,0.4);
    color: white;
    border-radius: 31px;
    display: flex;
    justify-content: space-evenly;
  }
  .music-head-iconblack {
    color: black;
    border: 1px solid #eaeaea;
    background-color: white;
  }
</style>