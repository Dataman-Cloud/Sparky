import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import AppList from '@/views/app/list/List'
import ImageList from '@/views/image/list/List'
import UserList from '@/views/user/list/List'
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
      redirect: {name: '全部的应用'},
      iconCls: 'el-icon-message', // 图标样式class
      children: [
        {
          path: 'list/apps',
          name: '全部的应用',
          component: AppList
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
      path: '/system',
      component: Home,
      name: '系统',
      redirect: {name: '用户管理'},
      iconCls: 'fa fa-server',
      children: [
        { path: 'user/list',
          name: '用户管理',
          component: UserList
        }
      ]
    },
    {
      path: '*',
      hidden: true,
      redirect: { name: '全部的应用' }
    }
  ]
})
