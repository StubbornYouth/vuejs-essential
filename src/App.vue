<!-- 通过为 template 和 style 指定 lang 属性，我们就可以使用其他语法来书写代码 
  npm install pug-plain-loader pug sass-loader node-sass - -save-dev
  pug 是一款模板引擎，sass-loader 和 node-sass 用来处理 Sass（一种 CSS 扩展语言），- -save-dev 用来标识当前模块是开发所需的模块
-->

<template lang="pug">
  div#app
    img(src="./assets/logo.png")
    h1 Welcome from pug & sass
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 200px;

  h1 {
    color: #42b983;
  }
}
</style>