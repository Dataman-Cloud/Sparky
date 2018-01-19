import * as type from './mutations_types'
import * as api from '../../api/datacenter'
export default {
  [type.FETCH_DATACENTERS] (context) {
    return api.getDataCenters().then(data => {
      context.commit(type.FETCH_DATACENTERS, data.data)
      return data
    })
  },
  [type.DATACENTER_ADD] (context, playload) {
    return api.addDataCenter(playload)
  },
  [type.DATACENTER_DEL] (context, playload) {
    return api.dataCenterDel(playload)
  },
  [type.DATACENTER_UPDATE] (context, playload) {
    let id = playload.id
    return api.dataCenterUpdate(playload, id)
  }
}
