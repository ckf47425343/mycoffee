import axios from './http.js'
import  Qs from 'qs'

export  let  getProductType=(data)=>{
         return     axios.get('/type'+'?'+Qs.stringify(data))
}

export let getTypeProduct=(data)=>{
        return    axios.get('/typeProducts'+'?'+Qs.stringify(data))
}