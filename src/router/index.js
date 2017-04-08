import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import AppList from '@/views/app/list/List'
import * as appType from '@/store/app/mutations_types'

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
        {
          path: '/app/myApps',
          name: '我的应用',
          component: AppList,
          meta: {
            type: appType.FETCH_MY_APPS
          }
        },
        { path: '/app/groupApps',
          name: '组的应用',
          component: AppList,
          meta: {
            type: appType.FETCH_MY_APPS
          }
        },
        { path: '/app/allApps',
          name: '全部应用',
          component: AppList,
          meta: {
            type: appType.FETCH_ALL_APPS
          }
        }
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
      redirect: { path: '/app/myApps' }
    }
  ]
})
