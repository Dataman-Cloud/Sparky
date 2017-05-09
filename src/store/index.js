import Vuex from 'vuex'
import Vue from 'vue'
import user from './user'
import app from './app'
import image from './image'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app,
    image
  }
})
