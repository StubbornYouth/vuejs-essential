import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/auth/register',
    name: 'Register',
    // 使用下面的方法指定组件，可以实现路由懒加载，即当路由被访问时才加载对应的组件
    component: () => import('@/views/auth/Register')
  }
]

// 如果不需要懒加载路由，可以先引入组件再配置

// import Register from '@/views/auth/Register'

// const routes = [
//   {
//     path: '/auth/register',
//     name: 'Register',
//     component: Register
//   }
// ]

// mode：路由模式，默认值 'hash' 使用井号（ # ）作路由，值 'history' 可利用 History API 来完成页面跳转且无须重新加载
const router = new Router({
  mode: 'history',
  routes
})

export default router