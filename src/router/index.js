import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import AppList from '@/views/app/list/List'

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
      name: '应用',
      redirect: {path: '/app/myApps'},
      iconCls: 'el-icon-message', // 图标样式class
      children: [
        { path: '/app/myApps', name: '我的应用', component: AppList },
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
      redirect: { path: 'app/myApps' }
    }
  ]
})
