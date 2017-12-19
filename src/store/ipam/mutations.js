/**
 * Created by liuqing on 2017/11/13.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_IPPOOL] (state, payload) {
    state.ipam.ipPoolInfo = payload
  },
  [type.RELEASE_IPPOOL] (state, payload) {},
  [type.ADD_NETWORK] (state, payload) {},
  [type.FETCH_NODE] (state, payload) {
    state.ipam.nodes = payload
  },
  [type.FETCH_NODE_NETWORK] (state, payload) {
    state.ipam.nets = payload
  },
  [type.FETCH_NODE_IPAMINFO] (state, payload) {
    state.ipam.page = payload
  }
}
