/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'
// export const CONSULMARATHONSERVICENAME = localStorage.getItem('marathonName') === null ? ' ' : localStorage.getItem('marathonName')
// import { LABEL_PREFIX } from '../config'

export function listApps (curGroupId) {
  // let params = {
  //   labels: `${LABEL_PREFIX}_GROUP_ID==${curGroupId}`
  // }
  // return axios.get(`/jborg/apps`, {params: params})
  return axios.get(`/jborg/app/?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// -------------------------------
export function add (params) {
  return axios.post(`/jborg/app/createApp?force=true&consulMarathonServiceName=${localStorage.getItem('marathonName')}`, params)
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
  return axios.post(`?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}
// 获取app信息
export function getAppInfo (aid) {
  return axios.get(`/jborg/app/getApp/${aid}?embed=app.readiness&consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 更新app信息
export function updateAppInfo (aid, param) {
  return axios.put(`/jborg/app/updateApp/${aid}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}
// 删除app信息
export function delAppInfo (aid) {
  return axios.delete(`/jborg/apps/${aid}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 继续更新
export function proceedUpdate (aid, param) {
  return axios.patch(`/v2/apps/${aid}/proceed-update?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}
// 取消更新
export function cancelUpdate (aid) {
  return axios.patch(`/v2/apps/${aid}/cancel-update?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 增加容器个数
export function scaleUp (aid, param) {
  return axios.patch(`/v2/apps/${aid}/scale-up?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}
// 减少容器个数
export function scaleDown (aid, param) {
  return axios.patch(`/v2/apps/${aid}/scale-down?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}
// 获取应用版本列表
export function appVersions (aid) {
  return axios.get(`/jborg/app/getAppVersion/${aid}/versions?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 获取应用指定版本
export function getAppVsersion (aid, vid) {
  return axios.get(`/jborg/app/getAppVersion/${aid}/versions/${vid}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 删除指定应用
export function delApp (aid) {
  return axios.delete(`/jborg/app/deleteApp/${aid}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 获取应用指定实例
export function getAppTasks (aid, taskindex) {
  return axios.get(`/jborg/apps/${aid}/tasks/${taskindex}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 获取应用容器列表
export function getAppContainers (aid) {
  return axios.get(`/jborg/app/getContainersByAppId/${aid}/containers?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 重启指定应用
export function restartApp (aid) {
  return axios.post(`/jborg/apps/${aid}/restart?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 获取app的实例列表
export function getApptasks (aid) {
  return axios.get(`/jborg/apps/${aid}/tasks?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 杀掉列出的任务实例并根据请求扩缩应用
export function delAppTask (param) {
  return axios.post(`/jborg/tasks/deleteTasks?scale=false&force=false&consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}
// 杀掉列出的任务实例并根据请求扩缩应用
export function delAppTaskOrScale (param) {
  return axios.post(`/jborg/tasks/deleteTasks?scale=true&force=true&consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}
// 获取所有等待执行的任务实例，，，
export function queue () {
  return axios.get(`/jborg/queue/getQueue?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 过滤应用指定信息（appid，instances，poolname）
export function filterApps () {
  return axios.get(`/jborg/app/filterApps?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}

// 根据应用组ID获取应用列表
export function getAppByGroupId (param) {
  return axios.get(`/jborg/app/getByGroupId/${param}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}

// 循环更新应用
export function updateAppList (param) {
  return axios.put(`/jborg/app/batchUpdateApp?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}

// 根据appid获取ACL规则
export function getAppAclByAppId (id) {
  return axios.get(`/jborg/app/getAppAcl/${id}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
// 修改ACL规则
export function updateAppAcl (aid, param) {
  return axios.put(`/jborg/app/updateAppAcl/${aid}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`, param)
}
// 删除ACL规则
export function delAppAcl (aid) {
  return axios.delete(`/jborg/app/removeAppAcl/${aid}?consulMarathonServiceName=${localStorage.getItem('marathonName')}`)
}
