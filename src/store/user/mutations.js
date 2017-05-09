/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_ABOUTME] (state, payload) {
    state.aboutme = payload
  },
  [type.FETCH_USERS] (state, payload) {
    state.users.users = payload
    state.users.total = state.users.users.length
  }
}
