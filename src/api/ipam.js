/**
 * Created by liuqing on 2017/11/13.
 */

import axios from './http'

// 获取ip池
export function listIpPool () {
  return axios.get('/jborg/ipam/ippool/')
}

// 刷新IP池
export function releaseIpPool () {
  return axios.get('/jborg/ipam/ippool/releaseIp')
}

// 创建macvlan网络
export function addNetwork (param) {
  return axios.post('/jborg/ipam/network/', param)
}

// 获取所有slave主机
export function listNode () {
  return axios.get('/jborg/ipam/node/')
}

// 获取所有slave主机网络
export function listNodeNetwork () {
  return axios.get('/jborg/ipam/network/')
}

// 分页获取指定主机指定网络的ip信息
export function listNodeIpamInfo (node, netName, pageNum) {
  return axios.get(`/jborg/ipam/node/${node}/${netName}/${pageNum}`)
}
