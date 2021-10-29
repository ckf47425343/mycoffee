<template>
  <div class="address">
    <van-nav-bar
      title="地址列表"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <BgBox>
      <van-address-list
        v-if="list.length>0"
        :list="list"
         default-tag-text="默认"
        :switchable="false"
        @add="add"
        @edit="edit"
      />
      <div v-else class="empty">
        <van-empty description="地址列表为空" />
      </div>
    </BgBox>
  </div>
</template>

<script>
   import '@/assets/less/address.less'
  import BgBox from '../components/BgBox.vue'
 import  {getAddress} from '@/api/api.js';
  export default {

    name:'Address',
    data() {
      return {
        list:[]
      }
    },
  components:{
    BgBox
  },
    created(){
      this.getAddressList()
    },

    methods: {
  //     ```txt
  // 查询地址接口
  // 请求地址：http://www.kangliuyong.com:10002/findAddress
  // 请求类型： GET
  // 请求参数： {
  //   appkey: 你的appkey,
  //   tokenString: token字符串
  // } 
      back(){
        this.$router.go(-1)
      },
       getAddressList(){
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;
      let aid = this.aid;
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let params = {
        tokenString,
        appkey,
      };
      getAddress(params).then((result) => {
          
          let data=result.data.result
          // let adress=dta
          data.map(v=>{
            v.isDefault=Boolean(v.isDefault)
            
            v.address=`${v.province}${v.city}${v.county}`
          })
          this.list=data
        })
     
       },
       add(){
       this.$router.push({name:'NewAddress'})
       },
       edit(item){
         this.$router.push({name:'NewAddress',query:{aid:item.aid}})
       },
       
    },
  }
</script>

// <style lang="less" scoped>
//   .address{
//     padding-top: 46px;
//     padding-bottom:60px ;

//      /deep/ .van-nav-bar .van-icon {
//         color: #0c34ba;
//       }

//       /deep/ .van-nav-bar__text {
//         color: #0c34ba;
//       }

//     /deep/ .van-tag--danger{
//       background-color: #0C34BA;
//     }

//     /deep/ .van-address-item .van-radio__icon--checked .van-icon{
//       background-color: #0C34BA;
//       border-color: #0C34BA;
//     }

//     /deep/ .van-address-list{
//       padding: 0;
//     }

//     /deep/ .van-address-item{
//       padding: 0 0 10px 0;
//       border-bottom: 1px solid #e8e8e8;
//       &:last-child{
//         border-bottom: none;
//       }
//     }

//     /deep/ .van-button--danger{
//       background-color: #0C34BA;
//       border-color: #0C34BA;
//     }
//   }
// </style>