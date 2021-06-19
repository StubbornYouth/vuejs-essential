// 引入 Vue.js
import Vue from 'vue'
// 引入 入口文件
import App from './App.vue'

// 引入 路由配置
// 如果引入的是 index.js，可以使用下面的简写，等价于 import router from './router/index.js'
import router from './router'
// 引入 全局指令 默认引入index.js
import './directives'
// 引入 全局组件
import './components'
// 引入仓库 默认引入index.js
import store from './store'
// 引入弹框插件
import VueSweetalert2 from './plugins/vue-sweetalert2'
// 引入消息提示插件
import Message from './plugins/message'
// 引入过滤器
import './filters'
import { mockArticles } from './mock/data'
import ls from './utils/localStorage'
// 运行 ./mock/index.js
import './mock'
// 引入 axios 的默认值
import axios from 'axios'

//使用插件
Vue.use(VueSweetalert2)
Vue.use(Message)

// 生产提示
Vue.config.productionTip = false
// 将 axios 添加到 Vue.prototype 上，使其在实例内部的所有组件中可用
// $axios 前面的 $ 不是必须的，但我们推荐加上它，以避免和组件定义的属性或方法产生冲突。
Vue.prototype.$axios = axios

// 添加测试数据
// const AddMockData = (() => {
//   // 是否加入测试数据
//   const isAddMockData = true
//   // 用户数据
//   let userArticles = ls.getItem('articles')

//   if (Array.isArray(userArticles)) {
//     userArticles = userArticles.filter(article => parseInt(article.uid) === 1)
//   } else {
//     userArticles = []
//   }

//   if (isAddMockData) {
//     // 合并用户数据和测试数据，使用合并值作为所有文章
//     store.commit('UPDATE_ARTICLES', [...userArticles, ...mockArticles(60)])
//   } else {
//     // 使用用户数据作为所有文章
//     store.commit('UPDATE_ARTICLES', userArticles)
//   }
// })()

// 创建一个新的Vue实例
new Vue({
  router,
  // 注入store
  store,
  render: h => h(App),
  // created() {
  //   console.log(this.$options.store) // => 'Store'
  // }
}).$mount('#app')
