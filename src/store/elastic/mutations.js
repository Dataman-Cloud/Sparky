import * as type from './mutations_types'

export default {
  [type.FETCH_SELECT_POLICIES] (state, payload) {
    console.log(payload)
    state.policies.policies = payload
  },
  [type.ADD_POLICY] (state, payload) {
  },
  [type.GET_POLICY_INFO] (state, payload) {
    state.policies.currentPolicy = payload
  },
  [type.FETCH_SELECT_CAPABILITIES] (state, payload) {
    state.policies.capabilities = payload
  }
}
