import {Toast}  from 'vant';

export  let  debounce=(func,time,immediate)=>{

  let timer

  

  return  ()=>{
       clearTimeout(timer)
     
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
//表单检验
export let validForm=(o)=>{
  for (let key in o) {
    if (!o[key].reg.test(o[key].value)) {
      

      //提示错误信息
      Toast(o[key].errorMsg);
      //表单验证不通过
      return false;
    }
  }

  //表单验证通过
  return true;
}