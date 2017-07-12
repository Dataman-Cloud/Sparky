/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_CLUSTERS] (state, payload) {
    state.clusters.clusters = payload
    state.clusters.total = state.clusters.clusters.length
  },
  [type.ADD_CLUSTERS] (state, payload) {
  },
  [type.DEL_CLUSTER] (state, payload) {
  },
  [type.CLUSTER_INFO] (state, payload) {
    state.clusters.currClusters = payload
  },
  [type.CHANGE_CLUSTER_NODE] (state, payload) {
  },
  [type.FETCH_CLUSTERS_IN_GROUPS] ({ clusters }, payload) {
    clusters.clusters = payload
    clusters.total = clusters.clusters.length
  }
}
