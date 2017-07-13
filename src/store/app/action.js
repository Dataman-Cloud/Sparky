/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'
import * as api from '../../api/app'
export default {
  [type.FETCH_APPS] (context, playload) {
    let {curGroupId} = playload
    return api.listApps(curGroupId)
      .then(data => {
        context.commit(type.FETCH_APPS, data.data.apps)
        return data
      })
  },
  [type.ADD_APP] (context, playload) {
    // console.log('******************params=' + JSON.stringify(playload))
    return api.add(playload)
      .then(data => {
        return data
      })
  },
  [type.UPDATE_APP] (context, playload) {
    return api.updateAppInfo(playload.aid, playload.params)
      .then(data => {
        return data
      })
  },
  [type.GET_APP] (context, aid) {
    return api.getAppInfo(aid)
      .then(data => {
        context.commit(type.GET_APP, data.data)
        return data
      })
  },
  [type.DEL_APP] (context, playload) {
    return api.delApp(playload)
      .then(data => {
        return data
      })
  },
  [type.FETCH_APP_INFO] (context, playload) {
    return api.getAppInfo(playload).then(data => {
      context.commit(type.FETCH_APP_INFO, data.data.app)
      return data
    })
  },
  [type.FETCH_APP_CONTAINERS] (context, playload) {
    return api.getAppContainers(playload).then(data => {
      context.commit(type.FETCH_APP_CONTAINERS, data.data)
      return data
    })
  },
  [type.FETCH_QUEUE] (context, playload) {
    return api.queue(playload).then(data => {
      context.commit(type.FETCH_QUEUE, data.data)
      return data
    })
  },
  [type.KILL_TASK] (context, playload) {
    return api.delAppTask(playload)
  },
  [type.KILL_TASK_SCALE] (context, playload) {
    return api.delAppTaskOrScale(playload)
  },
  [type.FETCH_APP_VERSIONS] (context, playload) {
    return api.appVersions(playload).then(data => {
      context.commit(type.FETCH_APP_VERSIONS, data.data)
      return data
    })
  },
  // 获取应用部分信息
  [type.GET_FILTER_APPS] (context) {
    return api.filterApps()
      .then(data => {
        context.commit(type.GET_FILTER_APPS, data.data)
        return data
      })
  },
  [type.GET_APP_BYGROUPID] (context, playload) {
    return api.getAppByGroupId(playload).then(data => {
      context.commit(type.FETCH_APPS, data.data)
      return data
    })
  },
  [type.UPDATE_APPLIST] (context, playload) {
    return api.updateAppList(playload)
  },
  // 根据应用id和版本号获取应用信息
  [type.FETCH_APP_VERSION_INFO] (context, playload) {
    return api.getAppVsersion(playload.aid, playload.vid).then(data => {
      context.commit(type.FETCH_APP_VERSION_INFO, data.data)
      return data
    })
  }

}
