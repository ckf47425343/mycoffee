
项目环境搭建

  凡是修改配置文件的，都需要重启服务器

  vant框架配置
    01
      Vue 2 项目，安装 Vant 2.x 版本：
      cnpm i vant -S

    02
      自动按需引入组件 (推荐)
      babel-plugin-import 是一款 babel 插件，它会在编译过程中将 import 的写法自动转换为按需引入的方式。
      cnpm i babel-plugin-import -D

      然后在项目根目录下写入以下代码
        module.exports = {
          presets: [
            '@vue/cli-plugin-babel/preset'
          ],
          plugins: [
            ['import', {
              libraryName: 'vant',
              libraryDirectory: 'es',
              style: true
            }, 'vant']
          ]
        }


   03
      在main.js导入vant的组件
      import { Button } from 'vant'

   04 
      在main.js注册vant的组件
      Vue.use(Button)

  
  rem适配
    01
      postcss-pxtorem 是一款 postcss 插件，用于将单位转化为 rem
      cnpm i postcss-pxtorem -D

    02
      lib-flexible 用于设置 rem 基准值
      cnpm i lib-flexible -D

    03
      在根目录创建postcss.config.js文件，然后写入以下代码
        module.exports = {
          plugins: {
            autoprefixer: {
              browsers: ['Android >= 4.0', 'iOS >= 8'],
            },
            'postcss-pxtorem': {
              rootValue: 37.5,
              propList: ['*'],
            },
          },
        };

  04
    在main.js导入lib-flexible.js
    import 'lib-flexible/flexible'

  布局时需要在iphone6标准屏幕布局
  如果写px单位，px会自动转换为rem
  也就可以直接写rem单位


  01-安装vue ajax方案
    cnpm i axios vue-axios --save

  02-在main.js引入
    import axios from 'axios'
    import VueAxios from 'vue-axios'

    Vue.use(VueAxios, axios)


  axios拦截器
    在发起请求之前，先执行拦截器



 --mian路由
  

1.登录login
  -输入格式拦截
  -登录成功,获取token值.用localStorage保存
   场景:
       1.成功登录
       2.登录账号或者密码错误
2.注册register
  -注册格式拦截
  场景:
       1.注册成功
       2.手机已经注册
3.主页main
   设置二级路由
4.home首页
  1.获取热卖商品数据
  
    轮播图展示商品--->
    
    处理数据:缓加载数据
5.menu菜单页
  1.分类切换列表
  2.按照商品分类获取商品

6.shopbag购物袋
  1.编辑购物袋，
  场景：
  token错误,重新登录
  获取购物袋成功
    


    
  
    
     
    
       