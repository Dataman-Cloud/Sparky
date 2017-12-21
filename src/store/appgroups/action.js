import * as type from './mutations_types'
import * as api from '../../api/appgroups'

export default {
  [type.FATCH_ALL_APPGROUP] (context) {
    return api.all()
      .then(data => {
        context.commit(type.FATCH_ALL_APPGROUP, data.data)
        return data
      })
  },
  [type.FATCH_SELF_APPGROUP] (context) {
    return api.self()
      .then(data => {
        context.commit(type.FATCH_SELF_APPGROUP, data.data)
        return data
      })
  },
  [type.ADD_APPGROUP] (context, payload) {
    return api.add(payload)
      .then(data => {
        return data
      })
  },
  [type.DEL_APPGROUP] (context, payload) {
    return api.del(payload)
      .then(data => {
        return data
      })
  },
  [type.FATCH_APPGROUP_BY_USERNAME] (context) {
    return api.allAppGroupByUserName()
      .then(data => {
        context.commit(type.FATCH_APPGROUP_BY_USERNAME, data.data)
        return data
      })
  },
  [type.FATCH_MARATHON] (context) {
    return api.marathonList()
      .then(data => {
        context.commit(type.FATCH_MARATHON, data.data)
        return data
      })
  }
}
