/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_GROUP_IMAGES] (state, payload) {
    state.images.images = payload
    state.images.total = state.images.images.length
  },
  [type.FETCH_PUBLIC_IMAGES] (state, payload) {
    state.images.images = payload
    state.images.total = state.images.images.length
  }
}
