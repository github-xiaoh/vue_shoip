import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入element-ui 如果使用了 CDN 可以 注释
// import './plugins/element.js'


// 导入全局样式
import './css/globalcss.css'

// 导入Nprogress
import Nprogress from 'nprogress'
// import 'nprogress/nprogress.css'

// 导入axios网络请求包
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/';

// axios请求前拦截处理
axios.interceptors.request.use( config => {
  console.log('请求前config：'+config)
  config.headers.Authorization = window.sessionStorage.getItem('token')

  // 在 request 拦截器中，展示进度条 Nprogress.start()
  Nprogress.start()

  // 在最后必须 return config
  return config
})

// axios请求后拦截处理
axios.interceptors.response.use( config => {
  console.log('请求后config：'+config)

  // 在 response 拦截器中，关闭进度条 Nprogress.done()
  Nprogress.done()

  // 在最后必须 return config
  return config
})






Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
