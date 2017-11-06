/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

//  获取树型菜单
export function getSysResRole (roleId) {
  return axios.get(`/jborg/sysResource/getSysResourceRole/${roleId}`)
}
