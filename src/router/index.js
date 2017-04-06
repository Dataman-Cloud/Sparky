import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '导航一',
      redirect: {path: '/todo1'},
      iconCls: 'el-icon-message', // 图标样式class
      children: [
        { path: '/todo1', name: 'TODO1' },
        { path: '/todo2', name: 'TODO2' },
        { path: '/todo3', name: 'TODO3' }
      ]
    },
    {
      path: '/',
      component: Home,
      name: '导航二',
      redirect: {path: '/todo4'},
      iconCls: 'fa fa-id-card-o',
      children: [
        { path: '/todo4', name: 'TODO4' },
        { path: '/todo5', name: 'TODO5' }
      ]
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: 'todo1' }
    }
  ]
})
