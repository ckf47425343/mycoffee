import Vue from 'vue'

//导入提示组件
import { Toast } from 'vant'

//注册提示组件
Vue.use(Toast)

//表单验证模块
class ValidForm {

  constructor() {}

  //验证表单方法
  valid(o) {
    //o: 表单验证数据， object
    // 
    // 

    
  }

}

//导出表单验证模块实例
export const validForm = new ValidForm();