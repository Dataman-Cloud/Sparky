import * as type from './mutations_types'
import * as api from '../../api/graph'
export default {
  [type.FETCH_GRAPH] (context) {
    return api.getGraph().then(data => {
      context.commit(type.FETCH_GRAPH, data.data)
      return data
    })
  }
}
