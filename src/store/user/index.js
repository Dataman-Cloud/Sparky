/**
 * Created by my9074 on 2017/4/8.
 */
import actions from './action'
import mutations from './mutations'
import getters from './getters'
import Cookies from 'js-cookie'

const state = {
  aboutme: {},
  userinfo: null,
  userEdit: {},
  users: {
    users: [],
    total: 0,
    pageNum: 0
  },
  groups: {
    groups: [],
    total: 0
  },
  usersInGroups: {
    users: [],
    total: 0
  },
  repos: {
    repos: [],
    total: 0
  },
  sysResources: JSON.parse(localStorage.getItem('sysResources')) || [],
  token: Cookies.get('token')
}

export default {
  state,
  actions,
  mutations,
  getters
}
