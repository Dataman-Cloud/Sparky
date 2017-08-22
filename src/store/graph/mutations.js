import * as type from './mutations_types'

export default {
  [type.FETCH_GRAPH] (state, payload) {
    state.graphInfo = payload
  }
}
