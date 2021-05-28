import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'


// 导入全局样式
import './css/globalcss.css'

// 导入Nprogress
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入axios网络请求包
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';


axios.interceptors.request.use( config => {
  console.log('config：'+config)
  config.headers.Authorization = window.sessionStorage.getItem('token')

  // 在 request 拦截器中，展示进度条


  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
