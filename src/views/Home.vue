<template>
  <div class="home">
    <div class="header">
      <div class="search-box">
        <form action="/">
          <van-search
            placeholder="请输入搜索关键词"
            background="rgba(0, 0, 0, 0.3)"
            @search="onSearch"
            @cancel="onCancel"
            shape="round"
            @click-input="goSearch"
          />
        </form>
      </div>
      <div class="banner">
        <van-swipe :autoplay="5000" loop>
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img
              class="auto-img"
              :src="item.bannerImg"
              alt=""
              :data-pid="item.pid"
              @click="goDetail"
            />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <div class="main-area">
      <div class="aside" @scroll="asideScroll">
        <ul class="menu" @click="ToggleMenu">
          <li
            class="menu-item"
            :class="currentMenuIndex === index ? 'active' : ''"
            :data-index="index"
            v-for="(item, index) in productType"
            :key="index"
          >
            {{ item.typeDesc }}
          </li>
        </ul>
      </div>
      <div
        class="content"
        ref="content"
        @scroll="handleScroll"
        @click="goDetail"
      >
        <ul
          class="list"
          v-for="(item, index) in productDatas"
          ref="refUls"
          :key="index"
        >
          <li
            class="list-item"
            v-for="(t, i) in item.data.result"
            :key="i"
            ref="refLis"
          >
            <div class="click-box" :data-pid="t.pid"></div>
            <div class="left-box">
              <img src="" :data-src="t.smallImg" :data-pid="t.pid" alt="" />
            </div>
            <div class="right-box">
              <div class="name one-text">
                <span>{{ t.name }}</span>
                <span>({{ t.enname }})</span>
              </div>

              <div class="desc two-text">
                {{ t.desc }}
              </div>
              <div class="price-box">
                <span class="price title-color fw-blod">￥{{ t.price }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/less/home.less'
import { getBanner,getProductType, getTypeProduct } from '@/api/api.js'

export default {
  name: 'Home',
  data() {
    return {
      //获取商品类型
      productType: [],
      //商品数据
      productDatas: [],
      //侧边栏的索引值
      currentMenuIndex: 0,
      //轮播图
      bannerData: [],
    }
  },

  created() {
    //获取轮播图数据
    this.getBannerData()
    //获取商品类型
    this.getProductType()
  },

  methods: {
    //获取商品列表
    getProductType() {
      getProductType({ appkey: this.appkey }).then((result) => {
        this.productType = result.data.result
        //获取商品类型
        this.getTypeProducts()
      })
    },
    //更新完后获取dom信息
    init() {
      this.$nextTick(() => {
        this.box = this.$refs.content

        let li = this.box.getElementsByTagName('li')[0]

        this.imgs = this.box.getElementsByTagName('img')

        this.boxHeight = this.box.offsetHeight

        this.HeightVal = li.offsetHeight

        this.MarginVal = Math.ceil(
          getComputedStyle(li, null)
            .getPropertyValue('margin-top')
            .slice(0, -2)
        )

        this.getListItem()

        this.currentMenuIndex = 0

        this.handleScroll({ target: this.box })
      })
    },
    //获取列表的offsetHeight,offsetTop信息
    getListItem() {
      //计算每个ul的offsetTop,以及offsetHeight

      this.ulCache = {}
      this.liCache = {}

      let height = parseInt(this.HeightVal),
        spacing = parseInt(this.MarginVal)

      let offsetHeight = 0,
        offsetTop = 0,
        len = 0

      this.productDatas.forEach((item, index) => {
        len = item.data.result.length
        offsetTop += offsetHeight
        offsetHeight = len * (height + spacing)
        this.ulCache[index] = {
          offsetHeight,
          offsetTop,
        }
      })
      //重置数据
      ;(offsetTop = 0), (offsetHeight = 0)
      //计算每个li元素的offsetHeight,offsetTop
      this.productDatas.forEach((item, index) => {
        item.data.result.forEach((item, index) => {
          offsetTop += offsetHeight + spacing
          offsetHeight = height
          delete this.liCache[item.pid]
          this.liCache[item.pid] = { offsetHeight, offsetTop }
        })
      })

      //获取缓存img元素
      Array.from(this.imgs).forEach((item, index) => {
        console.log(item.dataset)
        let pid = item.dataset.pid
        let src = item.dataset.src
        if (pid) {
          this.liCache[pid].node = item
          this.liCache[pid].imgSrc = src
        }
      })

      console.log('liCache==>', this.liCache)
    },
    //根据类型获取商品
    getTypeProducts() {
      let key = 'type',
        appkey = this.appkey,
        value
      let arr = this.productType.map((item, index) => {
        value = item.type
        return getTypeProduct({ key, value, appkey })
      })
      Promise.all(arr).then((result) => {
        this.productDatas = result
    
        

        let offsetTop = 0,
          offsetHeight = 0

        this.init()
      })
    },
    //跳转到详情页
    asideScroll(e) {
      e.stopPropagation()
    },
    //切换菜单
    ToggleMenu(e) {
      let index = parseInt(e.target.dataset.index)
      this.currentMenuIndex = index
      this.box.scrollTop = this.ulCache[index].offsetTop
    },
    //触发滚动
    handleScroll(e) {
      let scrollTop = e.target.scrollTop + 50
      let currentKey = 0,
        topVal,
        bottomVal
      let obj = this.ulCache
      //目前的所在的选项
      for (let key in obj) {
        topVal = obj[key].offsetTop
        bottomVal = obj[key].offsetTop + obj[key].offsetHeight

        if (scrollTop >= topVal && scrollTop <= bottomVal) {
          this.currentMenuIndex = parseInt(key)
        }
      }
      //加载显示区图片
      let liObj = this.liCache

      for (let key in liObj) {
        if (
          liObj[key].offsetTop >= scrollTop - 100 &&
          liObj[key].offsetTop < scrollTop + this.boxHeight
        ) {
          console.log(liObj[key].node, liObj[key].imgSrc)

          liObj[key].node.src = liObj[key].imgSrc

          delete liObj[key]
        }
      }
    },
    //跳转到详情页
    goDetail(e) {
      let pid = e.target.dataset.pid
      if (pid) {
        this.$router.push({ path: '/detail/' + pid })
      }
    },
    //请先登录
    goLogin() {
      this.$router.push({ name: 'Login' })
    },
    onSearch() {},
    onCancel() {},
    goSearch() {
      this.$router.push({ name: 'Search' })
    },
    //获取轮播图数据
    getBannerData() {
      
      getBanner({appkey:this.appkey})
        .then((result) => {
          this.$toast.clear()

          console.log('result ==> ', result)

          if (result.data.code == 300) {
            this.bannerData = result.data.result
          }
        })
        .catch((err) => {
          this.$toast.clear()

          console.log('err ==> ', err)
        })
    },

    //获取热卖推荐商品
    getHotProduct() {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })

      //发起注册请求
      this.axios({
        //请求类型
        method: 'GET',
        //请求路径
        url: '/typeProducts',

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          key: 'isHot',
          value: 1,
        },
      })
        .then((result) => {
          this.$toast.clear()

          console.log('result ==> ', result)

          if (result.data.code == 500) {
            this.allProduct = result.data.result

            this.currentLoadProduct = this.allProduct.slice(
              this.startLoadIndex,
              this.currentCount
            )
            this.startLoadIndex += this.currentCount
            console.log('currentLoadProduct==>', this.currentLoadProduct)
            this.loading = false
          }
        })
        .catch((err) => {
          this.$toast.clear()

          console.log('err ==> ', err)
        })
    },
    //缓加载
    loadData() {
      console.log('数据没有更新')
      // 异步更新数据
      let currentLoadProduct = this.currentLoadProduct
      let allProduct = this.allProduct
      setTimeout(() => {
        let newdata = allProduct.slice(
          this.startLoadIndex,
          this.startLoadIndex + this.currentCount
        )
        console.log('newdata==>', newdata)
        this.startLoadIndex += this.currentCount
        currentLoadProduct.push(...newdata)
        console.log('currentLoadProduct==>', currentLoadProduct)
        if (newdata.length < this.currentCount) {
          this.finished = true
        } else {
          this.loading = false
        }
      }, 500)
    },
    //查看商品详情页面
    // goDetail(pid) {
    //   this.$router.push({ name: "Detail", params: { pid } });
    // },
  },

  watch: {
    liCache: {
      handler(oldVal, newVal) {
        console.log('watch==>', oldVal)
      },
    },
  },

  mounted() {
    //获取li元素的位置信息
    //获取li元素的图片元素
    // setTimeout(()=>{
    //    document.documentElement.scrollTop='1000'as
    // },1000)
  },
  updated() {
    console.log('update==>')
  },
}
</script>
<style >

</style>
