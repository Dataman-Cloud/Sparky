/**
 * Created by liuqing on 2018/01/25.
 */
import * as type from './mutations_types'

export default {
  [type.FETCH_ESLOG] (state, payload) {
    state.eslogs.logs = payload
  }
}
