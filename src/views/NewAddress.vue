<template>
  <div class="new-address">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <van-address-edit
      :area-list="areaList"
      show-postal
      
      show-set-default
      :address-info="addAdressInfo"
      :show-delete="!!aid"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="savaAdress"
      @delete="deleteAdress"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/area";

export default {
  name: "NewAddress",

  data() {
    return {
      areaList,
      isShowdelete: false,
      //地址aid
      aid: "",
      //添加的地址信息
      addAdressInfo: {},
    };
  },

  created() {
    //获取aid
    this.aid = this.$route.query.aid;

    if (this.aid) {
      console.log("this.aid==>", this.aid);
      this.getAdressAidInfo();
    }
  },

  methods: {
    //返回上一级
    back() {
      this.$router.go(-1);
    },
    //保存地址地址
    savaAdress(content) {
      //获取token
      let tokenString = localStorage.getItem("__tk");
      //把content拷贝
      let addAdressInfo = Object.assign({}, content);
      //获取appkey
      let appkey = this.appkey;
      //检验是否登录
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      addAdressInfo.tokenString = tokenString;
      addAdressInfo.appkey = appkey;
      addAdressInfo.isDefault = Number(addAdressInfo.isDefault);
      let option
      if (this.aid) {
        addAdressInfo.aid = this.aid;
          option = {
          method: "POST",
          url: "/editAddress",
          data: addAdressInfo,
        };
      } else {
          option = {
          method: "POST",
          url: "/addAddress",
          data: addAdressInfo,
        };
      }
      this.getAxios(option, (result) => {
        console.log("result==>", result);

        if (result.data.code == 700) {
          this.$router.push({ name: "Login" });
        } else if (result.data.code == 9000 || result.data.code == 30000) {
          this.$router.push({ name:"Address"});
        }

        this.$toast(result.data.msg);
      });
    },

    deleteAdress(content) {
      
      let tokenString = localStorage.getItem("__tk");
      let appkey = this.appkey;
      let aid = this.aid;
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }
      let removeAdressInfo = {
        tokenString,
        appkey,
        aid,
      };
      this.getAxios(
        {
          method: "POST",
          url: "/deleteAddress",
          data: removeAdressInfo,
        },
        (result) => {
        
          if(result.data.code==10000){
            this.$toast(result.data.msg)
            return this.$router.push({name:'Address'})
          }
        }
      );
    },
    getAdressAidInfo() {
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
        aid,
      };
      this.getAxios(
        {
          method: "GET",
          url: "/findAddressByAid",
          params,
        },
        (result) => {
          console.log("result==>", result);
         
          if (result.data.code == 700) {
            this.$toast(result.data.msg);
            return this.$router.push({ name: "Login" });
          }
          if (result.data.code == 40000) {
            
            let data = result.data.result[0];
            if(!data){
             
              return
            }
            data.isDefault = Boolean(data.isDefault);
            this.addAdressInfo = data;
          }
        }
      );
      },
  },
};
</script>

<style lang="less" scoped>
.new-address {
  padding-top: 46px;
  /deep/ .van-nav-bar .van-icon {
    color: #0c34ba;
  }

  /deep/ .van-nav-bar__text {
    color: #0c34ba;
  }

  /deep/ .van-button--danger {
    background-color: #0c34ba;
    border-color: #0c34ba;
  }

  /deep/ .van-switch--on {
    background-color: #0c34ba;
  }
}
</style>