import Vue from 'vue'
// 注册全局验证指令
import validator from './validator'
// 注册全局下拉指令
import dropdown from './dropdown'
// 注册全局标题指令
import title from './title'

// Vue.directive('validator', validator)

const directives = {
    validator,
    dropdown, 
    title
}

// 使用一个循环，来注册我们的所有指令，Object.entries 返回给定对象的键值对数组，以 Object.entries(directives)
for (const [key, value] of Object.entries(directives)) {
    Vue.directive(key, value)
}
