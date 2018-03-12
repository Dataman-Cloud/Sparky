/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'
import * as api from '../../api/cluster'

export default {
  [type.FETCH_CLUSTERS] (context) {
    return api.listCluster()
      .then(data => {
        context.commit(type.FETCH_CLUSTERS, data.data)
        return data
      })
  },
  [type.FETCH_CLUSTERS_BYUSER] (context) {
    return api.listClusterByUser()
      .then(data => {
        context.commit(type.FETCH_CLUSTERS_BYUSER, data.data)
        return data
      })
  },
  [type.ADD_CLUSTERS] (context, playload) {
    return api.addCluster(playload)
  },
  [type.DEL_CLUSTER] (context, playload) {
    return api.delCluster(playload)
  },
  [type.CLUSTER_INFO] (context, playload) {
    let clusterId = playload
    return api.getCluster(clusterId).then(data => {
      context.commit(type.CLUSTER_INFO, data.data)
      return data
    })
  },
  [type.CHANGE_CLUSTER_NODE] (context, playload) {
    return api.changeNodeInCluster(playload)
  },
  [type.FETCH_CLUSTERS_IN_GROUPS] ({ commit }, groupId) {
    return api.listClusterByGroup(groupId).then(({ data }) => {
      commit(type.FETCH_CLUSTERS_IN_GROUPS, data)
    })
  }
}
