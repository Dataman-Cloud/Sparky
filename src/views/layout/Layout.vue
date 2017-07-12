<template>
  <div class="container">
    <Navbar />
    <el-col :span="24" class="main">
      <Sidebar />
      <section class="content-container">
        <Breadcrumb />
        <App-main />
      </section>
    </el-col>
  </div>
</template>

<script>
import { Navbar, AppMain, Breadcrumb, Sidebar } from 'views/layout'
import * as userType from 'store/user/mutations_types'
import store from 'store'
export default {
  name: 'layout',
  components: {
    Navbar,
    AppMain,
    Breadcrumb,
    Sidebar
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch(userType.FETCH_ABOUTME)
      .then(() => {
        next()
      })
  }
}
</script>

<style scoped type="text/scss" lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .main {
      display: flex;
      position: absolute;
      top: 48px;
      bottom: 0px;
      overflow: hidden;
      .content-container {
        flex: 1;
        overflow-y: scroll;
        padding: 20px;
      }
    }
  }
</style>
