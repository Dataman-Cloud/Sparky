import * as type from './mutations_types'
import * as api from '../../api/role'
export default {
  [type.FETCH_ROLES] (context) {
    return api.getRoles().then(data => {
      context.commit(type.FETCH_ROLES, data.data)
      return data
    })
  },
  [type.FETCH_SYS_ROLE_ADD] (context, playload) {
    return api.sysRoleAdd(playload)
  },
  [type.FETCH_SYS_ROLE_DEL] (context, playload) {
    return api.sysRoleDel(playload)
  },
  [type.FETCH_SYS_ROLE_UPDATE] (context, playload) {
    return api.sysRoleUpdate(playload)
  },
  [type.FETCH_ROLEID_BY_USERID] (context, playload) {
    let id = playload
    return api.getRoleIdByUserId(id).then(data => {
      context.commit(type.FETCH_ROLEID_BY_USERID, data.data)
      return data
    })
  }
}
