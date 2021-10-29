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
      <div class="list-box">
        <ul
          class="list"
          v-for="(item, index) in productDatas"
          ref="refUls"
          :key="index"
          :class="{'last-list':index==(productType.length-1)}"
        >
          <li
            class="list-item"
            v-for="(t, i) in item.result"
            :key="i"
            ref="refLis"
          >
            <div class="click-box" :data-pid="t.pid"></div>
            <div class="left-box">
              <img src="../assets/images/default.png" :data-src="t.smallImg" :data-pid="t.pid" alt="" />
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
  </div>
</template>

<script>
import '@/assets/less/home.less';
import { getBanner,getProductType, getTypeProduct } from '@/api/api.js';
import {debounce} from  '@/utils/index.js'


export default {
  name: 'Home',
  data() {
    return {
      //获取商品类型
      productType: [],
      //商品数据
      productDatas: [],
      //商品遍历的索引值
      savaIndex:0,
      //侧边栏的索引值
      currentMenuIndex: 0,
      //当前的currentUlIndex
      ulElementIndex:0,
      //轮播图
      bannerData: [],
      //计算内部盒子的高度
      listHeight:0,
      //初始阀值
     isInitVal:true,
     //缓存ul元素的信息
     ulCache:{},
    //缓存li元素的信息
     liCache:{},
     //请求阀值
     isfetch:true
    }
  },

  created() {
    //获取轮播图数据
    this.getBannerData()
    //获取商品类型
    this.getProductType()

    this.debounce=debounce(this.getTypeProducts,200,true)
    
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
    //根据类型获取商品
    getTypeProducts() {
            
            
      
             let key = 'type', appkey = this.appkey;
                  

               if(this.savaIndex>=this.productType.length){
                 this.isfetch=false
                   return
               }

            let index=this.savaIndex
               

           let value= this.productType[index].type

           getTypeProduct({value,key,appkey}).then(result=>{
               
           

              this.productDatas.push(result.data)
            

                this.getImgEle()


              
                 
           })
        

     
  
    

        
    
    },
    //更新完后获取dom信息
    getImgEle(callBack) {
      this.$nextTick(() => {
    
          let len= this.productDatas.length

          this.box = this.$refs.content

          this.boxHeight = this.box.offsetHeight


        for(let index=this.ulElementIndex;index<len;index++){
           let ul= this.box.getElementsByTagName('ul')[index]

           this.imgs = ul.getElementsByTagName('img')

           this.ulElementIndex=len

             let li=ul.children[1]
     
           this.HeightVal =li.offsetHeight
      
           
     
           this.MarginVal=Math.ceil(getComputedStyle(li,null).getPropertyValue('margin-top').slice(0,-2))
           
          
         //初始化listHeight
           this.cacheEleInfo(index)

           
        if(this.isInitVal){
           this.isInitVal=false

        

           this.handleScroll({ target: this.box })
        } 
       }

          // 执行回调
       if(callBack){
         callBack()
       }
     
      })
    },
    //获取列表的offsetHeight,offsetTop信息
    cacheEleInfo(currentIndex) {
      //计算每个ul的offsetTop,以及offsetHeight
      
      

      let height = parseInt(this.HeightVal),spacing = parseInt(this.MarginVal);
           
      let offsetHeight = 0,len = 0;
      
      
    //计算每个li元素的offsetHeight,offsetTop
     
     this.productDatas[currentIndex].result.forEach((item,index)=>{
        if(!this.liCache.hasOwnProperty(item.pid)){
       
          this.liCache[item.pid] = { offsetHeight:height, offsetTop:this.listHeight }
       
     
          this.listHeight=height+spacing+this.listHeight
      
           
        }
     })

     if(currentIndex==0){
       this.listHeight=this.listHeight-spacing
     }
  
     if(!this.ulCache.hasOwnProperty(currentIndex)){
   
     
         len = this.productDatas[currentIndex].result.length
        
        
        
      
        offsetHeight =len*(height+spacing)-spacing

        this.ulCache[currentIndex] = {
          offsetHeight,
          offsetTop:this.listHeight-offsetHeight
        }
     
 
      }

      this.savaIndex=this.productDatas.length
      
      
      
        
      console.dir('imgs==>',this.imgs)
      //获取缓存img元素
      Array.from(this.imgs).forEach((item, index) => {
           
        let pid = item.dataset.pid
        let src = item.dataset.src
        if (pid) {
          this.liCache[pid].node = item
          this.liCache[pid].imgSrc = src
        }
      })

      
    },
    
    //跳转到详情页
    asideScroll(e) {
      e.stopPropagation()
    },
    //切换菜单
    ToggleMenu(e) {
   

      let index = e?parseInt(e.target.dataset.index):this.savaIndex

      

     if(index<this.savaIndex){

        this.currentMenuIndex = index

        this.box.scrollTop = this.ulCache[index].offsetTop
         
         return
     }
     
      this.isfetch=false

       let prArr=[] 

       let key = 'type', appkey = this.appkey,value='';

       

     for(let t=this.savaIndex;t<=index;t++){
         
          value=this.productType[t].type
          
         prArr.push(getTypeProduct({key,appkey,value}))   
     }

     

     Promise.all(prArr).then(result=>{
    
        result.map((v,i)=>{
             this.productDatas.push(v.data)
        })
       this.getImgEle(()=>{
          
                   this.box.scrollTop=this.ulCache[this.savaIndex-1].offsetTop
                   this.isfetch=true

            
             })

   
            
        
        
      
       
     })

     
      
    },
    //触发滚动
    handleScroll(e) {
    
  
      
      let scrollTop = e.target.scrollTop 
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
    //  加载显示区图片
      let liObj = this.liCache

      for (let key in liObj) {
        if (
          liObj[key].offsetTop >= scrollTop - 100 &&
          liObj[key].offsetTop < scrollTop + this.boxHeight
        ) {

          liObj[key].node.src = liObj[key].imgSrc

          delete liObj[key]
        }
      }
      
     //触底
      if(scrollTop+this.boxHeight*1.5>=this.listHeight&&this.isfetch){
       
       
        this.debounce()
          //即将触底
          //拉取数据
         
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
          if (result.data.code == 300) {
            this.bannerData = result.data.result
          }
        })
        .catch((err) => {
          this.$toast.clear()


        })
    },

  },

  mounted() {
  },
  updated() {
    
  },
}
</script>
<style >

</style>
