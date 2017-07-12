import { asyncRouterMap, constantRouterMap } from 'src/router'

function IsInSysResource (resources, route) {
  if (route && route.name) {
    return resources.some(resource => route.name === resource.resourceName)
  }
  return true
}

function filterAsyncRouter (asyncRouterMap = [], sysResources = []) {
  const accessRouters = asyncRouterMap.filter(route => {
    if (IsInSysResource(sysResources, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, sysResources)
      }
      return true
    }
    return false
  })
  return accessRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    appendRouters: []
  },
  mutations: {
    SET_ROUTERS (state, routers) {
      state.appendRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', filterAsyncRouter(asyncRouterMap, data))
        resolve()
      })
    }
  }
}

export default permission
