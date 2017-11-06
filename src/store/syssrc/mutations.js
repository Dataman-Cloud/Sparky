import * as type from './mutations_types'

export default {
  [type.FETCH_FIRST_MENU_RESOURCE] (state, payload) {
    state.firstMenus.firstMenus = payload
    state.firstMenus.total = state.firstMenus.firstMenus.length
  },
  [type.FETCH_SECOND_MENU_RESOURCE] (state, payload) {
    state.secondMenus.secondMenus = payload
    state.secondMenus.total = state.secondMenus.secondMenus.length
  },
  [type.FETCH_ALL_MENU_RESOURCE] (state, payload) {
    let jsonData = JSON.parse(payload)
    state.menusTree = jsonData
  },
  [type.FETCH_ALL_CHECKED_MENU_RESOURCE] (state, payload) {
    let jsonData = JSON.parse(payload)
    state.checkedMenusTree = jsonData
  }
}
