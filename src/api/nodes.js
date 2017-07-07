/* eslint-disable no-multiple-empty-lines */
import axios from './http'

// 获取所有的主机
export function listNodes () {
  return axios.get('/jborg/nodes/')
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
  let {nodeIp, instanceId} = params
  return axios.get(`/jborg/nodes/${nodeIp}/instances/${instanceId}`)
}

// 获取主机上指定容器的日志
export function nodeInstanceLogs (params) {
  let {nodeIp, instanceId} = params
  let token = localStorage.getItem('token')
  let host = window.location.host
  let protocol = window.location.protocol
  let url = `${protocol}${host}/jborg/node/${nodeIp}/instances/${instanceId}/logs?Authorization=${token}`
  return new EventSource(url)
}

// 获取主机上指定容器的日志 ws
export function nodeInstanceLogsWS (params) {
  let {nodeIp, instanceId} = params
  // let token = localStorage.getItem('token')
  let url = `ws://${nodeIp}:2375/containers/${instanceId}/attach/ws?logs=0&stream=1&stdin=1&stdout=1&stderr=1`
  return new WebSocket(url)
}


// 获取主机上指定容器的状态
export function nodeInstanceStats (params) {
  let {nodeIp, instanceId} = params
  let token = localStorage.getItem('token')
  // let host = window.location.host
  let protocol = window.location.protocol
  let url = `${protocol}/jborg/node/${nodeIp}/instances/${instanceId}/stats?Authorization=${token}`
  return new EventSource(url)
}