import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from "../components/User/Users";
import Report from "../components/report/Report";


Vue.use(VueRouter);


const routes = [
  {
    // 登录
    path:'/login',
    component: Login,
  },
  {
    // 主页
    path:'/home',
    component: Home,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        component:Welcome,
      },
      {
        // 用户页
        path:'/users',
        component:Users,
      },
      {
        // 报表
        path:'/reports',
        component:Report,
      },
    ]
  },
  {
    // 重定向
    path:'/',
    redirect:'/login'
  },
  {
    // 退出登录
    path:'/logout',
    redirect: '/login'
  }

];



const router = new VueRouter({
  routes
});


// 拦截器由导航守卫
router.beforeEach((to,from,next)=>{
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行    next('/login') 强制跳转

  if(to.path === '/login'){return next()};
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr){return next('/login')}
  next();

});

export default router
