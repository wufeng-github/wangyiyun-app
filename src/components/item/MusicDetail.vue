<template>
  <img :src="musicList.al.picUrl" alt="" class="bgimg" />
  <div class="detailTop">
    <div class="detailTopLeft">
      <svg class="icon liebiao" aria-hidden="true" @click="backHome">
        <use xlink:href="#icon-zuojiantou"></use>
      </svg>
      <div class="leftMarquee">
        <Vue3Marquee style="color: #fff">{{ musicList.al.name }}</Vue3Marquee>
        <span v-for="item in musicList.ar" :key="item">
          {{ item.name }}
        </span>
        <svg class="icon liebiao" aria-hidden="true">
          <use xlink:href="#icon-youjiantou1"></use>
        </svg>
      </div>
    </div>
    <div class="detailTopRight">
      <svg class="icon liebiao" aria-hidden="true">
        <use xlink:href="#icon-fenxiang"></use>
      </svg>
    </div>
  </div>
  <!-- 为!isLyricShow显示磁盘 -->
  <div class="detailContent" v-show="!isLyricShow">
    <!-- 中间部分动态样式 -->
    <img src="@/assets/needle-ab.png" alt="" class="img_needle" :class="{ img_needle_active: !isbtnShow }" />
    <img src="@/assets/cd.png" alt="" class="img_cd" />
    <img :src="musicList.al.picUrl" alt="" class="img_ar" @click="isLyricShow = true" :class="{ img_ar_active: !isbtnShow, img_ar_pauesd: isbtnShow }" />
  </div>
  <!-- 歌词显示、滚动 -->
  <div class="musicLyric" ref="musicLyric" v-show="isLyricShow">
    <!-- 当前时间 currentTime * 1000 转换为秒，如果当前时间>=自身的时间 并且当前时间<下一首歌词的时间，同时成立才可以让样式显示出来 -->
    <p v-for="item in lyric" :key="item" :class="{ active: currentTime * 1000 >= item.time && currentTime * 1000 < item.pre,}">
      {{ item.lrc }}
    </p>
  </div>
  <div class="detailFooter">
    <div class="footerTop">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-aixin"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-iconfontzhizuobiaozhun023146"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-yinlechangpian"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-iconfontzhizuobiaozhun023110"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-liebiao-"></use>
      </svg>
    </div>
    <div class="footerContent">
      <!-- 进度条input的type设为range  audio里的属性duration，代表这首歌的总时长  currentTime代表这首歌的当前时长  -->
      <!-- 用v-model绑定currentTime，蓝色的进度点，会随着我们绑定的currentTime而改变，移动，一次移动多少通过step设置 -->
      <input type="range" class="range" min="0" :max="duration" v-model="currentTime" step="0.05">
    </div>
    <div class="footer">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-xunhuan"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @click="goPlay(-1)">
        <use xlink:href="#icon-shangyishoushangyige"></use>
      </svg>
      <svg class="icon bofang" aria-hidden="true" v-if="isbtnShow" @click="play">
        <use xlink:href="#icon-bofang1"></use>
      </svg>
      <svg class="icon bofang" aria-hidden="true" v-else @click="play">
        <use xlink:href="#icon-zanting"></use>
      </svg>
      <svg class="icon" aria-hidden="true" @click="goPlay(1)">
        <use xlink:href="#icon-xiayigexiayishou"></use>
      </svg>
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-zu"></use>
      </svg>
    </div>
  </div>
</template>
<script>
import { Vue3Marquee } from "vue3-marquee";
import "vue3-marquee/dist/style.css";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      isLyricShow: false, // 是否显示歌词，为true显示歌词
    };
  },
  computed: {
    // 解构出仓库里的state里的数据，拿到变化后的最新的数据
    ...mapState([
      "lyricList",
      "currentTime",
      "playListIndex",
      "playList",
      "duration",
    ]),
    lyric: function () {
      let arr;
      if (this.lyricList.lyric) {
        //把所有歌词字符串进行切割，打印可以看到，可以以换行进行切割，每一行作为数组里的一个元素，再对数组里的每一个元素切割，只要最后一部分
        arr = this.lyricList.lyric.split(/[(\r\n)\r\n]+/).map((item, i) => {
          // 切割时间，分，秒，毫秒  slice()切割包头不包尾
          let min = item.slice(1, 3);
          let sec = item.slice(4, 6);
          let mill = item.slice(7, 10);
          // 切割歌词
          let lrc = item.slice(11, item.length);
          // 计算总时间并转为毫秒
          let time =
            parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill);
          // 毫秒那一部分处理，可能有]，还需要做一个判断，判断获取的毫秒是不是数字，看能不能转为数字，如果不能转说明它里面包含了]
          if (isNaN(Number(mill))) {
            //如果毫秒转为了NaN，不是数字，那就切割到9，
            mill = item.slice(7, 9);
            lrc = item.slice(10, item.length); //歌词切割就需要往前再进一位
            time =
              parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + parseInt(mill);
          }
          // console.log(min,sec,Number(mill),lrc);
          return { min, sec, mill, lrc, time };
        });
        // 循环需要拿到元素和下标
        arr.forEach((item, i) => {
          // 如果到了最后一句(i=== arr.length - 1 || 如果拿到的下一句的time是一个isNaN)就不要再去拿下一首歌的时间了，就给个大一点的默认值，让它的样式显示到结束
          if (i === arr.length - 1 || isNaN(arr[i + 1].time)) {
            item.pre = 100000; // 如果是最后一句，就给它添加一个属性pre,如果没有就会添加，如果有，就会覆盖
          } else {
            item.pre = arr[i + 1].time; //如果没有到最后一句，就赋值下一首歌的时间给item.pre
          }
        });
      }
      // console.log(arr);
      return arr;
    },
  },
  mounted() {
    // console.log(this.musicList);
    // console.log(this.lyricList.lyric);
    this.addDuration(); //调用父组件传过来的添加总时长的方法
  },
  props: ["musicList", "isbtnShow", "play", "addDuration"], //接收父组件传过来的属性，函数都可以
  methods: {
    backHome: function () {
      this.isLyricShow = false; // 让isLyricShow恢复为false，左箭头返回出去之后，再点击进来还会显示磁盘
      this.updateDetailShow();
    },
    // 上一首、下一首的切换
    goPlay: function (num) {
      let index = this.playListIndex + num; //上一首，下标减 1，下一首，下标加 1
      //如果播放的歌曲到达了第一首，下标为0，那么再点击上一首，index = 0-1 = -1，数组里面没有，所以我们让它回到最末尾的那一首，让它形成一个循环
      if (index < 0) {
        index = this.playList.length - 1; // 赋值最后一首的下标
      } else if (index == this.playList.length) {
        // 同理，播放的歌曲到达了最后一首，再点击下一首，我们让它回到第一首，让它形成一个循环
        index = 0;
      }
      this.updatePlayListIndex(index); //调用仓库里的updatePlayListIndex并传值改变playListIndex(下标)
    },
    // 解构出仓库里的mutations方法，在这个组件里使用，更改仓库里的数据
    ...mapMutations(["updateDetailShow", "updatePlayListIndex"]),
  },
  watch: {
    currentTime: function (newValue) {  //newValue拿到currentTime的新的值
      // 拿到有颜色变化的p标签
      let p = document.querySelector("p.active");
      // console.log([p]);  加一个[]才可以看到里面的引用信息
      if (p) {
        //拿到了p之后，再去进行判断
        if (p.offsetTop > 300) {
          // 如果offsetTop > 300，就让scrollTop(滚动条距离顶部的距离)滚动距离为offsetTop - 300，不要让它往下走了，一直保持在这个位置
          this.$refs.musicLyric.scrollTop = p.offsetTop - 300;
        }
      }
      // 如果currentTime的新的值===duration总时长
      if (newValue === this.duration) {
        if (this.playListIndex === this.playList.length - 1) { //如果为最后一首，就让它回到第一首
          this.updatePlayListIndex(0);
          this.play();  // 刚刚刷新是默认列表，playListIndex和playList没有变，如果为最后一首，它不会回到第一首，还需要手动调用一下play()方法
        } else { //不是最后一首，播放下一首
          this.updatePlayListIndex(this.playListIndex + 1);
        }
      }
      // console.log([this.$refs.musicLyric])
    },
  },
  components: {
    Vue3Marquee,
  },
};
</script>
<style lang="less" scoped>
.bgimg {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  filter: blur(70px);
}
.detailTop {
  width: 100%;
  height: 1rem;
  display: flex;
  padding: 0.2rem;
  justify-content: space-between;
  align-items: center;
  fill: #fff;
  .detailTopLeft {
    display: flex;
    align-items: center;
    .leftMarquee {
      width: 3rem;
      height: 100%;
      margin-left: 0.4rem;
      span {
        color: #999;
      }
      .icon {
        width: 0.3rem;
        height: 0.3rem;
        fill: #999;
      }
    }
  }
}
.detailContent {
  width: 100%;
  height: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .img_needle {
    width: 2rem;
    height: 3rem;
    position: absolute;
    left: 46%;
    transform-origin: 0 0;
    transform: rotate(-13deg);
    transition: all 2s;
  }
  .img_needle_active {
    width: 2rem;
    height: 3rem;
    position: absolute;
    left: 46%;
    transform-origin: 0 0;
    transform: rotate(0deg);
    transition: all 2s;
  }

  .img_cd {
    width: 5rem;
    height: 5rem;
    position: absolute;
    bottom: 2.3rem;
    z-index: -1;
  }
  .img_ar {
    width: 3.2rem;
    height: 3.2rem;
    border-radius: 50%;
    position: absolute;
    bottom: 3.14rem;
    animation: rotate_ar 10s linear infinite;
  }
  // 控制动画启动和暂停
  .img_ar_active {
    animation-play-state: running;
  }
  .img_ar_pauesd {
    animation-play-state: paused;
  }
  // 磁盘旋转
  @keyframes rotate_ar {
    0% {
      transform: rotateZ(0deg);
    }
    100% {
      transform: rotateZ(360deg);
    }
  }
}
.musicLyric {
  width: 100%;
  height: 7.92rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.16rem;
  overflow: scroll;
  p {
    color: rgb(190, 181, 181);
    margin-bottom: 0.3rem;
  }
  .active {
    color: #fff;
    font-size: 0.5rem;
  }
}
.detailFooter {
  width: 100%;
  height: 3rem;
  position: absolute;
  bottom: 0.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .footerTop {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      width: 0.36rem;
      height: 0.36rem;
      fill: rgb(245, 234, 234);
    }
    .icon {
      width: 0.6rem;
      height: 0.6rem;
    }
  }
  .range {
    width: 100%;
    height: 0.06rem;
  }
  .footer {
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      fill: rgb(245, 234, 234);
    }
    .bofang {
      width: 1rem;
      height: 1rem;
    }
  }
}
</style>