import axios from 'axios';
import {Toast} from 'vant';



let appkey='U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

let instance=axios.create({timeout:10000})

//请求头设置
instance.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8';

//设置基础地址
instance.defaults.baseURL='http://www.kangliuyong.com:10002'

//请求拦截器
instance.interceptors.request.use(config=>{

    return config
},
error=>{
  return Promise.error(error)
})
//响应拦截器
instance.interceptors.response.use(response=>{
    if(response.data.code==700){
        console.log('重新登录')
    }
    console.log('response',response)
    // Promise.resolve('asdasdasd')
   
    return   {data:response.data}
     
},
error=>{
  
})
//
export default  instance
