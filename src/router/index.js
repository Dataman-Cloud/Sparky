import Vue from 'vue'
import Router from 'vue-router'

import Layout from 'views/layout/Layout'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow
// so only in production use Lazy Loading

const Login = _import('Login')
const AppList = _import('app/list/List')
const MyAppList = _import('app/list/myList')
const AppModelList = _import('app/ModelList/ModelList')
const AddModel = _import('app/ModelList/AddModel')
const AppAddImg = _import('app/addImg')
const AppEditImg = _import('app/editImg')
const AppAddPrm = _import('app/addPrm')
const UserList = _import('user/list/List')
const UserAdd = _import('user/manage/Add')
const ClusterList = _import('resource/cluster/list/List')
const AddCluster = _import('resource/cluster/add/Add')
const ClusterInfo = _import('resource/cluster/info/Info')
const NodeList = _import('resource/node/list/List')
const NodeInfo = _import('resource/node/info/Info')
const InstanceInfo = _import('resource/node/instance/Info')
const MetricsSnapshot = _import('resource/metricsSnapshot/Snapshot')
const Network = _import('resource/network/IpamPool')
const UserInfo = _import('user/userCenter/UserInfo')
const Chgpwd = _import('user/userCenter/ChgPwd')
const RepoCertify = _import('user/repoCertify/RepoCertify')
const RepoAdd = _import('user/repoCertify/RepoAdd')
const UserEdit = _import('user/manage/UserEdit')
const UserGroup = _import('user/manage/Group')
const GroupAdd = _import('user/manage/GroupAdd')
const GroupEdit = _import('user/manage/GroupEdit')
const AuditList = _import('audit/list/List')
const AppInstanList = _import('app/appInstance/List')
const PolicyList = _import('elastic/policy/List')
const AddPolicy = _import('elastic/policy/Add')
const CapabilityList = _import('elastic/history/List')

import * as nodeType from '@/store/node/mutations_types'
const BatchRelease = _import('app/batchRelease')

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/app',
    component: Layout,
    name: '应用',
    redirect: {name: '全部的应用'},
    iconCls: 'el-icon-message', // 图标样式class
    children: [
      {
        path: 'list/apps',
        name: '全部的应用',
        component: AppList
      },
      {
        path: 'list/myApps',
        name: '我的应用',
        component: MyAppList
      },
      {
        path: 'list/appsModel',
        name: '应用模版',
        component: AppModelList
      },
      {
        path: 'list/catalogStackList',
        name: '程序包发布列表',
        component: AppModelList,
        hidden: true
      },
      {
        path: 'list/addModel',
        name: '添加应用模版',
        component: AddModel,
        hidden: true
      },
      {
        path: 'list/updateModel',
        name: '更新应用模版',
        component: AddModel,
        hidden: true
      },
      {
        path: 'list/catalogStackCreate',
        name: '发布程序包',
        component: AddModel,
        hidden: true
      },
      {
        path: 'addPrm',
        name: '添加程序包',
        component: AppAddPrm,
        hidden: true
      },
      {
        path: 'addImg',
        name: '添加镜像',
        component: AppAddImg,
        hidden: true
      },
      {
        path: 'editImg',
        name: '修改镜像',
        component: AppEditImg,
        hidden: true
      },
      {
        path: 'versionAppUpdate',
        name: '版本应用更新',
        component: AppEditImg,
        hidden: true
      },
      {
        path: 'appInstance/list',
        name: '应用实例信息',
        component: AppInstanList,
        hidden: true
      },
      {
        path: 'list/batchRelease',
        name: '批量发布',
        component: BatchRelease
      }
    ]
  }
]

export default new Router({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/resource',
    component: Layout,
    name: '资源',
    redirect: {name: '集群'},
    iconCls: 'fa fa-cubes',
    children: [
      {
        path: 'cluster/list',
        name: '集群',
        component: ClusterList
      },
      {
        path: 'cluster/add',
        name: '添加集群',
        component: AddCluster,
        hidden: true
      },
      {
        path: 'cluster/info',
        name: '集群信息',
        component: ClusterInfo,
        hidden: true
      },
      {
        path: 'node/list',
        name: '主机',
        component: NodeList,
        meta: {
          type: nodeType.FETCH_ALL_NODE
        }
      },
      {
        path: 'node/info',
        name: '主机信息',
        component: NodeInfo,
        meta: {},
        hidden: true
      },
      {
        path: 'node/instance/info',
        name: '容器信息',
        component: InstanceInfo,
        meta: {},
        hidden: true
      },
      {
        path: 'network',
        name: '网络',
        component: Network
      },
      {
        path: 'metricsSnapshot',
        name: '资源统计',
        component: MetricsSnapshot
      }
    ]
  },
  {
    path: '/elastic',
    component: Layout,
    name: '弹性扩缩',
    redirect: {name: '策略列表'},
    iconCls: 'fa fa-arrows',
    children: [
      {
        path: 'list/policies',
        name: '策略列表',
        component: PolicyList
      },
      {
        path: 'list/addPolicy',
        name: '添加策略',
        component: AddPolicy,
        hidden: true
      },
      {
        path: 'list/editPolicy',
        name: '更新策略',
        component: AddPolicy,
        hidden: true
      },
      {
        path: 'list/capabilities',
        name: '扩缩历史',
        component: CapabilityList
      }
    ]
  },
  {
    path: '/center',
    component: Layout,
    name: '个人中心',
    redirect: {name: '用户信息'},
    iconCls: 'fa fa-user',
    children: [
      {
        path: 'user/info',
        name: '用户信息',
        component: UserInfo
      },
      {path: 'user/chgpwd', name: '密码修改', hidden: true, component: Chgpwd},
      {path: 'user/repoCertify', name: '仓库认证', component: RepoCertify},
      {path: 'user/repoAdd', name: '镜像仓库添加', hidden: true, component: RepoAdd}
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: '系统',
    redirect: {name: '用户管理'},
    iconCls: 'fa fa-server',
    children: [
      {
        path: 'user/list',
        name: '用户管理',
        component: UserList
      },
      {path: 'user/edit', name: '用户修改', hidden: true, component: UserEdit},
      {path: 'user/group', name: '用户组管理', component: UserGroup},
      {path: 'user/group/add', name: '添加用户组', hidden: true, component: GroupAdd},
      {path: 'user/group/edit', name: '修改用户组', hidden: true, component: GroupEdit},
      {path: '/system/user/add', name: '用户创建', hidden: true, component: UserAdd},
      {
        path: 'user/AuditList',
        name: '审计',
        component: AuditList
      }
    ]
  },
  {
    path: '/',
    redirect: {name: 'Login'},
    hidden: true
  },
  {
    path: '*',
    hidden: true,
    redirect: {name: '全部的应用'}
  }
]
