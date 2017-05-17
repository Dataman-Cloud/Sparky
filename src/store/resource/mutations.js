/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_CLUSTERS] (state, payload) {
    state.cluster.clusters.clusters = payload
    state.cluster.clusters.total = state.cluster.clusters.clusters.length
  }
}
