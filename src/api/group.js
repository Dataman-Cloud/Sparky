import axios from './http'

// 获取所有的分组
export function allGroup () {
  return axios.get(`jborg/groups/getAll`)
}
