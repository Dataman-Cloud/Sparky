/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

export function getFirstMenuResource () {
  return axios.get(`/jborg/sysResource/getFirstMenuResource`)
}
export function getSecondMenuResource (parentId) {
  return axios.get(`/jborg/sysResource/getMenuResourceByParentId/${parentId}`)
}
// 获取树型菜单
export function getAllMenuResource () {
  return axios.get(`/jborg/sysResource/getResourceTree`)
}
// 获取树型菜单(选中)
export function getCheckedMenuResource (roleId) {
  return axios.get(`/jborg/sysResource/getResourceTreeByRoleId/${roleId}`)
}
