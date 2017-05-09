/**
 * Created by my9074 on 2017/5/9.
 */
export default {
  isSuperUser: state => {
    return state.aboutme.currentRole === 'superuser'
  }
}
