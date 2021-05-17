import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from "../components/User/Users";
import Premiere from "../components/TestTools/Premiere";
import Special from "../components/TestTools/Special";
import Recharge from "../components/TestTools/Recharge";
import ReportTemplate from "../components/reports/ReportTemplate";
import ProjectList from "../components/InterfaceAutomation/ProjectList";
import ModuleList from "../components/InterfaceAutomation/ModuleList";
import TestList from "../components/InterfaceAutomation/TestList";
import ConfigList from "../components/InterfaceAutomation/ConfigList";
import SuiteList from "../components/InterfaceAutomation/SuiteList";
import ReportList from "../components/InterfaceAutomation/ReportList";
import PeriodicTask from "../components/InterfaceAutomation/PeriodicTask";

Vue.use(VueRouter);


const routes = [
  {
    // 登录
    path:'/login',
    component: Login,
  },
  {
    // 重定向
    path:'/',
    redirect:'/home'
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
      },{
        // 项目列表
        path:'/projectlist',
        component:ProjectList,
      },{
        // 模块列表
        path:'/modulelist',
        component:ModuleList,
      },{
        // 用例列表
        path:'/testlist',
        component:TestList,
      },{
        // 配置列表
        path:'/configlist',
        component:ConfigList,
      },{
        // 测试套件
        path:'/suitelist',
        component:SuiteList,
      },{
        // 报告列表
        path:'/reportlist',
        component:ReportList,
      },{
        // 定时任务
        path:'/periodictask',
        component:PeriodicTask,
      },
      {
        // 首映礼
        path:'/premiere',
        component:Premiere,
      },
      {
        // 专场
        path:'/special',
        component:Special,
      },
      {
        // 充值影点
        path:'/recharge',
        component:Recharge,
      },{
        // 报告模版
        path:'/reporttemplate',
        component:ReportTemplate,
      },
    ]
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

  // if(to.path === '/login'){return next()};
  // // 获取token
  // const tokenStr = window.sessionStorage.getItem('token')
  // if(!tokenStr){return next('/login')}
  next();

});

export default router
