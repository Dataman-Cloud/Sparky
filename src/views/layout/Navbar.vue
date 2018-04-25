<template>
  <header>
    <div class="logo logo-width"><img src="../../assets/shangzheng-logo.svg" alt=""></div>
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
      <el-select v-model="marathonVal" placeholder="请选择Marathon" v-loading.fullscreen.lock="fullscreenLoading" style="width: 280px;" @change="changeMarathon">
        <el-option
          v-for="item in marathonList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select> &nbsp;

      <el-dropdown trigger="hover" class="userinfo">
        <span class="el-dropdown-link userinfo-inner">{{aboutMe.userName}}<i class="el-icon-caret-bottom" style="margin-left:10px;font-size:12px"></i></span>
        <span style="padding-left: 10px;color: #616161">{{aboutMe.roleName}}</span>
        <el-dropdown-menu slot="dropdown" style="margin-right:80px">
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import {mapState} from 'vuex'
// import * as user from 'api/user'
import * as userType from 'store/user/mutations_types'
import store from 'store'
import * as appgroupTypes from 'store/appgroups/mutations_types'
// import router from 'router'

export default {
  data () {
    return {
      currentMarathon: '',
      fullscreenLoading: false,
      marathonVal: null,
      sysName: 'DM/OS'
    }
  },
//  watch: {
//    marathonVal (curval, oldval) {
//      if (this.marathonVal !== null) {
//        window.localStorage.setItem('marathonName', curval)
//        this.$store.dispatch(appgroupTypes.MARATHON_CHANGE_LOADING).then(() => {
//          if (this.$route.name === '我的应用') {
//            console.log('------RefreshPage')
//            // this.$router.push({name: 'RefreshPage', param: {toName: '我的应用'}})
//          } else {
//            this.$router.push({name: '我的应用'})
//          }
//        })
//      }
//    }
//  },
  methods: {
    // 退出登录
    logout: function () {
      /*      let toLogin = () => router.replace({
        name: 'Login',
        query: {redirect: router.currentRoute.fullPath}
      }) */
      this.$confirm('确认退出吗?', '提示', {}).then(() => {
        store.dispatch(userType.LOG_OUT).then(data => {
          localStorage.removeItem('marathonName')
          localStorage.removeItem('userName')
          location.reload()
        })
      }).catch(() => {
        //   toLogin()
      })
    },
    changeMarathon () {
      console.log('changeMarathon')
      console.log(this.marathonVal)
      if (window.localStorage.getItem('marathonName') !== this.marathonVal) {
        window.localStorage.setItem('marathonName', this.marathonVal)
        if (this.$route.name === '我的应用') {
          console.log('------RefreshPage')
          this.$router.push({name: 'RefreshPage', params: {toName: '我的应用', params: null}})
        } else {
          this.$router.push({name: '我的应用'})
        }
      }
    },
    marathonNameVoList () {
      this.$store.dispatch(appgroupTypes.FATCH_MARATHON)
        .then((data) => {
          if (data.resultCode === '00') {
            let localval = window.localStorage.getItem('marathonName')
            if (localval) {
              this.marathonVal = localval
            } else {
              this.marathonVal = data.data[0].value
            }
          } else {
            // 赋值
            this.marathonVal = ''
          }
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
    this.marathonNameVoList()
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
