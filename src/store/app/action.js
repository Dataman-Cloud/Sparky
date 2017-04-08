/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'
import * as api from '../../api/app'

export default {
  [type.FETCH_TABLE_APPS] ({dispatch}, playload) {
    let {actionType, accountName, accountId, curGroupName, curGroupId} = playload
    switch (actionType) {
      case type.FETCH_MY_APPS:
        return dispatch(type.FETCH_MY_APPS, {accountName, accountId})
      case type.FETCH_GROUP_APPS:
        return dispatch(type.FETCH_GROUP_APPS, {curGroupName, curGroupId})
      case type.FETCH_ALL_APPS:
        return dispatch(type.FETCH_ALL_APPS)
    }
  },
  [type.FETCH_MY_APPS] (context, playload) {
    let {accountName, accountId} = playload
    return api.listMyApps(accountName, accountId)
      .then(data => {
        context.commit(type.FETCH_MY_APPS, data.data)
        return data
      })
  },
  [type.FETCH_GROUP_APPS] (context, playload) {
    let {curGroupName, curGroupId} = playload
    return api.listGroupApps(curGroupName, curGroupId)
      .then(data => {
        context.commit(type.FETCH_GROUP_APPS, data.data)
        return data
      })
  },
  [type.FETCH_ALL_APPS] (context) {
    return api.listAllApps()
      .then(data => {
        context.commit(type.FETCH_ALL_APPS, data.data)
        return data
      })
  }
}
