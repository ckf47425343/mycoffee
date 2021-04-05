<template>
    <div class="orderitem clearfix">
       <div class="fl productImg">
        <img :src="item.small_img||item.smallImg" alt="">
       </div>
       <div class="fl productInfo">
            <div class="rules clearfix">
               
              
              <div class="cnname fl">
                {{item.name}}
              </div>
              <div class="rule_type fl">
                {{item.rule}}
              </div>
               
            </div>
            <div class="enname">
                 {{item.enname}}
            </div>
            <div class="clearfix stats">
               <div class="contentPrice fl">
                  ￥{{item.price}}
             </div>
              <div class="contentCount fr">
               x{{item.count}}
             </div>
            
            </div>
            
             
            <div>

            </div>
       </div>
    </div>
</template>

<script>
    export default {
        name:'OrderItem',
        props:{
      item:{
        type:Object,
        default(){
          return{
          small_img:'',
          smallImg:'',
          enname:'',
          rule:'',
          name:'',
          price:'',
          count:''
          }
         

        }
      }
        

        }
    }
</script>

<style lang="less" scoped>
  .orderitem{
      margin-bottom:10px ;
      margin-top:10px ;
      &:last-child{
       margin-bottom:15px ;
      }
      .productImg{
          width: 80px;
          height:80px ;
          background: burlywood;
          margin-right:15px;
          img{
            width: 100%;
            height: 100%;
            display:block;
          }
      }
      .productInfo{
        width: calc(~"100% - 95px ");
         .rules{
          
        
         }
         .cnname{
           margin-right:10px ;
         }
         .enname{
           margin: 5px 0px 15px 0px;
         }
         .stats{
           line-height: 16px;
         }
         .contentPrice{
           color:#0C34BA;
           font-size: 16px;
           font-weight:bold;
         }
         .contentCount{
          
          margin-right: 30px;
         }
          
      }
  }
</style>