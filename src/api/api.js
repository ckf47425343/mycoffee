import axios from './http.js'
import  Qs from 'qs'


//注册

export let  register=(data)=>{
        return  axios.post('/register',Qs.stringify(data))
}

//注册
export let login=(data)=>{
        return  axios.post('/login',Qs.stringify(data))
}

//忘记密码
export let retroevePassword=(data)=>{
        return axios.post('/retroevePassword'.Qs.stringify(data))
}
//获取轮播图
export let getBanner=(data)=>{
        return axios.get('/banner'+'?'+Qs.stringify(data))
}


// 获取商品类型
export  let  getProductType=(data)=>{
         return     axios.get('/type'+'?'+Qs.stringify(data))
}
//获取类型商品
export let getTypeProduct=(data)=>{
        return    axios.get('/typeProducts'+'?'+Qs.stringify(data))
}
//获取商品详情
export let getProductDetail=(data)=>{
        return axios.get('/productDetail'+'?'+Qs.stringify(data))
}
//获取购物车
export let getShopCart=(data)=>{
        return axios.get('/findAllShopcart'+'?'+Qs.stringify(data))
}
//添加购物车
export let addShopCart=(data)=>{
        return axios.post('/addShopcart',Qs.stringify(data))
}
//获取收藏的商品
export let getLikeProduct=(data)=>{
       return axios.get('/findlike'+'?'+Qs.stringify(data))
}
//收藏商品
export let likeProduct=(data)=>{
        return axios.post('/like',Qs.stringify(data))
}
//取消收藏商品
export let notLikeProduct=(data)=>{
        return axios.post('/notlike',Qs.stringify(data))
}
//获取购物袋的数量

//删除购物车
export let delShopCart=(data)=>{
        return axios.post('/deleteShopcart',Qs.stringify(data))
}
//修改购物袋商品的数量
export let modifyShopCartCount=(data)=>{
        return axios.post('/modifyShopcartCount',Qs.stringify(data))
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

