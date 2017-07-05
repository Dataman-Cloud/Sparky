import * as type from './mutations_types'

export default {
  [type.FETCH_AUDIT_SELECT] (state, payload) {
    payload.audits.forEach((value, index) => {
      try {
        payload.audits[index].resultMessage = JSON.parse(payload.audits[index].result)
        payload.audits[index].requestMessage = JSON.parse(payload.audits[index].request)
      } catch (e) {
        payload.audits[index].resultMessage = {'msg': payload.audits[index].result}
        payload.audits[index].requestMessage = {'msg': payload.audits[index].request}
      }
    })
    state.audit.audit = payload
  },
  [type.FETCH_AUDIT_OPERATIONS] (state, payload) {
    state.audit.operations = payload
  },
  [type.FETCH_AUDIT_TARGETTYPES] (state, payload) {
    state.audit.targettypes = payload
  }
}
