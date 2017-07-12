/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_ABOUTME] (state, payload) {
    state.aboutme = payload
  },
  [type.FETCH_USERS] (state, payload) {
    state.users.users = payload
    state.users.total = state.users.users.length
  },
  [type.FETCH_USER_DETAIL] (state, payload) {
  },
  [type.USER_INFO] (state, payload) {
    state.userinfo = payload
  },
  [type.USER_CHGPWD] (state, payload) {
  },
  [type.FETCH_USERS_ADD] (state, payload) {
  },
  [type.FETCH_USERS_DISABLE] (state, payload) {
  },
  [type.FETCH_USERS_ENABLE] (state, payload) {
//    state.userEdit = payload
  },
  [type.USER_PWD_RESET] (state, payload) {
  },
  [type.FETCH_USERS_DEL] (state, payload) {
  },
  [type.FETCH_GROUPS] (state, payload) {
    state.groups.groups = payload
    state.groups.total = state.groups.groups.length
  },
  [type.FETCH_USERS_IN_GROUPS] (state, {users, groupId}) {
    // state.usersInGroups.users = users
    let thisGroup = state.groups.groups
    thisGroup.forEach((group, index) => {
      if (group.id === groupId) {
        thisGroup[index] = {...thisGroup[index], users, usersNumber: users.length}
        state.groups.groups = [...thisGroup]
      }
    })
    // state.usersInGroups.total = state.usersInGroups.users.length
  },
  [type.FETCH_CLUSTERS_IN_GROUPS] (state, {clusters, groupId}) {
    let thisGroup = state.groups.groups
    thisGroup.forEach((group, index) => {
      if (group.id === groupId) {
        thisGroup[index] = {...thisGroup[index], clusters, clustersNumber: clusters.length}
        state.groups.groups = [...thisGroup]
      }
    })
  },
  [type.FETCH_USERS_ADD_IN_GROUPS] (state, payload) {
  },
  [type.FETCH_USERS_DEL_IN_GROUPS] (state, payload) {
  },
  [type.FETCH_GROUP_ADD] (state, payload) {
  },
  [type.FETCH_GROUP_EDIT] (state, payload) {
  },
  [type.FETCH_GROUP_DEL] (state, payload) {
  },
  [type.FETCH_REPOS] (state, payload) {
    state.repos.repos = payload
    state.repos.total = state.repos.repos.length
  },
  [type.FETCH_REPO_ADD] (state, payload) {
  },
  [type.FETCH_REPO_EDIT] (state, payload) {
  },
  [type.FETCH_REPO_DEL] (state, payload) {
  },
  [type.PUT_SYSRESOURCES] (state, sysResources) {
    state.sysResources = sysResources
    localStorage.setItem('sysResources', JSON.stringify(sysResources))
  },
  [type.PUT_TOKEN] (state, token) {
    state.token = token
  }
}
