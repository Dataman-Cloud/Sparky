/* eslint-disable no-multiple-empty-lines */
import axios from './http'
import store from 'store'
export const CONSULMARATHONSERVICENAME = ''
// 获取所有的主机
export function listNodes () {
  return axios.get(`/jborg/nodes/?consulMarathonServiceName=${CONSULMARATHONSERVICENAME}`)
}

// 获取资源统计信息
export function metricsSnapshot () {
  return axios.get('/jborg/metricsSnapshot/')
}

// 获取指定主机的信息
export function nodeInfo (nodeIp) {
  return axios.get(`/jborg/nodes/${nodeIp}/info`)
}

// 获取指定主机的容器列表
export function nodeInstances (nodeIp) {
  return axios.get(`/jborg/nodes/${nodeIp}/instances`)
}

// 获取指定主机的镜像列表
export function nodeImages (nodeIp) {
  return axios.get(`/jborg/nodes/${nodeIp}/images`)
}

// 删除指定主机上的指定镜像
export function delNodeImage (params) {
  let {nodeIp, imageId} = params
  return axios.delete(`/jborg/nodes/${nodeIp}/images/${imageId}`)
}

// 获取主机上指定容器的信息
export function nodeInstanceInfo (params) {
  let {nodeIp, instanceId, byName} = params
  return axios.get(`/jborg/nodes/${nodeIp}/instances/${instanceId}?byName=${byName}`)
}

// 获取主机上指定容器的日志
export function nodeInstanceLogs (params) {
  let {nodeIp, instanceId} = params
  let token = store.getters.token
  let protocol = window.location.protocol
  let url = `${protocol}/jborg/node/${nodeIp}/instances/${instanceId}/logs?Authorization=${token}`
  return new EventSource(url)
}

// 获取主机上指定容器的日志 ws
export function nodeInstanceLogsWS (params) {
  let {nodeIp, instanceId} = params
  let hostname = window.location.hostname
  let port = window.location.port
  // let token = localStorage.getItem('token')
  let url = `ws://${hostname}:${port}/jborg/logs?ws_nodeip=${nodeIp}&ws_cid=${instanceId}`
  return new WebSocket(url)
}


// 获取主机上指定容器的状态
export function nodeInstanceStats (params) {
  let {nodeIp, instanceId} = params
  let token = store.getters.token
  // let host = window.location.host
  let protocol = window.location.protocol
  let url = `${protocol}/jborg/node/${nodeIp}/instances/${instanceId}/stats?Authorization=${token}`
  return new EventSource(url)
}
