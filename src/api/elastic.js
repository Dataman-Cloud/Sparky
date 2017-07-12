/**
 * Created by kli on 17-6-21.
 */
import axios from './http'

// 获取所有的策略
export function allPolicies (params) {
  let page = params.page
  let pageSize = params.pageSize
  return axios.get(`/jborg/policy/policies?page=${page}&pageSize=${pageSize}`)
}

// 添加策略
export function add (params) {
  return axios.post(`/jborg/policy/create`, params)
}

// 删除策略
export function delPolicy (policyId) {
  return axios.delete(`/jborg/policy/${policyId}`)
}

// 更新策略
export function policyEdit (params) {
  return axios.put(`/jborg/policy/update`, params)
}

// 获取指定信息策略信息
export function getPolicyById (policyId) {
  return axios.get(`/jborg/policy/policies/${policyId}`)
}

// 获取扩缩历史
export function getCapabilities (params) {
  let page = params.page
  let pageSize = params.pageSize
  return axios.get(`/jborg/capability/capabilities?page=${page}&pageSize=${pageSize}`)
}
