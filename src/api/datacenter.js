/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

export function getDataCenters () {
  return axios.get(`/jborg/datacenter/getAll`)
}
// 添加
export function addDataCenter (context) {
  return axios.post(`/jborg/datacenter/create`, context)
}
// 删除
export function dataCenterDel (dcId) {
  return axios.delete(`/jborg/datacenter/delete/${dcId}`)
}
// 修改
export function dataCenterUpdate (context, dcId) {
  return axios.put(`/jborg/datacenter/update/${dcId}`, context)
}
