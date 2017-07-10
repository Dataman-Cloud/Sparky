/**
 * Created by liuqing on 2017/5/19.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_TABLE_NODE] (state, payload) {
    state.nodes.nodes = payload
    state.nodes.total = state.nodes.nodes.length
  },
  [type.FETCH_ALL_NODE] (state, payload) {
    if (payload !== undefined) {
      state.nodes.nodes = []
      state.nodes.nodes = payload
      state.nodes.total = state.nodes.nodes.length
    }
  },
  [type.METRICS_SNAPSHOT] (state, payload) {
    state.nodes.metricsSnapshot = {...state.nodes.metricsSnapshot, ...payload}
  },
  [type.NODE_INFO] (state, payload) {
    state.nodes.currNode = payload
  },
  [type.FETCH_NODE_IMAGES] (state, payload) {
    state.nodes.currImages = payload
  },
  [type.FETCH_NODE_INSTANCES] (state, payload) {
    state.nodes.currInstances = payload
  },
  [type.DEL_NODE_IMAGE] (state, payload) {},
  [type.FETCH_NODE_INSTANCE_INFO] (state, payload) {
    state.nodes.currInstance = {...state.nodes.currInstance, ...payload}
  }
}
