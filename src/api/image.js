/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

export function listGroupImages () {
  return axios.get(`v1/registry/repositories/mine`)
}

export function listPublicImages () {
  return axios.get(`v1/registry/repositories/mine`, {params: {keywords: 'library'}})
}
