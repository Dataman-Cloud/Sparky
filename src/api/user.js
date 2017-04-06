/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'

export function login (data) {
  return axios.post(`v1/login`, data)
}

export function logout () {
  return axios.post(`v1/logout`)
}

export function aboutme () {
  return axios.get(`v1/aboutme`)
}
