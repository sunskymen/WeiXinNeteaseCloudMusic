<script>
export default {
  onLaunch: function() {},
  onShow: function() {},
  onHide: function() {},
  components:{
  }
};
</script>

<style>
/*每个页面公共css */
.icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
.container {
  width: 100%;
  height: calc(100vh - 75px);
  overflow: hidden;
}
.container scroll-view {
  height: 100%;
}
.fixbg {
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-size: cover;
  background-position: center 0;
  filter: blur(20px);
  transform: scale(1.2);
}
</style>
