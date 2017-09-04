/**
 * Created by liuqing on 2017/08/16.
 */
import axios from './http'

// 获取ip池信息
export function ipamPoolInfo () {
  return axios.get('/jborg/ipam/pool')
}

// 获取net信息
export function nets () {
  return axios.get('/jborg/ipam/nets')
}

// 获取net ip 使用信息
export function netIps (params) {
  let {netName, pageNum} = params
  return axios.get(`/jborg/ipam/net/${netName}/${pageNum}`)
}

// 创建网络
export function createNet (params) {
  return axios.post(`/jborg/ipam/net`, params)
}

// 创建网络
export function releaseIp () {
  return axios.get(`/jborg/ipam/releaseIp`)
}
