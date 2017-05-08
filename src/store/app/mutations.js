/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_APPS] (state, payload) {
    state.apps.apps = payload
    state.apps.total = state.apps.apps.length
  }
}
