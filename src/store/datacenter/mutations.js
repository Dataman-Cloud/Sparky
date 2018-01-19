import * as type from './mutations_types'

export default {
  [type.FETCH_DATACENTERS] (state, payload) {
    state.dataCenter.dataCenters = payload
    state.dataCenter.total = state.dataCenter.dataCenters.length
  },
  [type.DATACENTER_ADD] (state, payload) {
  },
  [type.DATACENTER_DEL] (state, payload) {
  },
  [type.DATACENTER_UPDATE] (state, payload) {
  }
}
