/**
 * Created by my9074 on 2017/4/6.
 */
import axios from './http'
import { LABEL_PREFIX } from '../config'

export function listApps (curGroupId) {
  let params = {
    labels: `${LABEL_PREFIX}_GROUP_ID==${curGroupId}`
  }
  return axios.get(`v2/apps`, {params: params})
}
