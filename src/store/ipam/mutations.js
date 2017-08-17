/**
 * Created by liuqing on 2017/5/19.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_NETS] (state, payload) {
    state.ipam.nets = payload
  },
  [type.FETCH_NET_IPS] (state, payload) {
    state.ipam.ipPage = payload
  },
  [type.FETCH_IPAM_POOL] (state, payload) {
    state.ipam.ipPoolInfo = payload
  },
  [type.CREATE_NET] (state, payload) {
  }
}
