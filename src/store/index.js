import Vuex from 'vuex'
import Vue from 'vue'
import roles from './roles'
import syssrc from './syssrc'
import syssrcrole from './syssrcrole'
import user from './user'
import graph from './graph'
import app from './app'
import image from './image'
import clusters from './clusters'
import node from './node'
import group from './group'
import appgroups from './appgroups'
import audit from './audit'
import model from './model'
import elastic from './elastic'
import permission from './permission'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    roles,
    syssrc,
    syssrcrole,
    user,
    graph,
    app,
    image,
    clusters,
    node,
    group,
    appgroups,
    audit,
    model,
    elastic,
    permission
  },
  getters
})
