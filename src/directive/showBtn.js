// showBtn
import store from '../store'

export default {
  inserted (el, bindings) {
    const sys = store.getters.sysResources
    const name = bindings.value
    if (Array.isArray(sys) && sys.length > 0) {
      if (bindings.value) {
        for (let s of sys) {
          if (s.type === 1 && s.resourceName === name) el.setAttribute('style', 'display:none')
        }
      }
    }
  }
}
