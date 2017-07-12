import actions from './action'
import mutations from './mutations'

const state = {
  policies: {
    policies: [],
    currentPolicy: {},
    capabilities: []
  }
}

export default {
  state,
  actions,
  mutations
}
