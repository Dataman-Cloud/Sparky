/**
 * Created by liuqing on 2017/5/20.
 */
import * as type from './mutations_types'

export default {
  [type.FATCH_ALL_GROUP] ({ groups }, payload) {
    groups.arr = payload
    groups.total = groups.arr.length
  }
}
