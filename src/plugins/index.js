// 写一个插件，把要在main.js中引入第三方库vant的组件进行集中管理
import { Swipe, SwipeItem,Button,Popup  } from 'vant';
// 把引入的组件放入数组中
let plugins=[
    Swipe,SwipeItem,Button,Popup 
]
export default function getVant(app){
    plugins.forEach((item)=>{
        return app.use(item)
    })
}
