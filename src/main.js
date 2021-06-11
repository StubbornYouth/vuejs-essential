// 引入 Vue.js
import Vue from 'vue'
// 引入 入口文件
import App from './App.vue'

// 生产提示
Vue.config.productionTip = false

// 创建一个新的Vue实例
new Vue({
  render: h => h(App),
}).$mount('#app')
