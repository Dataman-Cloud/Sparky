// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/App'
import router from './router'
import store from './store'
import * as filters from './filters'
import directives from './directive'
import NProgress from 'nprogress'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import './styles/index.css' // 全局css样式
import 'font-awesome/css/font-awesome.min.css'
import vueMoment from 'vue-moment'
import './styles/element-variables.css'
import './styles/theme/index.css'
import './styles/element-ui.css' // 覆盖element-ui

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(vueMoment)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 注册全局 Directive
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

const whiteList = ['/login']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next({name: '全部的应用'})
    } else {
      if (!store.getters.permissionRoutes) {
        store.dispatch('GenerateRoutes', store.getters.sysResources).then(_ => {
          // 这里最好不要改，很坑
          router.addRoutes(store.getters.appendRouters)
          next(Object.assign({}, to))
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(_ => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
