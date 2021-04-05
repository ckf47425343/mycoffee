<template>
  <div class="home">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="home-content">
    
      
      
      <!-- 商品 -->
     
        
       
         
          <div class="header">
           <div class="banner-box">
           <div> 
        <van-swipe @change="changeCurrentIndex" :autoplay="5000" loop>
          <van-swipe-item v-for="(item, index) in bannerData" :key="index">
            <img
              class="auto-img"
              :src="item.bannerImg"
              alt=""
              @click="goDetail(item.pid)"
            />
         
          </van-swipe-item>
          
          <template #indicator>
            <div class="index-box">
              <div
                :class="{ active: index == currentIndex }"
                v-for="(item, index) in bannerData"
                :key="index"
              ></div>
            </div>
          </template>
        </van-swipe>
         </div>
         </div> 
          </div>
          
        <van-list
        v-model="loading"
         fixed
        :finished="finished"
        finished-text="没有更多了"
        @load="loadData"
        
        offset="30"
      >
        <div class="product-box">
          <div>
            <div class="clearfix pro-title-box">
              <span class="pro-title">热卖推荐</span>
            </div>
            
            <div class="products clearfix">
              <div
                class="pro-item fl"
                v-for="(item, index) in currentLoadProduct"
                :key="index"
                @click="goDetail(item.pid)"
              >
                <div class="img-box">
                  <img class="auto-img" :src="item.smallImg" />
                  <!-- hot标签 -->
                  <div class="hot">hot</div>
                </div>
                <div class="pro-info">
                  <div class="pro-name one-text">{{ item.name }}</div>
                  <div class="pro-enname one-text">{{ item.enname }}</div>
                  <div class="pro-price">￥{{ item.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
       </van-list>
          
       
     
        </div>
    </van-pull-refresh>
    <van-nav-bar>
      <template #left>
        <div class="home-login " @click="goLogin()">
          <div class="t1">下午好,</div>
          <div class="t2 one-text">{{NickName}}</div>
        </div>
      </template>
      <template #right>
        <div class="home-search" >
          <van-search placeholder="输入商品名称" @click="goSearch()" />
        </div>
      </template>
              </van-nav-bar>
  <!-- <PullBox>
     <template #s1 > -->
     
     <!-- </template>
      </PullBox> -->
  
  </div>
</template>

<script>
import "../assets/less/home.less";
import  PullBox  from "../components/PullBox.vue"
export default {
  name: "Home",
   components:{
     PullBox
    },
  data() {
    return {
      //是否刷新
      isLoading: false,
      //呢称
      NickName:'请先登录',
      //当前轮播图片索引
      currentIndex: 0,

      //轮播数据
      bannerData: [],

      //热卖商品数据
      hotProduct: [],
      //每次加载商品数量
      currentCount: 4,
      //开始加载商品的索引
      startLoadIndex: 0,
      //当前加载的商品
      currentLoadProduct: [],
      //所有商品
      allProduct: [],
      loading: true,
      finished: false,
      isLoad:true
    };
  },

  created() {
    //获取呢称
    this.getMyName()
    //获取轮播图数据
    this.getBannerData();

    //获取热卖推荐商品
    this.getHotProduct();
    
  },

  methods: {
    //刷新
     onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
        this.$router.go(0)
        console.log(this.isLoading)
      },500);
    },
    //请先登录
    goLogin(){
      
      this.$router.push({name:'Login'})
    },
    //修改轮播图片索引
    changeCurrentIndex(index) {
      this.currentIndex = index;
    },
    //获取名字
    getMyName(){
     let tokenString=localStorage.getItem("__tk")
     let appkey=this.appkey
     this.getAxios({
       method:'GET',
       url:'/findMy',
       params:{
        tokenString,
        appkey
       }       
     },result=>{
      if(result.data.code=='A001'){
        this.NickName=result.data.result[0].nickName
      }
     })
    
    },
    goSearch(){
     this.$router.push({name:'Search'})

    },
    //获取轮播图数据
    getBannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/banner",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();

          console.log("result ==> ", result);

          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          console.log("err ==> ", err);
        });
    },

    //获取热卖推荐商品
    getHotProduct() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //发起注册请求
      this.axios({
        //请求类型
        method: "GET",
        //请求路径
        url: "/typeProducts",

        //GET请求参数, object
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((result) => {
          this.$toast.clear();

          console.log("result ==> ", result);

          if (result.data.code == 500) {
            this.allProduct = result.data.result;


            this.currentLoadProduct = this.allProduct.slice(
              this.startLoadIndex,
              this.currentCount
            );
            this.startLoadIndex+=this.currentCount;
            console.log("currentLoadProduct==>", this.currentLoadProduct);
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();

          console.log("err ==> ", err);
        });
    },
    //缓加载
    loadData() {
      console.log("数据没有更新");
      // 异步更新数据
      let currentLoadProduct = this.currentLoadProduct;
      let allProduct = this.allProduct;
      setTimeout(() => {
        let newdata = allProduct.slice(
          this.startLoadIndex,
          this.startLoadIndex+this.currentCount
        );
        console.log("newdata==>",newdata)
        this.startLoadIndex+=this.currentCount;
        currentLoadProduct.push(...newdata);
        console.log("currentLoadProduct==>", currentLoadProduct);
        if (newdata.length <this.currentCount) {
          this.finished = true;
        }else{
          this.loading=false
        }
      },500);
    },
    //查看商品详情页面
    goDetail(pid) {
      this.$router.push({ name: "Detail", params: { pid } });
    },
  },
};
</script>