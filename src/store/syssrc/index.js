import actions from './action'
import mutations from './mutations'

const state = {
  menusTree: [],
  checkedMenusTree: [],
  firstMenus: {
    firstMenus: [],
    total: 0
  },
  secondMenus: {
    secondMenus: [],
    total: 0
  }
}

export default {
  state,
  actions,
  mutations
}
