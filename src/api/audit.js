import axios from './http'

export function auditSelect (param) {
  return axios.get(`/jborg/audits/getAuditsList?${param}`)
  // ?endTime=1496382891&operation=AccountLogout&page=1&size=100&startTime=1495778091
  // return axios.get('v1/audit', {'endTime': '1496382891', 'operation': 'AccountLogout', 'page': 1, 'size': 100, 'startTime': '1495778091'})
}

export function download (param) {
  return axios.get(`/jborg/audits/exportExcel?${param}`)
}

export function targettypes (param) {
  return axios.get('/jborg/audits/getTargettypes')
}

export function operations (param) {
  if (param === undefined) {
    return axios.get('/jborg/audits/getOperations')
  } else {
    return axios.get(`/jborg/audits/getOperations?${param.param}`)
  }
}
