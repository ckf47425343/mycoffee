<template>
  <div class="detail">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="onClickBack"
    />
    <div class="show_Img" >
      <img :src="productDetail.large_img" class="auto-img" @click=" imagePreview" alt="" />
      <div class="title move">
        <div class="cn_name">{{ productDetail.name }}</div>
        <div class="en_name">{{ productDetail.enname }}</div>
      </div>
    </div>
    <div class="detail_Info">
      <div class="content">
        <div class="price">
          <div class="title">价格</div>
          <div>￥{{ productDetail.price }}</div>
        </div>
        <div class="Allrule">
          <div
            class="rule_item"
            v-for="(item, index) in productDetail.rules"
            :key="index"
          >
            <div class="title">
              {{ item.title }}
            </div>
            <div
              class="rule"
              :class="{ active: item.ruleIndex == i }"
              v-for="(t, i) in item.rule"
              :key="i"
              @click="selectRule(item, i)"
            >
              {{ t }}
            </div>
          </div>
        </div>
        <div class="count clearfix">
          <div class="title">商品数量</div>
          <van-stepper
            v-model="value"
            theme="round"
            button-size="22"
            disable-input
          />
        </div>
        <div class="desc">
          <div class="title">商品描述</div>
          <div
            class="desc_content"
            v-for="(item, index) in productDetail.desc"
            :key="index"
          >
            {{ index + 1 + "." + item }}
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_box" v-if="moveBag.isActive">
      <div :class="{ movebag: moveBag.isActive }">
        <img :src="moveBag.img" alt="" />
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-icon
        icon="bag"
        text="购物袋"
        :color="shopBagCount > 0 ? '#5f4121' : '#646566'"
        :badge="shopBagCount"
        @click="goShopBag"
      />
      <van-goods-action-icon
        icon="like"
        text="收藏"
        :color="isLike ? '#5f4121' : '#646566'"
        @click="likeProduct()"
      />
      <van-goods-action-button text="加入购物车" @click="addShopBag(false)" />
      <van-goods-action-button text="立即购买" @click="Buy(true)" />
    </van-goods-action>
  </div>
</template>

<script>
import "@/assets/less/detail.less";
import {getProductDetail,getShopCart,addShopCart,getLikeProduct,likeProduct,notLikeProduct} from '@/api/api.js'
import { ImagePreview } from 'vant';
export default {
  created() {
    this.getProductDetail();
    this.getShopCatCount();
    this.findlikeProduct();
  },
  data() {
    return {
      //商品的详情信息
      value: 1,
      //商品详情数据
      productDetail: {},

      imageView:[],
      //购物袋的数量
      shopBagCount: 0,
      //是否收藏
      isLike: false,
      //moveBag
      moveBag: {
        img: require("../assets/images/star.png"),
        isActive: false,
      },
    };
  },
  methods: {
    imagePreview(){
           
            ImagePreview({
             images:this.imageView,
             startPosition: 0,
});
    },
    getProductDetail() {
      let appkey = this.appkey;
      let pid = this.$route.params.pid;
     
         getProductDetail({appkey,pid}).then(result => {
          
          if (result.data.code == 600) {
            this.$toast(result.data.msg);
            let data = result.data.result[0];
            this.imageView.push(data.large_img)
            
            let productDetail = {};

            let r = ["sugar", "tem", "milk", "cream"];

            let o = [
              "large_img",
              "enname",
              "small_img",
              "name",
              "pid",
              "price",
            ];

            let desc = data.desc.split(/\n/);

            productDetail.desc = desc;
            o.map((v) => {
              productDetail[v] = data[v];
            });

            let rules = [];
            r.map((v) => {
              let ob = {};
              if (data[v].length > 0) {
                let rule = data[v].split("/");

                ob.title = data[v + "_desc"];
                ob.ruleIndex = 0;
                ob.rule = rule;
                rules.push(ob);
              }
            });
            productDetail.rules = rules;
            this.productDetail = productDetail;
            
            
          }
        }
      );
    },
    selectRule(item, index) {
      item.ruleIndex = index;
    },
    onClickBack() {
      this.$router.go(-1);
    },
    addShopBag(isBuy) {
      
      
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;
      let pid = this.$route.params.pid;
      let count = this.value;
      let rules = this.productDetail.rules;
      let rule = "";
      rules.map((v) => {
        rule += v.rule[v.ruleIndex] + "/";
      });
      rule = rule.slice(0, -1);
      let data = {
        tokenString,
        appkey,
        pid,
        count,
        rule,
      };
      
      addShopCart(data).then((result) => {
          
          if (result.data.code == 700) {
            this.$toast(result.data.msg);
            return this.$router.push({ name: "Login" });
          } else if (result.data.code == 3000) {
            
            if (isBuy) {
              this.$router.push({
                name: "Pay",
                query: { sids: result.data.sid },
              });
            } else {
              this.moveBag.isActive = true;
              setTimeout(() => {
                this.moveBag.isActive = false;
              }, 1000);
              this.getShopCatCount();
            }
          }

          this.$toast(result.data.msg);
        })
    },


    getShopCatCount() {
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;

    getShopCart({tokenString,appkey}).then((result) => {
      
          if (result.data.code == 700) {
            this.$toast(result.data.msg);
          
          } else if (result.data.code == 5000) {
            let data = result.data.result;
            this.shopBagCount = data.length;
          }
        })
     
        
      
    },
  likeProduct() {
    
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;
      let pid = this.$route.params.pid;
      let pm
    // if(!tokenString){
    //     return
    // }
   
     if(this.isLike){
      pm=notLikeProduct({tokenString,appkey,pid})
     }else{
      pm=likeProduct({tokenString,appkey,pid})
     }
     pm.then(result=>{
       
          if (result.data.code == 700) {
            return this.$router.push({ name: "Login" });
          } else if (result.data.code == 800) {
            this.isLike = true;
          } else if (result.data.code == 900) {
            this.isLike = false;
          }
     })
   
    },
    findlikeProduct() {
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;
      let pid = this.$route.params.pid;
      if (!tokenString) {
        return;
      }
      getLikeProduct({tokenString,
            appkey,
            pid}).then((result) => {
          
          if (result.data.result.length > 0) {
            this.isLike = true;
          } else {
            this.isLike = false;
          }
        })
   
    },
    goShopBag() {
      this.$router.push({ name: "Shopbag" });
    },
    Buy(isBuy) {
      this.addShopBag(isBuy);
    },
  },
};
</script>

<style lang="less" scoped>
</style>