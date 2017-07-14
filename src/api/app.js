/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'
// import { LABEL_PREFIX } from '../config'

export function listApps (curGroupId) {
  // let params = {
  //   labels: `${LABEL_PREFIX}_GROUP_ID==${curGroupId}`
  // }
  // return axios.get(`/jborg/apps`, {params: params})
  return axios.get(`/jborg/app/`)
}
// -------------------------------
export function add (params) {
  return axios.post(`/jborg/app/createApp?force=true`, params)
}

export function listModel (params) {
  return axios.get('/jborg/catalogs/getCatalogs', params)
}

export function removeModel (modelID) {
  return axios.delete('/jborg/catalogs/' + modelID)
}

export function createModel (name, json, desc) {
  return axios.post('/jborg/catalogs/createCatalogs', {name: name, json: json, desc: desc, icon: '@/home/user1/Desktop/test.jpg'})
}

export function selectModelId (modelID) {
  return axios.get('/jborg/catalogs/' + modelID.modelID)
}

export function updateModel (name, json, desc, id) {
  return axios.post(`/jborg/catalogs/${id}`, {name: name, json: json, desc: desc, icon: '@/home/user1/Desktop/test.jpg'})
}
export function uploadCatalogsStack (file) {
  console.log('--------ppppppppppppppppp-----------')
  console.log(file)
  let formdata = new FormData()
  formdata.append('GroupName', file.GroupName)
  formdata.append('AppName', file.AppName)
  formdata.append('Version', file.Version)
  formdata.append('PackageType', file.PackageType)
  formdata.append('upload', file.file)
  return axios({
    url: file.url,
    method: 'post',
    data: formdata,
    headers: {'Content-Type': 'multipart/form-data'}
  })
}
export function listRepositories () {
  return axios.get('/jborg/external_registries')
}

export function userAdd () {
  return axios.get(`/jborg/accounts`)
}

// -------------------------------
// 添加app
export function addApp (param) {
  return axios.post(param)
}
// 获取app信息
export function getAppInfo (aid) {
  return axios.get(`/jborg/app/getApp/${aid}?embed=app.readiness`)
}
// 更新app信息
export function updateAppInfo (aid, param) {
  return axios.put(`/jborg/app/updateApp/${aid}`, param)
}
// 删除app信息
export function delAppInfo (aid) {
  return axios.delete(`/jborg/apps/${aid}`)
}
// 继续更新
export function proceedUpdate (aid, param) {
  return axios.patch(`/v2/apps/${aid}/proceed-update`, param)
}
// 取消更新
export function cancelUpdate (aid) {
  return axios.patch(`/v2/apps/${aid}/cancel-update`)
}
// 增加容器个数
export function scaleUp (aid, param) {
  return axios.patch(`/v2/apps/${aid}/scale-up`, param)
}
// 减少容器个数
export function scaleDown (aid, param) {
  return axios.patch(`/v2/apps/${aid}/scale-down`, param)
}
// 获取应用版本列表
export function appVersions (aid) {
  return axios.get(`/jborg/app/getAppVersion/${aid}/versions`)
}
// 获取应用指定版本
export function getAppVsersion (aid, vid) {
  return axios.get(`/jborg/app/getAppVersion/${aid}/versions/${vid}`)
}
// 删除指定应用
export function delApp (aid) {
  return axios.delete(`/jborg/app/deleteApp/${aid}`)
}
// 获取应用指定实例
export function getAppTasks (aid, taskindex) {
  return axios.get(`/jborg/apps/${aid}/tasks/${taskindex}`)
}
// 获取应用容器列表
export function getAppContainers (aid) {
  return axios.get(`/jborg/app/getContainersByAppId/${aid}/containers`)
}
// 重启指定应用
export function restartApp (aid) {
  return axios.post(`/jborg/apps/${aid}/restart`)
}
// 获取app的实例列表
export function getApptasks (aid) {
  return axios.get(`/jborg/apps/${aid}/tasks`)
}
// 杀掉列出的任务实例并根据请求扩缩应用
export function delAppTask (param) {
  return axios.post(`/jborg/tasks/deleteTasks?scale=false&force=false`, param)
}
// 杀掉列出的任务实例并根据请求扩缩应用
export function delAppTaskOrScale (param) {
  return axios.post(`/jborg/tasks/deleteTasks?scale=true&force=true`, param)
}
// 获取所有等待执行的任务实例，，，
export function queue () {
  return axios.get(`/jborg/queue/getQueue`)
}
// 过滤应用指定信息（appid，instances，poolname）
export function filterApps () {
  return axios.get(`/jborg/app/filterApps`)
}

// 根据应用组ID获取应用列表
export function getAppByGroupId (param) {
  return axios.get(`/jborg/app/getByGroupId/${param}`)
}

// 循环更新应用
export function updateAppList (param) {
  return axios.put('/jborg/app/batchUpdateApp ', param)
}
