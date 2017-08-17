/**
 * Created by liuqing on 2017/08/16.
 */
import actions from './action'
import mutations from './mutations'

const state = {
  ipam: {
    nets: [],
    ipPage: {
      pageNum: 0,
      pageSize: 15,
      total: 0,
      data: []
    },
    ipPoolInfo: []
  }
}

export default {
  state,
  actions,
  mutations
}
