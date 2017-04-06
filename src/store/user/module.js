import * as type from './type'
import * as api from '../../api/user'

const mutations = {
  [type.FETCH_ABOUTME] (state, payload) {
    state.aboutme = payload
  }
}

const actions = {
  [type.FETCH_ABOUTME] (context) {
    return api.aboutme()
      .then(data => {
        context.commit(type.FETCH_ABOUTME, data.data)
        return data
      })
  }
}

export default {
  state: {
    aboutme: {}
  },
  mutations,
  actions
}
