/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'
import * as api from '../../api/user'

export default {
  [type.FETCH_ABOUTME] (context) {
    return api.aboutme()
      .then(data => {
        context.commit(type.FETCH_ABOUTME, data.data)
        return data
      })
  },
  [type.FETCH_USERS] (context) {
    return api.users()
      .then(data => {
        context.commit(type.FETCH_USERS, data.data)
        return data
      })
  }
}
