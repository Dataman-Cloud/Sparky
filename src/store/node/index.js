/**
 * Created by liuqing on 2017/5/19.
 */
import actions from './action'
import mutations from './mutations'

const state = {
  nodes: {
    metricsSnapshot: {},
    currNode: {},
    currImages: [],
    currInstances: [],
    currInstance: {
      name: '',
      state: {},
      config: {
        Hostname: '',
        env: []
      },
      driver: '',
      hostConfig: {}
    },
    nodes: [],
    total: 0
  }
}

export default {
  state,
  actions,
  mutations
}
