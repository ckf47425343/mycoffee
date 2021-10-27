<template>
  <div class="account">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <BgBox>

  
        <div class="avatar-box">
          <div class="user-img ">
            <img class="auto-img" :src="accountInfo.userImg" alt="" />
            <van-uploader   accept="image/png, image/jpeg,image/jpg" class="upload-box" :after-read="uploadUserImg" />
          </div>
        </div>
         
        <van-field
          v-model="accountInfo.userId"
          disabled
          label="用户id:"
          placeholder="输入昵称"
          maxlength="12"
           input-align="left"
        />
          <van-field
          v-model="accountInfo.phone"
          label="用户手机:"
           disabled
           input-align="left"
        />
        <van-field
          v-model="accountInfo.nickName"
          label="用户呢称:"
          placeholder="输入昵称"
          maxlength="12"
           input-align="left"
        />
        <van-field
         type="textarea"
          v-model="accountInfo.desc"
          label="个人说明:"
          placeholder="请输入内容"
          maxlength="200"
           input-align="left"
        />

        <div style="margin: 16px;">
    <van-button round block type="primary" @click="updatePersonInfo">
      提交
    </van-button>
  </div>
    
     
    </BgBox>
  </div>
</template>

<script>


import "../assets/less/account.less";
import BgBox from "../components/BgBox.vue";
import {getAccountInfo,updateNickname,updatePersonDes,updateUserBg} from '@/api/api.js';
export default {
  name: "Account",
  components: {
    BgBox,
  },
  data() {
    return {
      //账户信息
      accountInfo: {
        nickName: '',
        desc: '',
        phone: '',
        userId: '',
        desc: ''
      },
      //上一个页面
      fullPath:''
      
    };
  },

 beforeRouteEnter (to, from, next) {
   next((vm)=>{
     vm.fullPath=from.fullPath
   })
 },

  created() {
    //获取个人资料
    this.getAccountInfo();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    //获取个人资料
    getAccountInfo() {
    
      
      let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
       
       getAccountInfo({
          appkey: this.appkey,
          tokenString,
        }).then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "B001") {
            let data = result.data.result[0];
            if (data.desc == '') {
              data.desc = '这家伙很懒，什么都没有留下！'
            } 
            this.accountInfo = data;

              let {nickName,desc}=this.accountInfo

              this.copyAcountInfo={nickName,desc}

           

          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });

        
    },

    //上传用户头像
    uploadUserImg(file) {
      // 
        //允许文件类型
        let type = ['gif', 'png', 'jpg', 'jpeg'];

        //允许最大文件大小 1MB
        let size = 1;

        //判断文件类型
        let fileType = file.file.type.split('/')[1];
        if (type.indexOf(fileType) === -1) {
          this.$toast(`文件类型只支持${type.join(',')}`);
          return;
        }

        //判断文件大小 B, 1024B = 1KB, 1024KB = 1MB
        let fileSize = file.file.size / 1024 / 1024;
        
        if (fileSize > size) {
          this.$toast(`文件允许最大不能超过${size}MB`);
          return;
        }

        //处理base64的标记data:image/jpeg;base64,
        let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, '');
        // 

        //发起请求
        let tokenString = localStorage.getItem("__tk");

      if (!tokenString) {
        //跳回登录页面
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            //token检验无效,则跳到登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 'H001') {
            this.accountInfo.userImg = result.data.userImg;
          }

          this.$toast(result.data.msg);

        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //修改昵称
    updatePersonInfo() {

      let  updateKey=[]

      if(this.accountInfo['nickName']==''){
         return  this.$toast('昵称不能为空')
      }
   
     for(let key in this.copyAcountInfo){
          
         if(this.accountInfo[key]!=this.copyAcountInfo[key]){
              updateKey.push(key)
         }
          
     }
     if(updateKey.length==0){
       return  this.$toast('请先修改信息')
     }

     //修改呢称

      let tokenString = localStorage.getItem("__tk");
      let appkey=this.appkey
      


    let arrRequest=updateKey.map((item,index)=>{
         
         
         if(item=='nickName'){ 
           return updateNickname({tokenString,appkey,nickName:this.accountInfo.nickName})
         }
         if(item=='desc'){
           return updatePersonDes({tokenString,appkey,desc:this.accountInfo.desc})
         }



     })
     
     if(arrRequest.length>0){
       this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
          Promise.all(arrRequest).then(result=>{
            console.log(result)
                 if(result.length>0){
                   let {nickName,desc}=this.accountInfo
                   this.copyAcountInfo={nickName,desc}
                   this.$toast.clear();
                   this.$toast('修改个人信息成功')
                   this.$router.replace(this.fullPath)
                 }
          }).catch(err=>{
              this.$toast.clear();
               this.$toast('修改个人信息失败')
          })
     }
     


     //修改个人信息



      

      // this.axios({
      //   method: "POST",
      //   url: "/updateNickName",
      //   data: {
      //     appkey: this.appkey,
      //     tokenString,
      //     nickName: this.accountInfo.nickName
      //   },
      // })
      //   .then((result) => {
      //     this.$toast.clear();
          
      //     if (result.data.code == 700) {
      //       //token检验无效,则跳到登录页面
      //       this.$router.push({ name: "Login" });
      //     } else {
      //       this.$toast(result.data.msg);
      //     }
          
      //   })
      //   .catch((err) => {
      //     this.$toast.clear();
          
      //   });
    },

    
  },
};
</script>

<style lang="less" scoped>
</style>