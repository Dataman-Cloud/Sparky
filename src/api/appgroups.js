/**
 * Created by biancl on 2017-05-26.
 */
import axios from './http'
// 获取所有的应用分组
export function all () {
  return axios.get(`/jborg/appGroup/getAll`)
}
// 获取所有的应用分组
export function self () {
  return axios.get(`/jborg/appGroup/getSelfs`)
}
// 添加应用分组
export function add (params) {
  return axios.post(`/jborg/appGroup/create`, params)
}
// 删除应用分组
export function del (appgroupId) {
  return axios.delete(`/jborg/appGroup/delete/${appgroupId}`)
}
// 修改应用分组
export function put (appgroupId, params) {
  return axios.put(`/jborg/appGroup/${appgroupId}`, params)
}
// 获取单个应用组
export function get (appgroupId) {
  return axios.get(`/jborg/appGroup/get/${appgroupId}`)
}
