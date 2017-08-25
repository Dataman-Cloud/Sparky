<template>
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px"
           class="demo-ruleForm login-container" >
    <h3 class="title">系统登录</h3>
    <el-form-item prop="userName">
      <el-input type="text" v-model="loginForm.userName" auto-complete="off" placeholder="账号" @keyup.enter.native="login"  autofocus="autofocus">
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码" @keyup.enter.native="login" autofocus="autofocus">
      </el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="loading">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  // import * as user from 'api/user'
  import { Notification } from 'element-ui'
  import { LOG_IN, PUT_TOKEN, PUT_SYSRESOURCES } from 'store/user/mutations_types'
  import router from 'router'
  import store from 'store'
  import Cookies from 'js-cookie'

  export default {
    data () {
      return {
        loading: false,
        loginForm: {
          userName: 'admin',
          password: 'Admin1234'
        },
        rules: {
          userName: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      login (ev) {
        let { dispatch, commit } = this.$store
        this.loading = true
        dispatch(LOG_IN, this.loginForm).then(res => {
          if (res.resultCode === '00') {
            return dispatch('GenerateRoutes', res.sysResources).then(_ => {
              Cookies.set('token', res.token)
              commit(PUT_TOKEN, res.token)
              commit(PUT_SYSRESOURCES, res.sysResources)
              this.loading = false
              router.addRoutes(store.getters.appendRouters)
              this.$router.push({name: '资源概览'})
            }).catch(error => {
              this.showResult(error, 'd', 'sa')
              this.loading = false
            })
          } else {
            Notification({
              title: '登录失败',
              message: JSON.stringify(res.message),
              type: 'error'
            })
            this.loading = false
          }
        }).catch(error => {
          this.showResult(error, 'd', 'sa')
          this.loading = false
        })
      },
      showResult (data, success, errorTitle, callback) {
        success = success || '操作成功'
        errorTitle = errorTitle || '操作失败'
        if (data.resultCode === '00') {
          // 删除成功后重新请求数据
          // 删除成功提示
          if (callback) {
            callback()
          }
        } else {
          Notification({
            title: errorTitle,
            message: JSON.stringify(data.message),
            type: 'error'
          })
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }

    .remember {
      margin: 0px 0px 35px 0px;
    }

  }
</style>
