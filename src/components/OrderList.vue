<template>
    <div class="orderlist">
     <div class="header  clearfix">
        <div class="info_title  fl">
             {{infoTitleLeft}}
        </div>
        <div class="fr re-info" v-if="isRight">
          <div v-if="!isReceive" @click="confirmReceive">确认收货</div>
          <div class="clearfix" v-else>
            <div class="fl">已完成</div>
            <div class="fl delete" @click="remove">
              <van-icon size="19" name="delete" />
            </div>
          </div>
        </div>
       </div> 
       <div class="content">
         <slot></slot>
       </div>
       <div class="line">
         
       </div>
        <div class="footer">
           <div class="showTime">
             {{infoTime}}
           </div>
           <div class="aboutCount clearfix">
              <div class="fl ">
               共计{{allCount}}件
              </div>
              <div class="fr allmoney">
                合计 <span>￥{{allPrice}}</span>
              </div>
           </div>
           
        </div>
     </div>
    
</template>

<script>
    export default {
      name:'OrderList',
     props:{
       infoTitleLeft:{
          type:String,
          default:'左边标题'
       },
       allCount:{
          type:[String,Number],
          default:"1"
       },
       allPrice:{
          type:String,
          default:'0.00' 
       },
       infoTime:{
          type:String,
          default:'1970-01-01 00:00:00'
       },
       isRight:{
          type:Boolean,
          default:false
       },
       isReceive:{
          type:Boolean,
          default:false
       }

    },
    methods:{
    //确认收货
    confirmReceive() {
      this.$emit('confirm-receive');
    },

    //删除
    remove() {
      this.$emit('remove');
    }
    }
    }
</script>

<style lang="less" scoped>
   
  .orderlist{
       font-size:14px;
       padding: 10px;
       background:white;
       border-radius: 8px;
    .line{
        position: relative;
         margin-top:10px;
         margin-bottom: 10px;
         border-top: 1px dashed #cccccc;
         &::after,&::before{
            content:"";
            display:block;
            width:20px;
            height: 20px;
            border-radius: 50%;
            position:absolute;
            background:#F7F7F7;
            top: -10px;
           
         }
         &::before{
            left:-20px;
         }
         &::after{
             right: -20px;
         }
    }
    .footer{
      
       
    }
     .aboutCount{
        
          margin-top:10px ;
     }

       .allmoney{
       
         font-weight:bold;
         color: #5f4121; 

         span{
             font-size:16px;
         }
    
     }
     
  }
  
  
</style>