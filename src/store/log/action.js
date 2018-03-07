/**
 * Created by liuqing on 2018/01/25.
 */
import * as type from './mutations_types'
import * as api from '../../api/eslog'

export default {
  [type.FETCH_ESLOG] (context, playload) {
    return api.search(playload).then(data => {
      context.commit(type.METRICS_SNAPSHOT, data.data)
      return data
    })
  }
}
