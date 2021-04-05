<template>
    <div class="pullbox" ref="pullbox">
        <!-- <div  class="pullPart" ref="pullPart"> -->
           <div class="titleUpdate">
                   释放刷新...
            </div>
        
             
             <div class="slideBox"  ref="slideBox" @touchstart="touchEve" @touchmove="touchMoveEve" @touchend="touchEndEve">
                
                
                <slot name="s1"></slot>
                  
         
               
          </div>

        <!-- </div> -->
    </div>
</template>

<script>

    export default {
        name:"PullBox",
      created() {
      
           this.$nextTick(()=>{
           this.pullbox=this.$refs.pullbox
           this.slideBoxEle=this.$refs.slideBox
         })
      },
      data() {
          return {
              Pullspace:100,
              slideBoxEle:"",
              pullbox:"",
              startY:0,
              moveY:0,
              currentVal:0,
              ttop:0,
              sildeHeight:0,
              endVal:0,
              isUpate:false,
              MaxY:100,
            
          }
      },
       methods: {
           touchEve(e){
          
            this.startY=e.touches[0].pageY
            this.sildeHeight=this.slideBoxEle.offsetHeight
            this.pullboxHeight=this.pullbox.offsetHeight
           },
           touchMoveEve(e){
             let height=this.sildeHeight-this.pullboxHeight
              this.moveY=e.touches[0].pageY
    
              this.ttop=this.moveY-this.startY+this.endVal
             
    
             if(this.ttop>this.MaxY){
               
             
               this.ttop=this.MaxY
             }

              
              if(this.ttop<-height){
                  this.ttop=-height

              }
           
               this.slideBoxEle.style.transform=`translateY(${this.ttop}px)`
            
                
               
           },
           touchEndEve(){
             
            this.ttop=this.ttop>0?0:this.ttop
            this.slideBoxEle.style.transform=`translateY(${this.ttop}px)`
            this.endVal=this.ttop
              // if(this.ttop==0&&this.isUpate){
              //   // this.$router.go(0)
              // }
           }
           
       },    
    }
</script>

<style lang="less" scoped>
    .pullbox{
     
       height:100vh; 
       width: 100%;
       position: relative;
       overflow: hidden;
       .titleUpdate{
         width: 100%;
         position: absolute;
          top:50px;
         left: 0px;
         text-align: center;
       
      }
      
    }
   
    .slideBox{
        
        width:100%;
        position: absolute;
        left:0px;
        top: 0px;
    
    }

    
    
</style>