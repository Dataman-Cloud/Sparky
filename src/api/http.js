/**
 * Created by my9074 on 2017/4/5.
 */
import axios from 'axios'
import router from '../router'
import {DEFAULT_BASE_URL} from '@/config'
import {Notification} from 'element-ui'

// axios 配置
axios.defaults.timeout = 10000
axios.defaults.baseURL = DEFAULT_BASE_URL //  可配置

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('token')) {
      config.headers.Authorization = `${localStorage.getItem('token')}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          localStorage.removeItem('token')
          router.replace({
            name: 'Login',
            query: {redirect: router.currentRoute.fullPath}
          })
          break
        default:
          Notification({
            title: '错误信息',
            message: JSON.stringify(error.response.data.data),
            type: 'error'
          })
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  })

export default axios
