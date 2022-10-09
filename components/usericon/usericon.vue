<template @tap="handleToUser">
  <view class="usericon" @tap="handleToUser">
    <!-- <iconfont name="icon-yonghu1" size="30" /> -->
    <text class="iconfont icon-yonghu1" @tap="handleToUser"></text>
  </view>
</template>

<script>
  export default {
    name:"usericon",
    data() {
      return {
        
      };
    },
    methods:{
      handleToUser(){
        uni.navigateTo({
          url: '/pages/user/user'
        })
      }
    }
  }
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
  text {
    width: 40px;
    height: 40px;
    font-size: 23px;
  }
}
</style>