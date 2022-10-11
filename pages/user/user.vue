<template>
  <view>
    <view class="user-title">简约个人中心</view>
    <view v-for="(item,index) in savelist" :key="item.id">
      {{ item.ar[0].name }} - {{ item.name }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      savelist:[]
    };
  },
  methods: {},
  onLoad(){
    this.savelist = this.$store.state.savelist
    console.log(this.$store.state.savelist)
  }
};
</script>

<style>
.user-title {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  padding: 0 auto;
  line-height: 100px;
}
</style>
