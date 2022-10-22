<template>
  <div class="FooterMusic">
    <div class="footerLeft" @click="updateDetailShow">
      <img :src="playList[playListIndex].al.picUrl" alt="" />
      <div>
        <p>{{ playList[playListIndex].name }}</p>
        <span>横滑切换上下首哦</span>
      </div>
    </div>
    <div class="footerRight">
      <svg class="icon liebiao" aria-hidden="true" @click="play" v-if="isbtnShow">
        <use xlink:href="#icon-bofanganniu"></use>
      </svg>
      <svg class="icon liebiao" aria-hidden="true" @click="play" v-else>
        <use xlink:href="#icon-weibiaoti--"></use>
      </svg>
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-zu"></use>
      </svg>
    </div>
    <audio ref="audio" :src="`https://music.163.com/song/media/outer/url?id=${playList[playListIndex].id}.mp3`"></audio>
    <!-- 歌曲详情页弹出层Popup -->
    <van-popup v-model:show="detailShow" position="right" :style="{ height: '100%', width: '100%' }">
      <MusicDetail :musicList="playList[playListIndex]" :play="play" :isbtnShow="isbtnShow" :addDuration="addDuration" />
    </van-popup>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import MusicDetail from "@/components/item/MusicDetail.vue";
export default {
  data() {
    return {
      interVal: 0,
    };
  },
  computed: {
    // 解构出state中的数据，就可使用
    ...mapState(["playList", "playListIndex", "isbtnShow", "detailShow"]),
  },
  mounted() {
    // console.log(this.$refs);
    //触发getLyric函数，获取歌词
    this.$store.dispatch("getLyric", this.playList[this.playListIndex].id);
    this.updateTime(); //没有进入到歌词的时候，也需要去调用这个函数，也需要让歌词去滚动，因为当点击进来的时候，就要展示已经播放到的对应的歌词部分
  },
  updated() {
    //触发getLyric函数，获取歌词
    this.$store.dispatch("getLyric", this.playList[this.playListIndex].id);
    this.addDuration();  // 这个组件里也需要调用添加总时长方法，因为播放了如果没有进入详情页面滚动条也需要滚动
  },
  methods: {
    play: function () {
      // 判断音乐是否播放
      // paused已经暂停  play()播放   pause()暂停
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
        this.updateIsbtnShow(false);
        this.updateTime(); //播放时就调用函数进行传值
      } else {
        this.$refs.audio.pause();
        this.updateIsbtnShow(true);
        clearInterval(this.interVal); //暂停时就清除定时器
      }
    },
    // 添加总时长
    addDuration: function () {
      this.updateDuration(this.$refs.audio.duration);
    },
    // 这个函数updateTime(播放的时候才会触发)里面的定时器每隔1秒钟，就要触发updateCurrentTime这个函数，把当前的时间传递给vuex里的时间
    updateTime: function () {
      this.interVal = setInterval(() => {
        this.updateCurrentTime(this.$refs.audio.currentTime);
      }, 1000);
    },
    // 解构出mutations里的方法，就可使用
    ...mapMutations([
      "updateIsbtnShow",
      "updateDetailShow",
      "updateCurrentTime",
      "updateDuration",
    ]),
  },

  watch: {
    //监听store里的playListIndex小标有没有更改
    playListIndex: function () {
      //监听如果下标发生了改变，就自动播放音乐
      this.$refs.audio.autoplay = true;
      if (this.$refs.audio.paused) {
        //如果是暂停状态，改变图标
        this.updateIsbtnShow(false);
      }
    },
    //刷新页面，底部组件拿到的是默认值下标playListIndex为0的状态，是播放列表下标为0的这首歌，当点击第一首歌，发现不会播放，
    //因为我们监听的是下标，点击完，把歌曲列表传到播放列表里面下标为0，即第一首歌下标为0，拿到的是默认值也是下标为0，所以监听不到，因为下标没有发生改变，就不会去触发watch里面的代码
    //还需要监听播放列表，如果播放按钮处于暂停状态，应该播放出来，以及更改图标
    playList: function () {
      if (this.isbtnShow) {
        this.$refs.audio.autoplay = true;
        this.updateIsbtnShow(false);
      }
    },
  },
  components: {
    MusicDetail,
  },
};
</script>
<style lang="less" scoped>
.FooterMusic {
  width: 100%;
  height: 1.4rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  border-top: 1px solid #999;
  display: flex;
  padding: 0.2rem;
  justify-content: space-between;
  .footerLeft {
    width: 60%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
    }
  }
  .footerRight {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
}
</style>