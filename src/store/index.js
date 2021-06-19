import Vue from 'vue'
import Vuex from 'vuex'
import ls from '../utils/localStorage'
import router from '../router'
// 引入 actions.js 的所有导出
import * as moreActions from './actions'
import * as moreGetters from './getters'

Vue.use(Vuex)

const state = {
  // 用户信息，初始值从本地 localStorage 获取
  user: ls.getItem('user'),
  // 添加 auth 保存当前用户登录状态
  auth: ls.getItem('auth'),
  // 添加 articles 保存所有文章状态
  articles: ls.getItem('articles'),
  // 搜索值
  searchValue: '',
  // 默认为 location.origin
  origin: location.origin.indexOf('github.io') !== -1 ? `${location.origin}/vuejs-essential/dist` : location.origin
}

// 只支持同步请求
const mutations = {
  // state 当前仓库state user 用户传参  
  UPDATE_USER(state, user) {
    // 改变user的值
    state.user = user
    // 存入本地缓存
    ls.setItem('user', user)
  },
  // 添加 UPDATE_AUTH 来保存用户登录状态
  UPDATE_AUTH(state, auth) {
    state.auth = auth
    ls.setItem('auth', auth)
  },
  // 更改文章事件
  UPDATE_ARTICLES(state, articles) {
    state.articles = articles
    ls.setItem('articles', articles)
  },
   // 更新搜索值的事件类型
   UPDATE_SEARCH_VALUE(state, searchValue) {
    state.searchValue = searchValue
  }
}

// 支持异步请求
const actions = {
  // {commit = context.commit}  action 的第一个参数是一个与仓库实例具有相同方法和属性的 context 对象，可以从 context.state 访问仓库的 state，使用 context.commit 提交一个事件类型。可以在第一个参数使用参数解构来简化代码，如 { commit }
  login({ commit }, user) {
    // 登录时有传递用户信息 则调用更新保存方法  
    if (user) commit('UPDATE_USER', user)

    // 更新用户登录状态 为已登录
    commit('UPDATE_AUTH',true)

    // 含路径的对象 router.push({ path: '/' })
    // 含命名的对象 router.push({ name: 'Home' })
    // 含参数和查询参数的对象 router.push({ params: { id: 1 }, query: { page: 1 } })
    // 跳转到首页 // 字符串 router.push('/')  
    router.push('/')
  },
  logout({ commit }) {
     // 更新用户登录状态 为未登录
     commit('UPDATE_AUTH',false)
     router.push({ name: 'Home' ,params: { logout: true }})
  },
  // 不在 mutations 的 UPDATE_USER 添加这个逻辑，是因为我们希望 mutations 里的逻辑能够保持清晰简洁。且实际案例中，更新个人信息的操作很可能发起一个异步请求
  updateUser({ state, commit }, user) {
    // 获取仓库的个人信息
    const stateUser = state.user
  
    // 简单的数据类型判断
    if (stateUser && typeof stateUser === 'object') {
      // 合并新旧个人信息，等价于 user = Object.assign({}, stateUser, user)
      user = { ...stateUser, ...user }
    }
  
    // 更新个人信息
    commit('UPDATE_USER', user)
  },
  // 使用对象展开运算符混入 moreActions 等同于 const actions = Object.assign(actions, moreActions)
  ...moreActions
}

// 当需要从仓库的 state 中派生出一些状态的时候，我们就可以定义 Getter，你可以认为它是仓库的计算属性，我们可以通过 store.getters.getArticleById 的形式来访问这些值。Getter 的第一个参数是 state，通过它可以访问仓库的状态，它的第二个参数是 getters，通过它可以访问仓库的派生状态。需要传递用户参数时，可以让 Getter 返回一个函数
const getters = {
  // 第一参数是 state，因为要传 id，所以这里返回一个函数
  getArticleById: (state, getters) => (id) => {
    // 从仓库获取所有文章
    // let articles = state.articles
    // 使用派生状态 computedArticles 作为所有文章
    let articles = getters.computedArticles

    // 所有文章是一个数组时
    if(Array.isArray(articles)) {
      // 传进来的 id 和文章的 articleId 相同时，返回这些文章
      articles = articles.filter(article => parseInt(id) === parseInt(article.articleId))
      //根据文章长度 返回文章或者 null
      return articles.length ? articles[0] : null
    }else {
      return null
    }
  },

  // 混入 moreGetters, 你可以理解为 getters = Object.assign(getters, moreGetters)
  ...moreGetters
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store