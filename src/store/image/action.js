import * as type from './mutations_types'
import * as api from '../../api/image'

export default {
  [type.FETCH_TABLE_IMAGES] ({dispatch}, playload) {
    let {actionType} = playload
    switch (actionType) {
      case type.FETCH_GROUP_IMAGES:
        return dispatch(type.FETCH_GROUP_IMAGES)
      case type.FETCH_PUBLIC_IMAGES:
        return dispatch(type.FETCH_PUBLIC_IMAGES)
    }
  },
  [type.FETCH_GROUP_IMAGES] (context) {
    return api.listGroupImages()
      .then(data => {
        context.commit(type.FETCH_GROUP_IMAGES, data.data)
        return data
      })
  },
  [type.FETCH_PUBLIC_IMAGES] (context) {
    return api.listPublicImages()
      .then(data => {
        context.commit(type.FETCH_PUBLIC_IMAGES, data.data)
        return data
      })
  }
}
