/**
 * Created by liuqing on 2017/08/16.
 */
import * as type from './mutations_types'
import * as api from '../../api/ipam'

export default {
  [type.FETCH_NETS] (context) {
    return api.nets()
      .then(data => {
        context.commit(type.FETCH_NETS, data.data)
        return data
      })
  },
  [type.FETCH_NET_IPS] (context, playload) {
    return api.netIps(playload)
      .then(data => {
        context.commit(type.FETCH_NET_IPS, data.data)
        return data
      })
  },
  [type.FETCH_IPAM_POOL] (context) {
    return api.ipamPoolInfo()
      .then(data => {
        context.commit(type.FETCH_IPAM_POOL, data.data)
        return data
      })
  },
  [type.CREATE_NET] (context, playload) {
    return api.createNet(playload)
  },
  [type.RELEASE_IP] (context) {
    return api.releaseIp()
  }
}
