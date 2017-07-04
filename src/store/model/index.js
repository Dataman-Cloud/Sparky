/**
 * Created by my9074 on 2017/4/8.
 */
import actions from './action'
import mutations from './mutations'

const state = {
  model: {
    models: [],
    model: {},
    uploadPackageFilePath: '',
    total: 0
  }
}

export default {
  state,
  actions,
  mutations
}
