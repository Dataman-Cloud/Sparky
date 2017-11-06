import * as type from './mutations_types'

export default {
  [type.FETCH_SYSRESOURCE_ROLE_BY_ID] (state, payload) {
    state.sysResRole = payload
  }
}
