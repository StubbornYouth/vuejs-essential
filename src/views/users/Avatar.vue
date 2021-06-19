<template>
  <div class="col-md-9 left-col">
    <div class="panel panel-default padding-md">
        <div class="panel-body">
            <h2><i class="fa fa-picture-o"></i> 请输入头像地址</h2>
        <hr>
        <div data-validator-form>
          <div class="form-group">
            <label>头像预览：</label>
            <div>
              <img :src="avatar" class="avatar-preview-img">
            </div>
          </div>
          <div class="form-group row">
            <div class="col-md-8">
                <!-- 使用 v-model 时，默认情况下其值随 input 事件实时同步，使用 .lazy 修饰符，可以使其值在 change 事件后才同步 -->
              <input v-model.trim.lazy="avatar" v-validator.required="{ title: '头像地址' }" type="text" class="form-control avatar-input">
            </div>
            <div class="clearfix"></div>
          </div>

          <div class="form-group">
            <button type="submit" class="btn btn-lg btn-primary" @click="updateAvatar">上传头像</button>
          </div>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditAvatar',
  data() {
    return {
      avatar: '' // 头像地址
    }
  },
  // 实例创建完后 初始化头像地址
  created() {
    const user = this.$store.state.user

    // 用户信息判断
    if (user && typeof user === 'object') {
      this.avatar = user.avatar
    }
  },
  methods: {
    // 更新用户头像  
    updateAvatar() {
      const avatar = this.avatar

      if (avatar) {
        let img = new Image()

        // 加载成功 分发用户更新事件 传入头像信息
        img.onload = () => {
          this.$store.dispatch('updateUser', { avatar })
          this.$message.show('上传成功')
        }

        // 加载失败 提示信息
        img.onerror = () => {
          this.$message.show('上传失败', 'danger')
        }

        // 指定图片地址
        img.src = avatar
      }
    }
  }
}
</script>

<style scoped>
.avatar-preview-img { min-width: 200px; min-height: 200px; max-width: 50%;}
</style>