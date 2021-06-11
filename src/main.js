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


// 生产提示
Vue.config.productionTip = false

// 创建一个新的Vue实例
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
