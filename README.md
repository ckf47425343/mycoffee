项目环境搭建

凡是修改配置文件的，都需要重启服务器

vant 框架配置
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
在 main.js 导入 vant 的组件
import { Button } from 'vant'

04
在 main.js 注册 vant 的组件
Vue.use(Button)

rem 适配
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
在 main.js 导入 lib-flexible.js
import 'lib-flexible/flexible'

布局时需要在 iphone6 标准屏幕布局
如果写 px 单位，px 会自动转换为 rem
也就可以直接写 rem 单位

01-安装 vue ajax 方案
cnpm i axios vue-axios --save

02-在 main.js 引入
import axios from 'axios'
import VueAxios from 'vue-axios'

    Vue.use(VueAxios, axios)

axios 拦截器
在发起请求之前，先执行拦截器
全局配置请求时携带 cookie
axios.defaults.withCredentials = true

配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

````

```txt
vue-cookies

参考链接 https://www.jianshu.com/p/60c13168cc8f

安装
npm i vue-cookies --save

使用
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

设置cookie
过期时间以秒为单位
this.$cookies.set(键名, 值, 过期时间)

````

vscode 当前项目全局匹配 ctrl+shift+f

比如删除所有

全局匹配语句

使用正则匹配
console.log\(.\*\);?

vue-cli4 打包

1、删除路由的 hisotry 模式
2、保证 vue 项目没有任何 vue 抛出的警告或者错误
3、去除所有语句
4、在根目录下创建 vue.config.js, 写入 module.exports = {publicPath: './'}

````

```txt
安装sublime text3
ctrl+shift+p，输入 install package control, 然后回车

通过package control安装插件
ctrl+shift+p, 输入install, 选择 package control: install packge

等待加载插件仓库后，输入安装的插件名称

````

# 0C34BA 主题色

# 646566 灰色

--mian 路由

1.登录 login -输入格式拦截 -登录成功,获取 token 值.用 localStorage 保存
场景: 1.成功登录 2.登录账号或者密码错误 2.注册 register -注册格式拦截
场景: 1.注册成功 2.手机已经注册 3.主页 main
设置二级路由
4.home 首页 1.获取热卖商品数据

    轮播图展示商品--->

    处理数据:缓加载数据

5.menu 菜单页 1.分类切换列表 2.按照商品分类获取商品

6.shopbag 购物袋 1.编辑购物袋，
场景：
token 错误,重新登录
获取购物袋成功
