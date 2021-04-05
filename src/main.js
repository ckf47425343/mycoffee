import Vue from 'vue'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

//导入rem适配文件
import 'lib-flexible/flexible'

//从vant框架导入Button组件
import {
  Button,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe,
  SwipeItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Empty,
  SwipeCell,
  Checkbox,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Icon,
  Dialog,
  Tab,
  Tabs,
  Cell,
  Uploader,
  PullRefresh
} from 'vant'

//注册Button组件
Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Empty)
  .use(SwipeCell)
  .use(Checkbox)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(Cell)
  .use(Uploader)
  .use(PullRefresh)
  


//设置Vue原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
//Vue添加方法
Vue.prototype.getAxios=function(option,callback){
    //启动加载提示
    this.$toast.loading({
      //文本提示
      message: '加载中...',
      //禁止穿透点击
      forbidClick: true,
      //提示时间, 0: 没有时间限制
      duration: 0
    });

  let axiosData={}
  for(let  key in option){
   axiosData[key]=option[key]
  }
  this.axios(axiosData).then(
   result=>{
     //关闭加载提示
     this.$toast.clear();
     callback(result)
      return
   }
  ).catch(err=>{
  //关闭加载提示
   this.$toast.clear();
      console.log(err)
  })
}
//配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002';

//axios拦截器，在发起请求之前执行
axios.interceptors.request.use(config => {

  //处理post请求参数, 进行参数序列化
  if (config.method == 'post') {

    //序列化post请求参数
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }

    //重新赋值config.data
    config.data = paramsString.slice(0, -1);

    // console.log('config.data ==> ', config.data);

  }

  //必须返回config
  return config;
})
//定义全局过滤器
//保留小数
Vue.filter('decimal', (v, n = 2) => {
  return v.toFixed(n);
})

//格式化日期
Vue.filter('formatDate', (v, format) => {

  // 
  // 

  //创建日期对象
  let date = new Date(v);

  //格式化年份
  let year = date.getFullYear().toString();
  // 
  if (/(y+)/.test(format)){
    //获取匹配组的内容
    var content = RegExp.$1;
    // 
    format = format.replace(content, year.slice(year.length - content.length));
  }

  // 

  //格式化月份、日份、时、分、秒
  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  // 

  for (let key in o) {
    //创建动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // 

    if (reg.test(format)) {
      //获取组匹配的内容
      let groupContent = RegExp.$1;
      // 

      format = format.replace(groupContent, o[key] >= 10 ? o[key] : groupContent.length == 2 ? '0' + o[key] : o[key]);
      // 
    }
    
  }

  return format;
})
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
