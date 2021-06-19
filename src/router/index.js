import Vue from 'vue'
import Router from 'vue-router'

// 引入路由 防止index 路由过多 以便维护
import routes from './router'


Vue.use(Router)

// const routes = [
//   {
//     path: '/auth/register',
//     name: 'Register',
//     // 使用下面的方法指定组件，可以实现路由懒加载，即当路由被访问时才加载对应的组件
//     component: () => import('@/views/auth/Register')
//   },
//   // 首页路由
//   {
//     path: '/',
//     name: 'Home',
//     component: () => import('@/views/Home')
//   },
//   // 其他未配置的路由都跳转到首页
//   {
//     path: '*',
//     redirect: '/'
//   }
// ]

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
  // linkExactActiveClass 的值是一个类名，用来添加到与当前路由对应的 <router-link> 上，以显示当前精确激活的 <router-link>，其默认值是 'router-link-exact-active'，我们这里改为 'active' 以利用 Bootstrap 的激活样式。
  linkExactActiveClass: 'active',
  // 指定滚动行为
  // 当切换到新路由时，想要页面滚到顶部，或者是保持原先的滚动位置，我们可以通过配置 scrollBehavior 来指定滚动行为。其前两个参数 to 和 from 是路由对象，第三个参数 savedPosition 是保存的位置，该参数在使用浏览器的『前进』/『后退』 按钮时才可用。
  // scrollBehavior 只在支持 history.pushState 的浏览器中可用，history.pushState 用来在浏览历史中添加一条新的记录
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      // 有锚点时，滚动到锚点
      return { selector: to.hash }
    } else if (savedPosition) {
      // 有保存位置时，滚动到保存位置
      return savedPosition
    } else {
      // 默认滚动到页面顶部
      return { x: 0, y: 0 }
    }
  },
  routes
})

// 全局前置首位 在导航被触发后调用 我们可以通过跳转或取消的方式守卫导航
router.beforeEach( (to,from,next) => {
  // 获取仓库里的登录信息
  // 也可以通过引入仓库来获取登录信息 import store from '../store'   const auth = store.state.auth
  // 实例的 $options 是用于当前 Vue 实例的初始化选项
  const app = router.app
  const store = app.$options.store
  const auth = store.state.auth
  // 获取参数路由里的articleId
  const articleId = to.params.articleId
  // 当前用户
  const user = store.state.user && store.state.user.name
  // 路由参数中的用户
  const paramUser = to.params.user

  app.$message.hide()
  if ((auth && to.path.indexOf('/auth/') !== -1) || (!auth && to.meta.auth ) || (articleId && !store.getters.getArticleById(articleId)) || (paramUser && paramUser !== user && !store.getters.getArticlesByUid(null, paramUser).length)) {
    // 如果当前用户已登录，且目标路由包含 /auth/ ，就跳转到首页 或 未登录但必须要登录的页面 或 文章Id不为空并且找不到该文章信息   路由参数中的用户不为当前用户，且找不到与其对应的文章时，跳转到首页
    next('/')
  } else {
    next()
  }
})

// 使用 router.afterEach 注册全局后置钩子，它在导航被确认后调用，因此它不接受 next 函数也不会改变导航本身
router.afterEach( (to, from) => {
  //导航被确认后 添加消息提示信息
  const app = router.app
  const store = app.$options.store
  const showMsg = to.params.showMsg

  if(showMsg) {
    if(typeof showMsg === 'string') {
      app.$message.show(showMsg)
    }else {
      app.$message.show('操作成功')
    }
  }
})

export default router