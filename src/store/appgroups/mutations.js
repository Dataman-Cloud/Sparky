/**
 * Created by liuqing on 2017/5/20.
 */
import * as type from './mutations_types'

export default {
  [type.FATCH_ALL_APPGROUP] (state, payload) {
    state.arr = payload.groups
    state.unversion = payload.apps
    state.total = state.arr.length
  },
  [type.FATCH_SELF_APPGROUP] (state, payload) {
    state.selfGroups = payload.groups
  }
}
