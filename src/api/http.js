import axios from 'axios';
import {Toast} from 'vant';
import router from '@/router/index.js'




let instance=axios.create({timeout:10000})

//请求头设置
instance.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8';

//设置基础地址
instance.defaults.baseURL='http://www.kangliuyong.com:10002'

// let hasToken=(url)=>{
//     let index=0
//    if((index=url.indexOf('?'))>-1){
//        url=url.slice(index+1)
//    }
//    let arr=url.split('&')
//    let arrItem
//    let  obj={}

//    arr.map((item,index)=>{
//           arrItem= item.split('=')
//           obj[arrItem[0]]=arrItem[1]
//    })

//    console.log('obj==>',obj)

//    if(obj.hasOwnProperty('tokenString')){
//            if(!obj.tokenString){
//             return false
//            }
//    }

//    return true


// }

//请求拦截器
instance.interceptors.request.use(config=>{
    console.log('config==>',config)

    // let url=config.method=='get'?config.url:config.data
   
    
    Toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
    })
    return config
},
error=>{
    Toast.clear()
    Toast('请求错误')
  return Promise.error(error)
})
//响应拦截器
instance.interceptors.response.use(response=>{
 
    Toast.clear()

    console.log('response==>',response)

    if(response.data.code==700&&response.config.method=='post'){

        console.log('进入了==》')
     
           Toast('请先登录')

           router.push({name:'Login'})
    }

   
    return   {data:response.data}


     
},
error=>{
  
})
//
export default  instance
