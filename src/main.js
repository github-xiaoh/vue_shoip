import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'


//导入element-ui'
// import "element-ui/lib/theme-chalk/index.css";
// 单独引入一个loading组件
import { Loading } from "element-ui";

let loadingAll; // 配置一个loading实例，方便后面使用
let loading_count = 0; //请求计数器

// 加载动画 开始
function startLoading() {
  if (loading_count === 0) {
    loadingAll = Loading.service({
      lock: true,
      text: "玩命加载中...",
      fullscreen:true,
      background: "rgba(255, 255, 255, 0.9)",
      spinner: 'el-icon-loading',//自定义加载图标类名
      target: document.querySelector('main')
    });
  }
  //请求计数器
  loading_count++;
}

// 关闭加载动画
function endLoading() {
  loading_count--;//只要进入这个函数，计数器就自减，直到。。
  if (loading_count <= 0) {
    loadingAll.close();
  }
}




// 导入全局样式
import './css/globalcss.css'

// 导入axios网络请求包
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://10.1.111.118:8001/';

// axiox请求拦截
axios.interceptors.request.use( config => {
  console.log('开始请求')
  console.log(config)
  startLoading()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

// axios返回拦截
axios.interceptors.response.use( config => {
  console.log('请求返回')
  console.log(config)
  endLoading()
  // 在最后必须 return config
  return config
},function (error) {
  setTimeout(function () {
    endLoading()
    console.log("error错误")
    console.log(error)
    console.log(error.status)
    console.log(error.statusText)
    // this.$message.error("请求失败")
    // 对状态码做判断处理
    if (error && error.status) {
      switch (error.status) {
        case 200: error.statusText = '请求成功'; break;
        case 400: error.statusText = '请求错误(400)'; break;
        // case 401: this.$router.push('/login'); break;
        case 403: error.statusText = '拒绝访问(403)'; break;
        case 404: error.statusText = '请求出错(404)'; break;
        case 408: error.statusText = '请求超时(408)'; break;
        case 500: error.statusText = '服务器错误(500)'; break;
        case 501: error.statusText = '服务未实现(501)'; break;
        case 502: error.statusText = '网络错误(502)'; break;
        case 503: error.statusText = '服务不可用(503)'; break;
        case 504: error.statusText = '网络超时(504)'; break;
        case 505: error.statusText = 'HTTP版本不受支持(505)'; break;
        default: error.statusText = `连接出错(${config.status})!`;
      }
    } else {
      error.statusText = '连接服务器失败!'
      this.$message.error(error.statusText)
    }
  },2000)

})

// 将axios命名为 $http 全局使用
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
