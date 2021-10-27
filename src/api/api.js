import axios from './http.js'
import  Qs from 'qs'
// 获取商品类型
export  let  getProductType=(data)=>{
         return     axios.get('/type'+'?'+Qs.stringify(data))
}
//获取类型商品
export let getTypeProduct=(data)=>{
        return    axios.get('/typeProducts'+'?'+Qs.stringify(data))
}
//获取个人信息
export  let getAccountInfo=(data)=>{
        return   axios.get('/findAccountInfo'+'?'+Qs.stringify(data))
}

//修改个人呢称
export  let updateNickname=(data)=>{
        return axios.post('/updateNickName',Qs.stringify(data))
}
//修改个人描述
export let updatePersonDes=(data)=>{
        return axios.post('/updateDesc',Qs.stringify(data))
}
//修改个人头像
export let updateUserBg=(data)=>{
        return axios.post('updateUserBg',Qs.stringify(data))
}

//修改背景头像

