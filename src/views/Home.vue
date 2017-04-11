<template>
  <div class="container">
    <header style="background-color: rgb(32, 160, 255);">
      <div class="logo logo-width">
        {{sysName}}
      </div>
      <div class="header-operations">
        <el-select v-model="selectGroup" placeholder="请选择" class="groupsInfo" @change="switchGroup">
          <el-option
            v-for="item in myGroups"
            :label="item.group.name"
            :value="item.groupId">
          </el-option>
        </el-select>
        <el-dropdown trigger="hover" class="userinfo">
          <span class="el-dropdown-link userinfo-inner">{{aboutMe.userName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
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
  </div>
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
        selectGroup: this.$store.state.user.aboutme.currentGroupId
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
      },
      switchGroup: function (groupId) {
        user.switchGroup(groupId)
          .then(() => {
            this.$store.dispatch(type.FETCH_ABOUTME)
            this.$router.push({name: '我的应用'})
          })
      }
    },
    mounted () {
    },
    computed: {
      ...mapState({
        aboutMe (state) {
          return state.user.aboutme
        },
        myGroups (state) {
          return state.user.aboutme.accountGroups || []
        }
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

    header {
      height: 48px;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      box-sizing: border-box;
      color: #fff;

      .header-logo {
        display: inline-block;
        vertical-align: middle
      }

      .header-operations {
        margin: 0;
        display: inline-block;
        float: right;
        padding-right: 30px;
        height: 100%;
        align-items: center;
        display: flex;
      }

      .groupsInfo {
        margin-right: 10px;
      }

      .userinfo {
        color: #fff;

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
        height: 48px;
        line-height: 48px;
        font-size: 22px;
        border-right-width: 1px;
        border-right-style: solid;
        display: inline-block;
        text-align: center;
        border-color: white;

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
      top: 48px;
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
