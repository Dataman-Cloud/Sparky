import * as type from './mutations_types'
import * as api from '../../api/audit'
export default {
  [type.FETCH_AUDIT_SELECT] (context, param) {
    return api.auditSelect(param.param)
      .then(data => {
        context.commit(type.FETCH_AUDIT_SELECT, data.data)
        return data
      })
  },
  [type.FETCH_AUDIT_DOWNLOAD] (context, param) {
    return api.download(param.param)
  },
  [type.FETCH_AUDIT_TARGETTYPES] (context, param) {
    return api.targettypes(param)
      .then(data => {
        context.commit(type.FETCH_AUDIT_TARGETTYPES, data.data)
        return data
      })
  },
  [type.FETCH_AUDIT_OPERATIONS] (context, param) {
    return api.operations(param)
      .then(data => {
        context.commit(type.FETCH_AUDIT_OPERATIONS, data.data)
        return data
      })
  }
}
