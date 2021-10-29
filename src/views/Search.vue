<template>
  <div class="search">
    <van-nav-bar left-text="返回"   left-arrow fixed @click-left="back">
      <template #right>
        <div class="home-search">
        <van-search v-model="value" :clearable='isclearable'  @search='searchProudct'   @input='searchProudct'  placeholder="请输入搜索关键词" />
        </div>
      </template>
    </van-nav-bar>
     <BgBox>
      <div  v-if="products.length>0" class="clearfix">
        <div class="fl like-item" v-for="(item, index) in products" :key="index" @click="goDetail(item.pid)">
          <ProductItem :item="item"></ProductItem>
        </div>
      </div>
      <div>
        <div  v-if="products.length==0" class="empty">
          <van-empty description="暂无此类商品" />
        </div>
      </div>
    </BgBox>

  </div>
</template>

<script>
import '@/assets/less/search.less';
import BgBox from "../components/BgBox.vue";
import {debounce}    from   '@/utils/index.js';
import ProductItem from "../components/ProductItem.vue";
import {SearchProduct} from '@/api/api.js';
export default {
  name: "Search",

  components: {
    BgBox,
    ProductItem,
  },

  data() {
    return {
      //搜索商品关键字
       value: "",
       
      isclearable:true,

      //搜索商品数据
      products: [],

      myDebounce:''
    };
  },

  created() {

    

    //创建节流函数

   this.debounce=debounce(this.debounceSearch,500,false)

  },

  methods: {
    back() {
      this.$router.go(-1);
    },

  
    debounceSearch(){
       SearchProduct(
        {appkey: this.appkey,
          name: this.value,}
   ).then((result) => {
          if (result.data.code == "Q001") {
            this.products = result.data.result;
          } 
        })
        .catch((err) => {
            
        });
    },

    //搜索
   searchProudct() {
  
    this.debounce()
   
  
  
  },

      

     //查看商品详情
    goDetail(pid) {
      
      this.$router.push({name: 'Detail', params: {pid}});
    },
  }
};
</script>

