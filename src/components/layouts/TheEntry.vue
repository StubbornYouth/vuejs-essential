<template>
  <div class="navbar-right">
    <ul v-if="auth" class="nav navbar-nav github-login">
       <!-- 创作文章 -->
      <li>
        <a v-dropdown href="javascript:;">
          <i class="fa fa-plus text-md"></i>
        </a>
        <ul class="dropdown-menu">
          <li>
            <router-link to="/articles/create">
              <i class="fa fa-paint-brush text-md"></i>
              创作文章
            </router-link>
          </li>
        </ul>
      </li>
      <li>
        <a v-dropdown href="javascript:;">
          <span v-if="user">
            <img v-if="user.avatar" :src="user.avatar" class="avatar-topnav">
            <span v-if="user.name">{{ user.name }}</span>
          </span>
          <span v-else>佚名</span>
          <span class="caret"></span>
        </a>
        <ul class="dropdown-menu">
          <!-- 个人专栏 -->
          <li v-if="user">
            <router-link :to="`/${user.name}`">
              <i class="fa fa-list-ul text-md i-middle"></i>
              个人专栏
            </router-link>
          </li>
          <!-- 编辑资料 -->
          <li>
            <router-link to="/users/1/edit">
              <i class="fa fa-cog text-md i-middle"></i>
              编辑资料
            </router-link>
          </li>
          <li><a href="#" @click="logout"><i class="fa fa-sign-out text-md"></i>退出</a></li>
        </ul>
      </li>
    </ul>
    <div v-else class="nav navbar-nav github-login">
      <!-- <a href="#" class="btn btn-default login-btn">
        <i class="fa fa-user"></i> 登 录
      </a> -->
      <router-link to="/auth/login" class="btn btn-default login-btn">
        <i class="fa fa-user"></i> 登 录
      </router-link>
      <router-link to="/auth/register" class="btn btn-default login-btn">
        <i class="fa fa-user-plus"></i> 注 册
      </router-link>
    </div>
  </div>
</template>

<script>
// 引入辅助函数
import { mapState } from 'vuex'

export default {
  name: 'TheEntry',
  // 添加计算属性选项
  computed: {
    // 使用对象展开运算符，将 mapState 对象混入到计算属性之中
    ...mapState ([
      'auth',
      'user'
    ])
  },
  methods: {
    // 退出登录
    logout() {
      this.$swal({
        text: '你确定要退出吗？',
        confirmButtonText: '退出'
      }).then((res) => {
        if(res.value) {
           this.$store.dispatch('logout')
        }
      })
    }
  }

  // 计算属性（computed）用来处理相对复杂的逻辑，并返回一个新的属性，它会根据其依赖的变化而变化。
  // 当一个组件需要获取多个状态时候，将这些状态都一一声明就显得重复和冗余了。为了解决这个问题，我们可以使用 mapState 辅助函数帮我们生成计算属性，这样我们就能直接在模板里使用了。
  // 如果不使用 mapState 辅助函数，我们需要这样写

  // export default {
  //   name: 'TheEntry',
  //   computed: {
  //     auth() {
  //       return this.$store.state.auth
  //     },
  //     user() {
  //       return this.$store.state.user
  //     }
  //   }
  // }
}
</script>

<style scoped>

</style>