export  let  debounce=(func,time,immediate)=>{

  let timer

  

  return  ()=>{
       clearTimeout(timer)
  console.log('immediate',immediate)   
        if(immediate){
          //立即执行
            let callNow=!timer
            
            timer=setTimeout(()=>{
               timer=null
            },time)
            
            if(callNow){
               func()
            }
        }else{
          
          timer= setTimeout(func,time)
        }
        
   }
    
}