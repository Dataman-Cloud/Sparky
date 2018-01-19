/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

export function login (userName, password, kaptchaCode) {
  let data = {
    'userName': userName,
    'password': password,
    'kaptchaCode': kaptchaCode
  }
  return axios.post(`/jborg/accounts/login`, data)
}

export function logout () {
  return axios.post(`/jborg/accounts/logout`)
}

export function aboutme () {
  return axios.get(`/jborg/accounts/aboutme`)
}

export function userPassChg (context) {
  return axios.put(`/jborg/accounts/password`, context)
}
export function getUser (userId) {
  return axios.get(`/jborg/accounts/getUser/${userId}`)
}

export function switchGroup (groupId) {
  // return axios.patch(`/jborg/groups/currentgroup`, {groupId: groupId})
  return axios.get(`/jborg/groups/currentgroup/${groupId}`)
}

export function users () {
  return axios.get(`/jborg/accounts/getAll`)
}

export function userDetail (userId) {
  return axios.get(`/jborg/accounts/getUser/${userId}`)
}

// 用户添加 －－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
export function userAdd (context) {
  return axios.post(`/jborg/accounts/create`, context)
}

// 禁止用户
export function userDisable (accountId) {
  return axios.put(`/jborg/accounts/${accountId}/disable`)
}

// 启用用户
export function userEnable (accountId) {
  return axios.put(`/jborg/accounts/${accountId}/enable`)
}

// 重置密码
export function userPassReset (param) {
  let id = param.id
  return axios.put(`/jborg/accounts/${id}/resetpassword`, param.pwd)
}

// 删除用户 userPassReset
export function userDel (accountId) {
  return axios.delete(`/jborg/accounts/delete/${accountId}`)
}
// 更新用户
export function userEdit (context) {
  return axios.put(`/jborg/accounts/update`, context)
}

// 仓库认证操作 －－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
// 仓库列表
export function listRepo () {
  return axios.get(`/jborg/external_registries/getAll`)
}
// 仓库添加
export function repoAdd (context) {
  return axios.post(`/jborg/external_registries/create`, context)
}
// 仓库编辑
export function repoEdit (param) {
  // {ip:xx,form:xx}
  let repoId = param.id
  return axios.put(`/jborg/external_registries/update/${repoId}`, param.repo)
}
// 仓库删除
export function repoDel (repoId) {
  return axios.delete(`/jborg/external_registries/delete/${repoId}`)
}

// 用户组操作 －－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
// 获取所有用户组
export function groups () {
  return axios.get(`/jborg/groups/getAll`)
}
// 获取指定用户组的所有用户
export function usersInGroup (groupId) {
  return axios.get(`/jborg/groups/${groupId}/accounts`)
}
// 用户组移除用户userAddInGroup
export function userDelInGroup (prams) {
  let userid = prams.userId
  let groupid = prams.groupId
  return axios.delete(`/jborg/accounts/${userid}/groups/${groupid}`)
}
export function delInGroup (prams) {
  let accountId = prams.accountId
  let groupId = prams.groupId
  return axios.delete(`/jborg/accounts/${accountId}/groups/${groupId}`)
}
// 用户组添加用户
export function userAddInGroup (context) {
  return axios.post(`/jborg/accounts/joingroup`, context)
}
// 用户组添加
export function groupAdd (context) {
  return axios.post(`/jborg/groups/create`, context)
}
// 用户组编辑
export function groupEdit (context) {
  return axios.put(`/jborg/groups/update`, context)
}
// 用户组删除
export function groupDel (groupId) {
  return axios.delete(`/jborg/groups/delete/${groupId}`)
}
