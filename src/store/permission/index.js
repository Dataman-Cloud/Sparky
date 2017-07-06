import { asyncRouterMap, constantRouterMap } from 'src/router'

function filterAsyncRouter (asyncRouterMap, sysResources) {
  return asyncRouterMap
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
