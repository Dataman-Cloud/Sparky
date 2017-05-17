/**
 * Created by my9074 on 2017/4/8.
 */
import * as type from './mutations_types'
import * as api from '../../api/cluster'

export default {
  [type.FETCH_CLUSTERS] (context) {
    return api.listCluster()
      .then(data => {
        context.commit(type.FETCH_CLUSTERS, data.data)
        return data
      })
  }
}
