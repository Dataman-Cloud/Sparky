/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_APPS] (state, payload) {
    if (payload !== undefined) {
      state.apps.apps = payload
      state.apps.total = state.apps.apps.length
    }
  },
  [type.GET_APP] (state, payload) {
    state.forUpdateApp = payload
  },
  // 查看应用信息
  [type.FETCH_APP_INFO] (state, payload) {
    state.apps.currApp = payload
  },
  // 获取应用的容器信息
  [type.FETCH_APP_CONTAINERS] (state, payload) {
    state.apps.currContainers = payload
  },
  [type.FETCH_QUEUE] (state, payload) {
    state.apps.queue = payload
  },
  [type.FETCH_APP_VERSIONS] (state, payload) {
    state.apps.appVersions = payload
  },
  // 获取应用appid,instances,poolname
  [type.GET_FILTER_APPS] (state, payload) {
    state.apps.appsInfo = payload
  },
  [type.FETCH_APP_VERSION_INFO] (state, payload) {
    state.apps.appVersionInfo = payload
  },
  // 根据appid获取ACL规则
  [type.GET_APPACL_BY_APPID] (state, payload) {
    // let parm = JSON.parse(payload)
    // console.log(111)
    // console.log(payload)
    state.appAcl = payload
  }
}
