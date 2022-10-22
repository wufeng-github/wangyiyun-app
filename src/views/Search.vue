<template>
  <div class="searchTop">
    <svg class="icon" aria-hidden="true" @click="$router.go(-1)">
      <use xlink:href="#icon-zuojiantou"></use>
    </svg>
    <input
      type="text"
      placeholder="陈奕迅"
      v-model="searchKey"
      @keydown.enter="enterKey"
    />
  </div>
  <div class="searchHistory">
    <span class="searchSpan">历史</span>
    <span
      v-for="item in keyWorldList"
      :key="item"
      class="spanKey"
      @click="searchHistory(item)"
    >
      {{ item }}
    </span>
    <svg class="icon" aria-hidden="true" @click="delHistory">
      <use xlink:href="#icon-shanchu"></use>
    </svg>
  </div>
     <div class="itemList">
      <div class="item" v-for="(item, i) in searchList" :key="i">
        <div class="itemLeft" @click="updateIndex(item)">
          <span class="leftSpan">{{ i + 1 }}</span>
          <div>
            <p>{{ item.name }}</p>
            <span v-for="(item1, index) in item.artists" :key="index">{{
              item1.name
            }}</span>
          </div>
        </div>
        <div class="itemRight">
          <svg class="icon bofang" aria-hidden="true" v-if='item.mvid !=0'>
            <use xlink:href="#icon-shipin"></use>
          </svg>
          <svg class="icon liebiao" aria-hidden="true">
            <use xlink:href="#icon-31liebiao"></use>
          </svg>
        </div>
      </div>
    </div>
</template>
<script>
import { getSearchMusic } from "@/request/api/home.js";
export default {
  data() {
    return {
      keyWorldList: [], //历史记录列表
      searchKey: "",  //输入的内容
      searchList: [],
    };
  },
  mounted() {
    // 重新赋值历史记录，赋值的时候，需要判断，如果keyWorldList有值，就让它为本身，如果没值，也就是删除掉了，就让它为一个空数组
    this.keyWorldList = JSON.parse(localStorage.getItem("keyWorldList"))
      ? JSON.parse(localStorage.getItem("keyWorldList"))
      : [];
  },
  methods: {
    enterKey: async function () {
      if (this.searchKey !== "") {
        this.keyWorldList.unshift(this.searchKey);//添加历史记录到数组的最前面
        // Set数组去重，再通过扩展运算符(将可迭代对象转换为逗号分隔的参数系列)，再用[]包裹起来变成数组
        this.keyWorldList = [...new Set(this.keyWorldList)];
        // 固定长度
        if (this.keyWorldList.length > 10) { //大于10个记录，删除最后一个
          this.keyWorldList.splice(this.keyWorldList.length - 1, 1);
        }
        localStorage.setItem("keyWorldList", JSON.stringify(this.keyWorldList));
        let res = await getSearchMusic(this.searchKey);
        // console.log(res);
        this.searchList = res.data.result.songs;
        this.searchKey = ""; //回车之后让输入框清空
      }
    },
    delHistory: function () {
      localStorage.removeItem("keyWorldList");//删除localStorage里的历史记录
      this.keyWorldList = [];//本身的keyWorldList里的历史记录
    },
    // 点击历史记录也可以搜索
    searchHistory:async function (item) {
      let res = await getSearchMusic(item);
    //   console.log(res);
      this.searchList = res.data.result.songs;
    },
    // 点击播放
    updateIndex:function(item){
        item.al=item.album
        item.al.picUrl=item.album.artist.img1v1Url
        this.$store.commit("pushPlayList",item)
        this.$store.commit("updatePlayListIndex",this.$store.state.playList.length-1)
        
    }
  },
};
</script>
<style lang="less" scoped>
.searchTop {
  width: 100%;
  height: 1rem;
  padding: 0 0.2rem;
  display: flex;
  align-items: center;
  input {
    margin-left: 0.2rem;
    border: none; // 先把边框全部清掉，再给一个底部边框
    border-bottom: 1px solid #999;
    width: 90%;
    padding: 0.1rem;
  }
}
.searchHistory {
  width: 100%;
  padding: 0.2rem;
  position: relative;
  .searchSpan {
    font-weight: 700;
  }
  .spanKey {
    padding: 0.1rem 0.2rem;
    background-color: rgb(185, 169, 169);
    border-radius: 0.4rem;
    margin: 0.1rem 0.2rem;
    display: inline-block;
  }
  .icon {
    width: 0.3rem;
    height: 0.3rem;
    position: absolute;
    right: 0.2rem;
  }
}
 .itemList {
    width: 100%;
    padding: .2rem;
    .item {
      width: 100%;
      height: 1.4rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .itemLeft {
        width: 85%;
        height: 100%;
        display: flex;
        align-items: center;
        .leftSpan {
          display: inline-block;
          width: 0.2rem;
          text-align: center;
        }
        div {
          p {
            width: 4.54rem;
            height: .4rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-weight: 700;
          }
          span{
            font-weight: 400;
            font-size: .24rem;
            color: #999;
          }
          margin-left: 0.3rem;
        }
      }
      .itemRight{
        width: 20%;
        height: 100%;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        position: relative;
        .icon{
          fill: #999;
        }
         .bofang{
            position: absolute;
            left: 0;
          }
         .liebiao{
            position: absolute;
            right: 0;
          }
      }
    }
  }
</style>