import actions from './action'
import mutations from './mutations'

const state = {
  audit: {
    audit: [],
    total: 0,
    operations: [],
    targettypes: []
  }
}

export default {
  state,
  actions,
  mutations
}
