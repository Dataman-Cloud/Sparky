import Vuex from 'vuex'
import Vue from 'vue'
import user from './user'
import app from './app'
import image from './image'
import resource from './resource'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app,
    image,
    resource
  }
})
