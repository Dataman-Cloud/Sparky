/**
 * Created by my9074 on 2017/4/8.
 */
import actions from './action'
import mutations from './mutations'
import getters from './getters'

const state = {
  aboutme: {},
  userinfo: null,
  userEdit: {},
  users: {
    users: [],
    total: 0
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
  sysResources: []
}

export default {
  state,
  actions,
  mutations,
  getters
}
