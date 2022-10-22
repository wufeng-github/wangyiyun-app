<template>
  <router-view/>
  <!-- 底部组件是一个全局组件 -->
  <FooterMusic v-show="$store.state.isFooterMusic"/>
</template>
<script>
import FooterMusic from "@/components/item/FooterMusic.vue"
export default {
  components:{
    FooterMusic
  }
}
</script>
<style lang="less">
*{
  margin: 0;
  padding: 0;
  // 设置为怪异盒子，这样设置padding就不会撑开盒子
  box-sizing: border-box;
}
.icon{
  width: .5rem;
  height: .5rem;
}
a{
  color: black;
}
</style>
