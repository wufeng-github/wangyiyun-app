function remSize() {
    //获取设备的宽度
    var deviceWidth = document.documentElement.clientWidth || window.innerWidth
    //一般设计稿是以750px来设计的，一般都是iphone
    if (deviceWidth >= 750) {
        deviceWidth = 750
    }
    if (deviceWidth <= 320) {
        deviceWidth = 320
    }
    //设置rem，1rem是等于html根元素设定的的fontSize的px值，这里fontSize需要用到驼峰命名法
    //750px-->1rem=100px，375px-->1rem=50px(本项目)
    document.documentElement.style.fontSize = (deviceWidth / 7.5) + 'px'
    //设置body的字体大小，字体大小要随着rem去改变，本项目开发时是iphone6/7/8模式，是375px，字体大小为15px
    document.querySelector('body').style.fontSize = 0.3 + "rem"
}

remSize();  // 调用这个函数

//当窗口发生变化时也要调用remSize()，用到window.onresize事件
window.onresize = function () {
    remSize();
}