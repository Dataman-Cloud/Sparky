/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'
import * as api from '../../api/app'
export default {
  [type.FETCH_SELECT_MODEL] (context, params) {
    console.log(params.curGroupId)
    return api.listModel(params)
      .then(data => {
        context.commit(type.FETCH_SELECT_MODEL, data.data)
        return data
      })
  },
  [type.FETCH_REMOVE_MODEL] (context, modelID) {
    return api.removeModel(modelID.modelID)
    // 该操作为删除操作，不需更新数据
    /*
     .then(data => {
     context.commit(type.FETCH_APPS, data.data)
     return data
     })
     */
  },
  [type.FETCH_CREATE_MODEL] (context, modelInfo) {
    let [name, json, desc] = [modelInfo.modelInfo.name, modelInfo.modelInfo.json, modelInfo.modelInfo.desc]
    return api.createModel(name, json, desc)
  },
  [type.FETCH_SELECT_MODELID] (context, modelID) {
    return api.selectModelId(modelID)
      .then(data => {
        context.commit(type.FETCH_SELECT_MODELID, data.data)
        return data
      })
  },
  [type.FETCH_UPDATA_MODEL] (context, modelInfo) {
    let [name, json, desc, id] = [modelInfo.modelInfo.name, modelInfo.modelInfo.json, modelInfo.modelInfo.desc, modelInfo.modelInfo.id]
    return api.updateModel(name, json, desc, id)
  },
  [type.FETCH_UPLOAD_CATALOGSTACK] (context, file) {
    return api.uploadCatalogsStack(file)
      .then(data => {
        context.commit(type.FETCH_UPLOAD_CATALOGSTACK, data.data)
        return data
      })
  }
}
