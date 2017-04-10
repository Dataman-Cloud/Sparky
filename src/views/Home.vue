<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="10" class="logo logo-width">
        {{sysName}}
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link userinfo-inner">{{aboutMe.userName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <aside class="menu-expanded">
        <nav-menu></nav-menu>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item v-for="item in $route.matched">
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
  import NavMenu from './NavMenu'
  import store from '../store'
  import {mapState} from 'vuex'
  import * as user from '../api/user'
  import * as type from '../store/user/type'

  export default {
    components: {
      NavMenu
    },
    data () {
      return {
        sysName: 'DM/OS',
        collapsed: false
      }
    },
    beforeRouteEnter (to, from, next) {
      store.dispatch(type.FETCH_ABOUTME)
        .then(() => {
          next()
        })
    },
    methods: {
      //  退出登录
      logout: function () {
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          user.logout()
            .then(data => {
              localStorage.removeItem('token')
              this.$router.push('/login')
            })
        }).catch(() => {

        })
      }
    },
    mounted () {
    },
    computed: {
      ...mapState({
        aboutMe (state) {
          return state.user.aboutme
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

  .header {
    height: 60px;
    line-height: 60px;
    background: #20a0ff;
    color: #fff;

  .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;

  .userinfo-inner {
    cursor: pointer;
    color: #fff;

  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
  }

  }
  }
  .logo {
    height: 60px;
    font-size: 22px;
    padding-left: 20px;
    padding-right: 20px;
    border-color: rgba(238, 241, 146, 0.3);
    border-right-width: 1px;
    border-right-style: solid;

  img {
    width: 40px;
    float: left;
    margin: 10px 10px 10px 18px;
  }

  .txt {
    color: #fff;
  }

  }
  .logo-width {
    width: 230px;
  }

  .tools {
    padding: 0px 23px;
    width: 14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
  }

  }
  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;

  aside {
    flex: 0 0 230px;
    width: 230px;

  .el-menu {
    height: 100%;
  }

  }
  .menu-expanded {
    flex: 0 0 230px;
    width: 230px;
  }

  .content-container {
    flex: 1;
    overflow-y: scroll;
    padding: 20px;

  .breadcrumb-container {

  .title {
    width: 200px;
    float: left;
    color: #475669;
  }

  .breadcrumb-inner {
    float: right;
  }

  }
  .content-wrapper {
    background-color: #fff;
    box-sizing: border-box;
  }

  }
  }
  }
</style>
