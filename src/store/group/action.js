/**
 * Created by liuqing on 2017/5/20.
 */
import * as type from './mutations_types'
import * as api from '../../api/group'

export default {
  [type.FATCH_ALL_GROUP] ({ commit }) {
    return api.allGroup()
      .then(({ data }) => {
        commit(type.FATCH_ALL_GROUP, data)
      })
  }
}
