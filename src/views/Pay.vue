<template>
  <div class="pay">
     
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="onClickback"
    />
    <div v-if="isPay">
        <div class="pay_content">
      <div class="AdressManage">
        <div class="selectAdress" @click="currenSeletAddress()">
          选择地址
          <van-icon name="arrow" size="14px" />
        </div>
        <div class="contactInfo">
          <van-address-list
            :list="currentAddress"
            default-tag-text="默认"
            :switchable="false"
            add-button-text="立即结算"
            @add="ProductCalc"
          />
        </div>
        
      </div>
      <OrderList infoTitleLeft="订单信息" :allCount="otherInfo.allCount" :allPrice="otherInfo.allPrice">
        <OrderItem v-for="(item,index) in productInfo" :key="index" :item="item"></OrderItem>
       
      </OrderList>
      <van-popup
        v-model="isPopup"
        closeable
        position="bottom"
        :style="{ height: '30%' }"
      >
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          disabled-text=""
          default-tag-text="默认"
          @add="onAddAdress"
          @select="changeAddress"
        />
      </van-popup>
    </div>
     </div>
    <div v-if="!isPay">
          <van-empty description="暂无订单" />
        </div>
  </div>
</template>

<script>
import "../assets/less/pay.less";
import OrderList from "../components/OrderList";
import OrderItem from "../components/OrderItem";
export default {
  name: "Pay",
  components: {
    OrderList,
    OrderItem,
  },
  created() {
    this.sids = this.$route.query.sids.split("-");
    console.log(this.sids)
    this.getAddressList();
    this.getProductData();
  },
  data() {
    return {
      isPopup: false,
      //添加地址的列表
      list: [],
      //不可配送地址
      disabledList: [],
      //当前选择的地址
      chosenAddressId: "",
      //当前地址
      currentAddress: [],
      //当前的sids
      sids: [],
      //当前的购买产品
      productInfo:{},
      //产品的其他信息
      otherInfo:{},
      //当前订单页是否结算了
      isPay:''

     
    
      
    };
  },
  methods: {
    onClickback() {
      this.$router.go(-1);
    },

    onAddAdress() {
      this.$router.push({ name: "NewAddress" });
    },
    getAddressList() {
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let params = {
        tokenString,
        appkey,
      };
      this.getAxios(
        {
          method: "GET",
          url: "/findAddress",
          params,
        },

        (result) => {
        
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
           this.$toast(result.data.msg)
           return this.$router.push({ name: "Login" });
          } 
          else if(result.data.code==20000){
            let data = result.data.result;
        
          data.map((v) => {
            v.isDefault = Boolean(v.isDefault);
            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
            if (v.isDefault) {
              this.chosenAddressId = v.id;
              this.currentAddress[0] = v;
            }
          });
          this.list = data;
          }
        
        }
      );
    },
    changeAddress(item) {
      this.chosenAddressId = item.id;
      this.isPopup = false;
      this.currentAddress[0] = item;
    },
    currenSeletAddress() {
      this.isPopup = true;
    },
    ProductCalc() {
    if(this.currentAddress.length==0){
      return this.$toast('请先选择地址')
    }
     if(this.currentAddress.length>0){
       this.$dialog.confirm({
        title: '确认订单',
        message: '是否立即结算?',
        confirmButtonColor: '#0C34BA'
      }).then(()=>{

      let currentAddress=this.currentAddress
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;
      let sids=JSON.stringify(this.sids)
      let phone=currentAddress[0].tel
      let address=currentAddress[0].address
      let receiver=currentAddress[0].name

      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let data = {
        tokenString,
        appkey,
        sids,
        phone,
        address,
        receiver
      };
      this.getAxios(
        {
          method: "POST",
          url: "/pay",
          data,
        },
        (result) => {
        console.log(result)
        if(result.data.code==700){
          this.$toast(result.data.msg)
          return this.$router.push('Login')
        }else if(result.data.code==60000){
         this.$router.push({name:'Order'})
        }
        
         this.$toast(result.data.msg)
          
        }
      );
      })
     }

     
    },
    getProductData() {
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;
      let sids=JSON.stringify(this.sids)
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let params = {
        tokenString,
        appkey,
        sids
      };
      this.getAxios(
        {
          method: "GET",
          url: "/commitShopcart",
          params,
        },
        (result) => {
         console.log("commitShopcart==>",result)
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
           this.$toast(result.data.msg)
           return this.$router.push({ name: "Login" });
          } 
          else if(result.data.code==50000){
           if(result.data.result.length){
              this.isPay=true
           }
           else{
              this.isPay=false
           }
          console.log(this.isPay)
            let productInfo=result.data.result
            let otherInfo=this.otherInfo
            let allPrice=0
            let allCount=0
            productInfo.map(v=>{
               allPrice+=v.count*v.price
               allCount+=v.count
            })
           otherInfo.allPrice=allPrice+".00"
           otherInfo.allCount=allCount+""
           otherInfo.isCommit=false
          this.productInfo=productInfo
          console.log("otherInfo==>",this.otherInfo)
         }
         
          
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
</style>