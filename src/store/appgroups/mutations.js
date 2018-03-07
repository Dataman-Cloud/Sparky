/**
 * Created by liuqing on 2017/5/20.
 */
import * as type from './mutations_types'

export default {
  [type.FATCH_ALL_APPGROUP] (state, payload) {
    if (payload !== undefined) {
      state.arr = payload && payload.groups ? payload.groups : []
      // state.marathonNameVoList = payload.marathonNameVoList
      // state.groupCreateList = payload.groupCreateList
      state.unversion = payload.apps ? payload.apps : []
      state.total = payload.groups ? payload.groups.length : 0
    }
  },
  [type.FATCH_SELF_APPGROUP] (state, payload) {
    state.arr = payload && payload.groups ? payload.groups : []
    // state.marathonNameVoList = payload.marathonNameVoList
    // state.selfGroupCreateList = payload.groupCreateList
    state.selfGroups = payload && payload.groups ? payload.groups : []
  },
  [type.FATCH_APPGROUP_BY_USERNAME] (state, payload) {
    state.groupCreateList = payload
  },
  [type.FATCH_MARATHON] (state, payload) {
    state.marathonNameVoList = payload
  }
}
