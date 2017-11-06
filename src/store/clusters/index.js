/**
 * Created by my9074 on 2017/4/8.
 */
import actions from './action'
import mutations from './mutations'

const state = {
  clusters: {
    currClusters: {
      vClusterLabel: ''
    },
    clusters: [],
    total: 0
  }
}

export default {
  state,
  actions,
  mutations
}
