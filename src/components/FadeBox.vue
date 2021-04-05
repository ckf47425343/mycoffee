<template>
    <div class="fade">
         <div class="content" :style="{opacity:opacityVal}">
             <slot></slot>
         </div>
    </div>
</template>

<script>
    export default {
      name:"FadeBox",
      data() {
          return {
              opacityVal:0,
              widthVal:0
          }
      },
     created() {
         this.SetFade()
     },
     methods: {
          SetFade(){
           let index=0
            let timer=setInterval(() => {
                index++
             if(index>10){
                clearInterval(timer)
                return
             }
              this.opacityVal+=index/10
            },150);
         }
     },
    }
</script>

<style lang="less" scoped>
 .fade{
     .content{
       
      
        height: 500px;
        // background: red;
     }
 }
</style>