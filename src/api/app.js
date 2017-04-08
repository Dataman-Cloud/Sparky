/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'
import { LABEL_PREFIX } from '../config'

export function listMyApps (accountName, accountId) {
  let params = {
    fields: `runAs==${accountName.toLowerCase()}`,
    labels: `${LABEL_PREFIX}_USER_ID==${accountId}`
  }
  return axios.get(`v2/apps`, {params: params})
}

export function listGroupApps (curGroupName, curGroupId) {
  let params = {
    fields: `runAs==${curGroupName.toLowerCase()}`,
    labels: `${LABEL_PREFIX}_GROUP_ID==${curGroupId}`
  }
  return axios.get(`v2/apps`, {params: params})
}

export function listAllApps () {
  return axios.get(`v2/apps`)
}
