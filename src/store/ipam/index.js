/**
 * Created by liuqing on 2017/11/13.
 */
import actions from './action'
import mutations from './mutations'

const state = {
  ipam: {
    ipPoolInfo: [],
    nodes: [],
    nets: [],
    page: {
      pageSize: 0,
      total: 0,
      pageNum: 0,
      data: []
    }
  }
}

export default {
  state,
  actions,
  mutations
}
