const getters = {
  token: state => state.user.token,
  permissionRoutes: state => state.permission.routers,
  appendRouters: state => state.permission.appendRouters,
  sysResources: state => state.user.sysResources
}

export default getters
