<template>
  <div>
    <!-- transition 用于实现单元素或组件之间的过渡，以下情况都可以使用 <transition>：条件渲染（ 使用 v-if ）条件展示（ 使用 v-show ）动态组件组件根节点 -->
    <transition
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div v-show="show" class="modal" style="display:block" @click.self="close">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button @click="close" class="close">×</button>
              <h4 class="modal-title">
                <slot name="header"></slot>
              </h4>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
            <div class="modal-footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-show="show" class="modal-backdrop fade in" @click="close"></div>
    </transition>
  </div>
</template>


<script>
export default {
  name: 'Modal',
  props: {
    // 是否显示弹窗
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      // 触发事件以关闭弹窗
      this.$emit('update:show', false)
    }
  },
  watch: {
    show(value) {
      // 监听 show 值以切换 body 上 modal-open 类
      const bodyClassList = document.body.classList

      if (value) {
        bodyClassList.add('modal-open')
      } else {
        bodyClassList.remove('modal-open')
      }
    }
  }
}
</script>

<style scoped>
.animate__animated { animation-duration: .4s;}
/* .fade-enter-active, .fade-leave-active { transition: opacity .5s;} */
.fade-enter, .fade-leave-to { opacity: 0;}
</style>