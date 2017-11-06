import * as type from './mutations_types'

export default {
  [type.FETCH_ROLES] (state, payload) {
    state.roles.roles = payload
    state.roles.total = state.roles.roles.length
  },
  [type.FETCH_SYS_ROLE_ADD] (state, payload) {
  },
  [type.FETCH_SYS_ROLE_DEL] (state, payload) {
  },
  [type.FETCH_SYS_ROLE_UPDATE] (state, payload) {
  },
  [type.FETCH_ROLEID_BY_USERID] (state, payload) {
    state.roleId = payload
  }
}
