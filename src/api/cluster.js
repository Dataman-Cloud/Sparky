/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

export function listCluster () {
  return axios.get(`v1/clusters`)
}
