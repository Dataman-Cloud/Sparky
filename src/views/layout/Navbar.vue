<template>
  <header>
    <div class="logo logo-width"><img src="../../assets/dataman.png" alt=""></div>
    <div class="header-operations">
<!--      <el-select v-model="selectGroup" placeholder="请选择" class="groupsInfo" @change="switchGroup">
        <el-option
          v-for="item in myGroups"
          :label="item.group.name"
          :value="item.groupId"
          :key="item.groupId">
          <span style="float: left">{{ item.group.name }}</span>
          <span v-if="item.role.role !== 'superuser'" style="float: right; color: #8492a6; font-size: 13px">{{ item.role.role }}</span>
        </el-option>
      </el-select> -->

     <!-- <span><strong>选择marathon:</strong></span> -->
      <el-select v-model="marathonVal" placeholder="请选择Marathon" v-loading.fullscreen.lock="fullscreenLoading">
        <el-option
          v-for="item in marathonList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> &nbsp;

      <el-dropdown trigger="hover" class="userinfo">
        <span class="el-dropdown-link userinfo-inner">{{aboutMe.userName}}<i class="el-icon-caret-bottom" style="margin-left:10px;font-size:12px"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import {mapState} from 'vuex'
import * as user from 'api/user'
import * as userType from 'store/user/mutations_types'
import * as appType from 'store/app/mutations_types'
import store from 'store'
import * as appgroupTypes from 'store/appgroups/mutations_types'
// import router from 'router'

export default {
  data () {
    return {
      fullscreenLoading: false,
      marathonVal: 'marathon-app-10.0.0.202:8080',
      sysName: 'DM/OS'
//      selectGroup: this.$store.state.user.aboutme.currentGroupId
    }
  },
  watch: {
    marathonVal (curval, oldval) {
//      console.log(88888888888)
      window.localStorage.setItem('marathonName', curval)
      this.fullscreenLoading = true
      setTimeout(() => {
        this.fullscreenLoading = false
      }, 1000)
      this.$router.push({ name: '我的应用' })
    }
  },
  methods: {
    // 退出登录
    logout: function () {
      /*      let toLogin = () => router.replace({
        name: 'Login',
        query: {redirect: router.currentRoute.fullPath}
      }) */
      this.$confirm('确认退出吗?', '提示', {}).then(() => {
        store.dispatch(userType.LOG_OUT).then(data => {
          location.reload()
        })
      }).catch(() => {
        //   toLogin()
      })
    },
    listApp () {
      this.$store.dispatch(appType.FETCH_QUEUE).then(() => {
        this.$store.dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
      })
    },
    switchGroup () {
      let {dispatch} = store
      user.switchGroup(this.selectGroup)
        .then(data => {
          dispatch(userType.PUT_SYSRESOURCES, data.sysResources).then(() =>
            dispatch(userType.FETCH_ABOUTME)
              .then(() => {
                console.log(appType + '--------------')
                this.$router.push({path: '/app/list/'})
                /*
                 dispatch(appType.FETCH_APPS, this.selectGroup)
                 .then(() => this.$router.push({name: '全部的应用'}))
                 */
              })
          )
        })
    }
  },
  computed: {
    ...mapState({
      marathonList (state) {
        return state.appgroups.marathonNameVoList
      },
      aboutMe (state) {
        return state.user.aboutme
      },
      myGroups (state) {
        return state.user.aboutme.accountGroups || []
      }
    })
  },
  mounted () {
    this.listApp()
  }
}
</script>

<style lang="scss">
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
    width: calc(100% - 261px);
    line-height: 48px;
    margin: 0;
    display: inline-block;
    float: right;
    padding-right: 30px;
    height: 100%;
    text-align: right;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .groupsInfo {
    margin-right: 10px;
  }

  .userinfo {
    color: #fff;

    .userinfo-inner {
      cursor: pointer;
      color: #343838;
      font-size: 20px;

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
    font-size: 22px;
    border-right-width: 1px;
    border-right-style: solid;
    display: inline-block;
    border-color: white;
    background: #1b2d3e;
    img {
      width: 150px;
      display: block;
      margin: 5px auto;
    }

    .txt {
      color: #fff;
    }

  }
  .logo-width {
    width: 230px;
  }
}
</style>
