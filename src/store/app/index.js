/**
 * Created by my9074 on 2017/4/8.
 */
import actions from './action'
import mutations from './mutations'

const state = {
  apps: {
    apps: [],
    currApp: {
      deployments: [],
      labels: {
        HAPROXY_PROTOCOL_TYPE: ''
      },
      version: ''
    },
    listLoading: false,
    currContainers: [],
    queue: [],
    model: {},
    forUpdateApp: {},
    appVersions: [],
    appVersionInfo: {},
    appsInfo: [],
    total: 0
  },
  appAcl: {
    bamboo: '',
    serviceUrl: '',
    Config: {},
    Id: '',
    Acl: ''
  }
}

export default {
  state,
  actions,
  mutations
}
