/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

// 获取集群列表
export function listCluster () {
  return axios.get(`/jborg/clusters/`)
}

// 添加集群
export function addCluster (params) {
  return axios.post(`/jborg/clusters/`, params)
}

// 删除集群
export function delCluster (clusterId) {
  return axios.delete(`/jborg/clusters/${clusterId}`)
}

// 获取单个集群
export function getCluster (clusterId) {
  return axios.get(`/jborg/clusters/${clusterId}`)
}

// 获得按vcluster分组的node列表
export function nodesGroupByVclusters () {
  return axios.get(`/jborg/nodes_group_by_vclusters`)
}

// 获得用户组的vcluster列表
export function listClusterByGroup (groupId) {
  return axios.get(`/jborg/clusters/bygroup/${groupId}`)
}
// 添加或删除在集群上指定的主机
export function changeNodeInCluster (params) {
  return axios.patch(`/jborg/nodes`, params)
}

