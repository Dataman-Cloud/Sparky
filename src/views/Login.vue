<template>
  <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="userName">
      <el-input type="text" v-model="loginForm.userName" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="login" :loading="logining">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import * as user from '../api/user'

  export default {
    data () {
      return {
        logining: false,
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
        this.logining = true
        user.login(this.loginForm)
          .then(data => {
            this.logining = false
            localStorage.setItem('token', data.data)
            this.$router.push({path: 'app/myApps'})
          }, rej => {
            this.logining = false
          })
      }
    }
  }
</script>

<style lang="scss" scoped>
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
