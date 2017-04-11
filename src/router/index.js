import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { Message } from 'element-ui'
import Login from '@/views/Login'
import Home from '@/views/Home'
import AppList from '@/views/app/list/List'
import ImageList from '@/views/image/list/List'
import * as appType from '@/store/app/mutations_types'
import * as imageType from '@/store/image/mutations_types'

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
      path: '/app',
      component: Home,
      name: '应用',
      redirect: {name: '我的应用'},
      iconCls: 'el-icon-message', // 图标样式class
      children: [
        {
          path: 'list/myApps',
          name: '我的应用',
          component: AppList,
          meta: {
            type: appType.FETCH_MY_APPS
          }
        },
        { path: 'list/groupApps',
          name: '组的应用',
          component: AppList,
          meta: {
            type: appType.FETCH_MY_APPS
          }
        },
        { path: 'list/allApps',
          name: '全部应用',
          component: AppList,
          meta: {
            type: appType.FETCH_ALL_APPS
          },
          beforeEnter: (to, from, next) => {
            if (store.getters.isSuperUser) {
              next()
            } else {
              Message.warning('只有超级管理员可以访问')
            }
          }
        }
      ]
    },
    {
      path: '/mirror',
      component: Home,
      name: '镜像',
      redirect: {name: '组镜像'},
      iconCls: 'fa fa-id-card-o',
      children: [
        { path: 'list/groupImages',
          name: '组镜像',
          component: ImageList,
          meta: {
            type: imageType.FETCH_GROUP_IMAGES
          }
        },
        { path: 'list/publicImages',
          name: '公共镜像',
          component: ImageList,
          meta: {
            type: imageType.FETCH_PUBLIC_IMAGES
          }
        }
      ]
    },
    {
      path: '*',
      hidden: true,
      redirect: { name: '我的应用' }
    }
  ]
})
