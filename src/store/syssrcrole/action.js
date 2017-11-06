import * as type from './mutations_types'
import * as api from '../../api/syssrcrole'
export default {
  [type.FETCH_SYSRESOURCE_ROLE_BY_ID] (context, playload) {
    let id = playload
    return api.getSysResRole(id).then(data => {
      context.commit(type.FETCH_SYSRESOURCE_ROLE_BY_ID, data.data)
      return data
    })
  }
}
