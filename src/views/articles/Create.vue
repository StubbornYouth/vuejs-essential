<template>
  <div class="blog-container">
    <div class="blog-pages">
      <div class="col-md-12 panel">
        <div class="panel-body">
          <h2 class="text-center">{{ articleId ? '编辑文章':'创作文章' }}</h2>
          <hr>
          <div data-validator-form>
            <div class="form-group">
              <input v-model.trim="title" v-validator.required="{ title: '标题' }" type="text" class="form-control" placeholder="请填写标题" @input="saveTitle">
            </div>
            <div class="form-group">
              <!-- <textarea v-validator.required="{ title: '内容' }" class="form-control" placeholder="请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。"></textarea> -->
              <textarea id="editor"></textarea>
            </div>
            <br>
            <div class="form-group" @click="post">
              <button class="btn btn-primary" type="submit">发 布</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde'
import hljs from 'highlight.js'
import ls from '@/utils/localStorage'

// 添加全局变量
window.hljs = hljs

export default {
  name: 'Create',
  // 添加相关数据
  data() {
    return {
      title: '', // 文章标题
      content: '', // 文章内容
      articleId: undefined // 文章 ID
    }
  },
  beforeRouteEnter(to, from, next) {
    // 确认渲染组件的对应路由时，设置 articleId
    next(vm => {
        // 让 mounted 先执行
        vm.$nextTick().then(() => { 
            vm.setArticleId(vm.$route.params.articleId)
        })
    })
    // next(vm => {
    //     // 确认渲染组件的对应路由时，设置 articleId
    //     vm.setArticleId(vm.$route.params.articleId)
    // })
  },
  // 在离开该组件的对应路由前 beforeRouteLeave 是组件内的守卫，在离开该组件的对应路由时调用，此时可以访问 this，需要使用 next() 确认导航
  beforeRouteLeave(to, from, next) {
    // 清空自动保存的文章数据
    this.clearData()
    next()
  },
  watch: {
    // 监听路由参数的变化 
    // 以通过监听 '$route' 来得知路由参数的变化，我们通常会在两个路由都渲染相同的组件时监听 '$route'，这是因为 Vue 会复用组件实例，以导致组件内的部分钩子不再被调用。举例来说，我们的『编辑文章』和 『创作文章』都使用 Create.vue 组件，当我们从『编辑文章』导航到『创作文章』时（在编辑文章页面点击创作文章按钮），beforeRouteEnter 就不会被调用，所以我们需要监听 '$route'，以响应路由参数的变化
    '$route'(to) {
        // 清空自动保存的文章数据
        this.clearData()
        // 设置 articleId
        this.setArticleId(to.params.articleId)
    }
  },
  // mounted 钩子在元素挂载到实例之后调用，此时我们能访当前组件的元素，进而为编辑器指定一个绑定元素
  mounted() {
    // 创建一个 SimpleMDE 的实例
    const simplemde = new SimpleMDE({
      // 要绑定的 textarea 元素  
      element: document.querySelector('#editor'),
      // 占位符
      placeholder: '请使用 Markdown 格式书写 ;-)，代码片段黏贴时请注意使用高亮语法。',
      // 禁用拼写检查
      spellChecker: false,
      // 不用自动下载 FontAwesome，因为我们刚好有使用 FontAwesome，所以不用自动下载
      autoDownloadFontAwesome: false,
      // 启用自动保存，uniqueId 是一个用于区别于其他站点的标识
      autosave: {
          enabled: true,
          uniqueId: 'vuejs-essential'
      },
      // 启用代码高亮，需要引入 highlight.js
      renderingConfig: {
        codeSyntaxHighlighting: true
      }
    })

    // 监听编辑器的 change 事件
    simplemde.codemirror.on('change', () => {
      // 将改变后的值赋给文章内容
      this.content = simplemde.value()
    })

    // 将 simplemde 添加到当前实例，以在其他地方调用
    this.simplemde = simplemde
    // 初始化标题和内容
    // this.fillContent()

  },
  methods: {
    // 编辑器只会自动保存文章的内容，我们需要自己保存文章的标题
    saveTitle() {
      ls.setItem('smde_title', this.title)
    },

    // 初始化标题和内容 填充文章数据
    fillContent(articleId) {
      const simplemde = this.simplemde
      // 自动保存的标题
      const smde_title  = ls.getItem('smde_title')

      // 有文章Id
      if(articleId != undefined) {
        // 根据id 获取文章
        const article = this.$store.getters.getArticleById(articleId)

        if(article) {
          const { title, content } = article

          // 如果有自动保存的标题 和 内容 否则取存储中的标题和内容
          this.title = smde_title || title
          this.content = simplemde.value() || content

          // 设置编辑器内容
          simplemde.value(this.content)
        }
      }else { // 没有articleId 时 使用自动保存的内容
        this.title = smde_title
        // 使用编辑器的内容作为文章内容
        this.content = simplemde.value()
      }
    },

    // 发布
    post() {
      const title = this.title
      const content = this.content

      // 如果标题和内容都不为空，提交发布
      if (title !== '' && content.trim() !== '') {
        const article = {
          title,
          content
        }

        // 在控制台输出当前文章
        // console.log(article)
        // 分发更新保存文章事件 携带articleId
        this.$store.dispatch('post', { article, articleId: this.articleId })

        // 清除数据
        this.clearData()
      }
    },
    // 清除数据
    clearData() {
      this.title = ''
      ls.removeItem('smde_title')
      // 清除编辑的内容
      this.simplemde.value('')
      // 清除编辑器自动保存的内容
      this.simplemde.clearAutosavedValue()
    },
    // 设置articleId
    setArticleId(articleId) {
      // 获取当前存储的文章id ，用来判断编辑页面文章与请求文章是否相同
      const localArticleId = ls.getItem('articleId')

      // 文章不相同且存在时 清除数据
      if(articleId !== undefined && !(articleId === localArticleId)) {
        this.clearData()
      }

      // 设置当前文章id
      this.articleId = articleId

      // 填充文章数据
      this.fillContent(articleId)

      // 存入当前文章id
      ls.setItem('articleId',articleId)
    }
  }
}
</script>

<style scoped>
.blog-container { max-width: 980px; margin: 0 auto; margin-top: 20px;}
textarea { height: 200px; }
</style>