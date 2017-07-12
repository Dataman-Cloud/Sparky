/**
 * Created by liuqing on 2017/5/19.
 */
import * as type from './mutations_types'
import * as api from '../../api/nodes'

export default {
  [type.FETCH_TABLE_NODE] ({dispatch}, playload) {
    let {actionType} = playload
    switch (actionType) {
      case type.FETCH_ALL_NODE:
        return dispatch(type.FETCH_ALL_NODE)
    }
  },
  [type.FETCH_ALL_NODE] (context, playload) {
    return api.listNodes().then(data => {
      context.commit(type.FETCH_ALL_NODE, data.data)
      return data
    })
  },
  [type.METRICS_SNAPSHOT] (context, playload) {
    return api.metricsSnapshot().then(data => {
      context.commit(type.METRICS_SNAPSHOT, data.data)
      return data
    })
  },
  [type.NODE_INFO] (context, playload) {
    return api.nodeInfo(playload).then(data => {
      context.commit(type.NODE_INFO, data.data)
      return data
    })
  },
  [type.FETCH_NODE_INSTANCES] (context, playload) {
    return api.nodeInstances(playload).then(data => {
      context.commit(type.FETCH_NODE_INSTANCES, data.data)
      return data
    })
  },
  [type.FETCH_NODE_IMAGES] (context, playload) {
    return api.nodeImages(playload).then(data => {
      context.commit(type.FETCH_NODE_IMAGES, data.data)
      return data
    })
  },
  [type.DEL_NODE_IMAGE] (context, playload) {
    return api.delNodeImage(playload)
  },
  [type.FETCH_NODE_INSTANCE_INFO] (context, playload) {
    return api.nodeInstanceInfo(playload).then(data => {
      context.commit(type.FETCH_NODE_INSTANCE_INFO, data.data)
      return data
    })
  }
}
