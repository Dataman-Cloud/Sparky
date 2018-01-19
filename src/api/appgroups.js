/**
 * Created by biancl on 2017-05-26.
 */
import axios from './http'
// export const CONSULMARATHONSERVICENAME = localStorage.getItem('marathonName') === null ? ' ' : localStorage.getItem('marathonName')

// 获取所有的应用分组
export function all () {
  return axios.get(`/jborg/appGroup/getAll?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 获取所有的应用分组
export function self () {
  return axios.get(`/jborg/appGroup/getSelfs?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 应用列表创建应用组下拉表数据
export function allAppGroupByUserName (params) {
  return axios.get(`/jborg/appGroup/getCanCreateGroupListByAccount`)
}
// 获取marathon列表
export function marathonList (params) {
  return axios.get(`/jborg/appGroup/getMarathonServiceNameList`)
}
// 添加应用分组
export function add (params) {
  return axios.post(`/jborg/appGroup/create?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, params)
}
// 删除应用分组
export function del (appgroupId) {
  return axios.delete(`/jborg/appGroup/delete/${appgroupId}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 修改应用分组
export function put (appgroupId, params) {
  return axios.put(`/jborg/appGroup/${appgroupId}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, params)
}
// 获取单个应用组
export function get (appgroupId) {
  return axios.get(`/jborg/appGroup/get/${appgroupId}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
