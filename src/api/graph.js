/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

export function getGraph () {
  return axios.get(`/jborg/dashboard/getResource?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
