import * as type from './mutations_types'
import * as api from '../../api/syssrc'
export default {
  [type.FETCH_FIRST_MENU_RESOURCE] (context) {
    return api.getFirstMenuResource().then(data => {
      context.commit(type.FETCH_FIRST_MENU_RESOURCE, data.data)
      return data
    })
  },
  [type.FETCH_SECOND_MENU_RESOURCE] (context, playload) {
    let parentId = playload
    return api.getSecondMenuResource(parentId).then(data => {
      context.commit(type.FETCH_SECOND_MENU_RESOURCE, data.data)
      return data
    })
  },
  [type.FETCH_ALL_MENU_RESOURCE] (context) {
    return api.getAllMenuResource().then(data => {
      context.commit(type.FETCH_ALL_MENU_RESOURCE, data.data)
      return data
    })
  },
  [type.FETCH_ALL_CHECKED_MENU_RESOURCE] (context, playload) {
    let roleId = playload
    return api.getCheckedMenuResource(roleId).then(data => {
      context.commit(type.FETCH_ALL_CHECKED_MENU_RESOURCE, data.data)
      return data
    })
  }
}
