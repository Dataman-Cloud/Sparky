/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'
import * as api from '../../api/user'
import * as clusterApi from '../../api/cluster'

export default {
  [type.FETCH_ABOUTME] (context) {
    return api.aboutme()
      .then(data => {
        context.commit(type.FETCH_ABOUTME, data.account)
        return data
      })
  },
  [type.FETCH_USERS] (context, playload) {
    return api.users()
      .then(data => {
        context.commit(type.FETCH_USERS, data.accounts)
        return data
      })
  },
  [type.FETCH_USER_DETAIL] (context, playload) {
    let userId = playload
    return api.userDetail(userId).then(data => {
      context.commit(type.FETCH_USER_DETAIL, data.account)
      return data
    })
  },
  [type.USER_INFO] (context, playload) {
    let id = playload
    return api.getUser(id).then(data => {
      context.commit(type.USER_INFO, data.account)
      return data
    })
  },
  [type.USER_CHGPWD] (context, playload) {
    return api.userPassChg(playload)
  },
  [type.USER_PWD_RESET] (context, playload) {
    return api.userPassReset(playload)
  },
  [type.FETCH_USERS_ADD] (context, playload) {
    // console.log(JSON.stringify(playload))
    return api.userAdd(playload)
  },
  [type.FETCH_USERS_DISABLE] (context, playload) {
    return api.userDisable(playload)
  },
  [type.FETCH_USERS_ENABLE] (context, playload) {
    return api.userEnable(playload)
  },
  [type.FETCH_USERS_DEL] (context, playload) {
    return api.userDel(playload)
  },
  [type.FETCH_USERS_EDIT] (context, playload) {
    return api.userEdit(playload)
  },
  [type.FETCH_GROUPS] (context, playload) {
    return api.groups(playload)
      .then(data => {
        context.commit(type.FETCH_GROUPS, data.groups)
        return data
      })
  },
  async [type.FETCH_USERS_IN_GROUPS] ({ commit }, groupId) {
    return api.usersInGroup(groupId).then(({ accounts }) => {
      commit(type.FETCH_USERS_IN_GROUPS, {users: accounts, groupId})
    })
  },
  async [type.FETCH_CLUSTERS_IN_GROUPS] ({ dispatch, commit }, groupId) {
    await dispatch(type.FETCH_USERS_IN_GROUPS, groupId)
    clusterApi.listClusterByGroup(groupId).then(({ data }) => {
      console.log(data)
      commit(type.FETCH_CLUSTERS_IN_GROUPS, {clusters: data, groupId})
    })
  },
  [type.FETCH_USERS_DEL_IN_GROUPS] (context, playload) {
    return api.userDelInGroup(playload)
  },
  [type.FETCH_USERS_DEL_GROUPS] (context, playload) {
    return api.delInGroup(playload)
  },
  [type.FETCH_USERS_ADD_IN_GROUPS] (context, playload) {
    return api.userAddInGroup(playload)
  },
  [type.FETCH_GROUP_ADD] (context, playload) {
    return api.groupAdd(playload)
  },
  [type.FETCH_GROUP_EDIT] (context, playload) {
    return api.groupEdit(playload)
  },
  [type.FETCH_GROUP_DEL] (context, playload) {
    return api.groupDel(playload)
  },
  [type.FETCH_REPOS] (context, playload) {
    return api.listRepo(playload)
      .then(data => {
        context.commit(type.FETCH_REPOS, data.externalRegistries)
        return data
      })
  },
  [type.FETCH_REPO_ADD] (context, playload) {
    return api.repoAdd(playload)
  },
  [type.FETCH_REPO_EDIT] (context, playload) {
    return api.repoEdit(playload)
  },
  [type.FETCH_REPO_DEL] (context, playload) {
    return api.repoDel(playload)
  },
  [type.PUT_SYSRESOURCES] (context, playload) {
    context.commit(type.PUT_SYSRESOURCES, playload)
  }
}
