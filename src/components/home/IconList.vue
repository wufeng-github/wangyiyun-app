<template>
  <div class="iconList">
    <div class="iconItem">
      <!-- 由于使用到了一些多色图标，所以要使用到svg，不会用可以选择Symbol类型，点击使用帮助，复制过来，替换相应图标的代码 -->
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-tuijian"></use>
      </svg>
      <span>每日推荐</span>
    </div>
    <div class="iconItem">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zhibo"></use>
      </svg>
      <span>私人FM</span>
    </div>
    <div class="iconItem">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-gedan"></use>
      </svg>
      <span>歌单</span>
    </div>
    <div class="iconItem">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-paihangbang"></use>
      </svg>
      <span>排行榜</span>
    </div>
  </div>
</template>
<style lang="less" scoped>
    .iconList{
        width: 100%;
        height: 2rem;
        margin-top: .2rem;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .iconItem{
            width: 25%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .icon{
                width: 1rem;
                height: 1rem;
            }
        }
    }
</style>