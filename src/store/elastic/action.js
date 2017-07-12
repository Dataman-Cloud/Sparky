import * as type from './mutations_types'
import * as api from '../../api/elastic'
export default {
  /* 获取策略列表 */
  [type.FETCH_SELECT_POLICIES] (context, playload) {
    return api.allPolicies(playload)
      .then(data => {
        context.commit(type.FETCH_SELECT_POLICIES, data.data)
        return data
      })
  },
  /* 添加策略 */
  [type.ADD_POLICY] (context, playload) {
    return api.add(playload)
  },
  /* 删除策略 */
  [type.DELETE_POLICY] (context, playload) {
    return api.delPolicy(playload)
  },
  /* 获取指定策略信息 */
  [type.GET_POLICY_INFO] (context, playload) {
    return api.getPolicyById(playload)
      .then(data => {
        context.commit(type.GET_POLICY_INFO, data.data)
        return data
      })
  },
  /* 更新策略 */
  [type.UPDATE_POLICY] (context, playload) {
    return api.policyEdit(playload)
  },
  /* 获取扩缩历史 */
  [type.FETCH_SELECT_CAPABILITIES] (context, playload) {
    return api.getCapabilities(playload)
      .then(data => {
        context.commit(type.FETCH_SELECT_CAPABILITIES, data.data)
        return data
      })
  }
}
