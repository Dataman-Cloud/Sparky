/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

export function getRoles () {
  return axios.get(`/jborg/sysRole/getSysRoles`)
}
// 用户角色添加
export function sysRoleAdd (context) {
  return axios.post(`/jborg/sysRole/createSysRole`, context)
}
// 用户角色删除
export function sysRoleDel (sysRoleId) {
  return axios.delete(`/jborg/sysRole/deleteSysRole/${sysRoleId}`)
}
// 用户角色修改
export function sysRoleUpdate (context) {
  return axios.put(`/jborg/sysRole/updateSysRole`, context)
}
// 根据用户ID获取角色ID
export function getRoleIdByUserId (id) {
  return axios.get(`/jborg/sysRole/getRoleIdByAccount/${id}`)
}
