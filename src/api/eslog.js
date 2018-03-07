/**
 * Created by liuqing on 2018/01/25.
 */
import axios from './http'

// 查询日志
export function search (params) {
  return axios.post(`/jborg/eslog/`, params)
}
