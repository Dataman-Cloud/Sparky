<template>
  <header style="background-color: rgb(32, 160, 255);">
    <div class="logo logo-width">
      {{sysName}}
    </div>
    <div class="header-operations">
      <el-select v-model="selectGroup" placeholder="请选择" class="groupsInfo" @change="switchGroup">
        <el-option
          v-for="item in myGroups"
          :label="item.group.name"
          :value="item.groupId"
          :key="item.groupId">
          <span style="float: left">{{ item.group.name }}</span>
          <span v-if="item.role.role !== 'superuser'" style="float: right; color: #8492a6; font-size: 13px">{{ item.role.role }}</span>
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
</template>

<script>
import {mapState} from 'vuex'
import * as user from 'api/user'
import * as userType from 'store/user/mutations_types'
import * as appType from 'store/app/mutations_types'
import store from 'store'
import router from 'vue-router'

export default {
  data () {
    return {
      sysName: 'DM/OS',
      selectGroup: this.$store.state.user.aboutme.currentGroupId
    }
  },
  methods: {
    //  退出登录
    logout: function () {
      this.$confirm('确认退出吗?', '提示', {}).then(() => {
        store.dispatch(userType.LOG_OUT).then(data => {
          router.replace({
            name: 'Login',
            query: {redirect: router.currentRoute.fullPath}
          })
        })
      }).catch(() => {

      })
    },
    switchGroup () {
      let { dispatch } = store
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
}
</style>
