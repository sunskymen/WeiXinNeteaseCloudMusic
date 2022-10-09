<template>
  <view class="start">
    <view class="box">
      <view class="g-container">
        <view class="g-first"></view>
        <view class="g-ball"></view>
        <view class="g-ball"></view>
        <view class="g-ball"></view>
        <view class="g-ball"></view>
        <view class="g-ball"></view>
        <view class="g-ball"></view>
        <view class="g-ball"></view>
      </view>
    </view>

    <view class="main"><span :class="{ active: show == true }">Click OK to start emo</span></view>
    <button @tap="handleStart" class="active buttom">START</button>
    <button @tap="handleToIndex" :class="{ active: show == true }">This is OK</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      width: '20px',
    };
  },
  methods: {
    handleToIndex() {
      uni.navigateTo({
        url: '/pages/index/index'
      });
    },
    handleStart() {
      this.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>
$count: 7;
@keyframes breath {
  from {
    transform: scale(1);
    color: white;
    opacity:1;
  }
  to {
    transform: scale(1.1);
    color: hotpink;
    opacity: 0.5;
  }
}
.active {
  animation: breath 2s linear infinite alternate;
}
.start {
  width: 100%;
  height: 1000px;
  background-color: pink;
}
.box {
  display: flex;
  padding-top: 1px;
  filter: blur(1px) contrast(8);
  width: 100%;
}
.g-container {
    margin: auto;
    position: relative;
    width: 10vmin;
    height: 10vmin;
}

.g-ball,
.g-first{
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    border-radius: 50%;
    transform: translate(-700%, 0);
    opacity: 0;
    // animation: move 3s infinite linear;
}

@for $i from 0 through $count { 
    .g-ball:nth-child(#{$i}) {
        animation: move 3.5s infinite #{$i * 0.2 + 0.1}s linear;
    }
}

.g-first {
    animation: scaleMove 3.5s infinite linear;
}

@keyframes move {
    25% {
        opacity: 1;
        transform: translate(-1vw, 0);
    }
    50% {
        opacity: 1;
        transform: translate(1vw, 0);
    }
    75%,
    100% {
        opacity: 0;
        transform: translate(700%, 0);
    }
}


@keyframes scaleMove {
    25% {
        opacity: 1;
        transform: translate(-1vw, 0);
    }
    35% {
        opacity: 1;
        transform: scale(1);
    }
    70% {
        opacity: 1;
        transform: translate(1vw, 0) scale(2);
    }
    90%,
    100% {
        opacity: 0;
        transform: translate(1vw, 0) scale(1);
    }
}
button {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  text-align: center;
  line-height: 150px;
  background-color: #fff;
  color: pink;
}
.buttom {
  margin-bottom: 200px;
}
.main {
  width: 100%;
  height: 200px;
  padding-top: 170px;
  display: flex;
  justify-content: center;
  align-items: center;
}
span {
  display: inline-block;
  width: 21ch;
  font: bold 200% Consolas, Monaco, monospace; /*Monospaced font*/
  color: white;
  font-size: 25px;
  overflow: hidden;
  white-space: nowrap;
  font-weight: 500;
  border-right: 1px solid transparent;
  animation: typing 5s steps(21), caret 0.5s steps(1) infinite;
}
@keyframes typing {
  from {
    width: 0px;
  }
}
@keyframes caret {
  50% {
    border-right-color: currentColor;
  }
}
</style>
