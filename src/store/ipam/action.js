/**
 * Created by liuqing on 2017/11/13.
 */
import * as type from './mutations_types'
import * as api from '../../api/ipam'

export default {
  [type.FETCH_IPPOOL] (context, playload) {
    return api.listIpPool().then(data => {
      context.commit(type.FETCH_IPPOOL, data.data)
      return data
    })
  },
  [type.RELEASE_IPPOOL] (context, playload) {
    return api.releaseIpPool()
  },
  [type.ADD_NETWORK] (context, playload) {
    return api.addNetwork(playload)
  },
  [type.FETCH_NODE] (context, playload) {
    return api.listNode().then(data => {
      context.commit(type.FETCH_NODE, data.data)
      return data
    })
  },
  [type.FETCH_NODE_NETWORK] (context, playload) {
    return api.listNodeNetwork().then(data => {
      context.commit(type.FETCH_NODE_NETWORK, data.data)
      return data
    })
  },
  [type.FETCH_NODE_IPAMINFO] (context, playload) {
    let node = playload.node
    let netName = playload.netName
    let pageNum = playload.pageNum
    return api.listNodeIpamInfo(node, netName, pageNum).then(data => {
      context.commit(type.FETCH_NODE_IPAMINFO, data.data)
      return data
    })
  }
}
