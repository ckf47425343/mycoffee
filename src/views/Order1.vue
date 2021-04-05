<template>
  <div class="order">
  
  
      <div v-if="!isHas">
        <van-tabs
          v-model="tabIndex"
          color="#0C34BA"
          title-active-color="#0C34BA"
          line-height="2"
          :before-change="beforeChange"
        >
          

        </van-tabs>
      </div>
      <div v-else>
        <van-empty description="没有订单数据" />
      </div>
    
  </div>
</template>

<script>
import "../assets/less/order.less";
import BgBox from "../components/BgBox.vue";
import OrderList from "../components/OrderList.vue";
import OrderItem from "../components/OrderItem.vue";
import Vue from 'vue';
import { Tab, Tabs } from 'vant';

Vue.use(Tab);
Vue.use(Tabs);
export default {
  name: "Order",
  data() {
    return {
      test: "2020-02-12T06:09:25.000Z",

      //激活tab标签的下标
      tabIndex: 0,

      tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],

      //订单商品数据
      orderData: [],

      //全部没有订单数据
      isHas: true
    };
  },

  components: {
    BgBox,
    OrderList,
    OrderItem,
  },

  created() {
    //根据订单状态获取订单数据
   return
    this.getOrderDataByStatus();
  },

  methods: {
    beforeChange(index) {
      // 返回 false 表示阻止此次切换
      if (index === 1) {
        return false;
      }

      // 返回 Promise 来执行异步逻辑
      return new Promise((resolve) => {
        // 在 resolve 函数中返回 true 或 false
        resolve(index !== 3);
      });
    },
  
    
    //返回上一级
    back() {
      this.$router.go(-1);
    },

    //切换订单状态 0: 全部, 1: 进行中, 2: 已完成
    changeTab(name, title) {
      
      

      

      //根据订单状态获取订单数据
      this.getOrderDataByStatus();
    },

    //根据订单状态获取订单数据
    getOrderDataByStatus() {
      let tokenString = localStorage.getItem("__tk");
      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
     this.getAxios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: this.tabIndex,
        },
     },(result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 70000) {

            //如果全部没有订单数据，则移除tab
            if (this.tabIndex == 0 && result.data.result.length == 0) {
              this.isHas = false;
              return;
            }

            //按照订单编号oid进行分类

            let orderDatas = [];
            result.data.result.map((v) => {
              //查找orderDatas的订单数据，如果找到，则将该商品存放在当前订单里面，累加当前订单的商品数量和当前订单的总金额
              for (let i = 0; i < orderDatas.length; i++) {
                if (orderDatas[i].oid == v.oid) {
                  orderDatas[i].data.push(v);
                  orderDatas[i].count += v.count;
                  orderDatas[i].total += v.count * v.price;
                  return;
                }
              }

              //如果找不到当前订单数据，则初始化当前订单数据
              let o = {};
              o.oid = v.oid;
              o.count = v.count;
              o.total = v.count * v.price;
              o.status = v.status;
              o.date = v.createdAt;
              o.data = [v];
              orderDatas.push(o);

              

            });

            this.orderData = orderDatas.reverse();
            console.log(this.orderData)
          }
        })
        
    },

    //确认收货
    confirmReceive(item, index) {
      
      let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

     

      this.getAxios({
        method: "POST",
        url: "/receive",
        data:{
          appkey: this.appkey,
          tokenString,
          oid: item.oid
        },
      },(result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 80000) {
            if (this.tabIndex == 1) {
              this.orderData.splice(index, 1);
            }
            item.status = 2;
          }

          this.$toast(result.data.msg);
        })
        
        

      
    },

    //删除订单
    removeOrder(oid, index) {
      

      let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

     

      this.getAxios({
        method: "POST",
        url: "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid
        },
      }, (result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 90000) {
            this.orderData.splice(index, 1);
          }

          this.$toast(result.data.msg);
        })
       
       

      
    },
  },
};
</script>