/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'

export default {
  // 应用模版列表
  [type.FETCH_SELECT_MODEL] (state, payload) {
    state.model.models = payload
    state.model.total = state.model.models.length
  },
  // 单一应用模版列表
  [type.FETCH_SELECT_MODELID] (state, model) {
    state.model.model = model
  },
  // 上传程序包文件
  [type.FETCH_UPLOAD_CATALOGSTACK] (state, model) {
    state.model.uploadPackageFilePath = model
  }
}
