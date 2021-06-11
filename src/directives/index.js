import Vue from 'vue'
// 注册全局验证指令
import validator from './validator'

Vue.directive('validator', validator)
