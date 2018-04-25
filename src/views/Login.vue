<template>
  <div class="dm-box">
    <div class="login-bg"></div>
    <div class="dm-con-box">
      <div class="dm-login-top">
        <!--   <img src="../assets/LOGO.svg" alt=""> -->
        <!--     <img src="../assets/pufa.png" alt="" style="background-color: #999;"> -->
        <h2>系统登录</h2>
        <h3>上证容器云平台</h3>
        <h4>{{version}}</h4>
      </div>
      <el-form class="dm-login-box" :model="loginForm" :rules="rules" label-width="0" autocomplete="off">
        <el-form-item label="" prop="userName" class="dm-login-label">
          <el-input class="dm-login-input" v-model="loginForm.userName" placeholder="用户名" @keyup.enter.native="login"
                    autofocus="autofocus">
            <template slot="append">
              <img src="../assets/user.svg" style="width:32px;height:32px"/>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input class="dm-login-input" v-model="loginForm.password" type="password" placeholder="密码"
                    @keyup.enter.native="login" autofocus="autofocus">
            <template slot="append">
              <img src="../assets/lock.svg" style="width:32px;height:32px"/>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="kaptchaCode" style="margin-top: 25px;" v-show="isShow">
          <el-input class="dm-login-input" v-model="loginForm.kaptchaCode" placeholder="图形验证码"
                    @keyup.enter.native="login" autofocus="autofocus">
            <template slot="append">
              <img src="" alt="验证码" title="看不清？换一张试试" style="width:120px;height:50px;cursor:pointer;" id="kaptchaCode"
                   @click="changeKaptcha"/>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="" class="dm-button-box">
          <el-button @click.native.prevent="login" :loading="loading" class="login-button">
            登 录
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  // import * as user from 'api/user'
  import {Notification} from 'element-ui'
  import {LOG_IN, PUT_TOKEN, PUT_SYSRESOURCES} from 'store/user/mutations_types'
  import router from 'router'
  import store from 'store'
  import Cookies from 'js-cookie'
  import {DEFAULT_BASE_URL, DM_VERSION} from '@/config'

  export default {
    data () {
      return {
        loading: false,
        isShow: false,
        version: DM_VERSION,
        loginUrl: DEFAULT_BASE_URL,
        loginForm: {
          userName: '',
          password: '',
          kaptchaCode: ''
        },
        rules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          kaptchaCode: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getLoginUrl () {
        if (this.loginUrl.endsWith('/')) {
          return this.loginUrl + 'jborg/kaptcha/getkaptchaCode'
        } else {
          return this.loginUrl + '/jborg/kaptcha/getkaptchaCode'
        }
      },
      srcUrl () {
        let $img = document.getElementById('kaptchaCode')
        $img.src = this.getLoginUrl()
        return $img
      },
      changeKaptcha () {
        let $img = document.getElementById('kaptchaCode')
        let url = this.getLoginUrl() + '?' + Math.floor(Math.random() * 100)
        $img.src = url
      },
      login (ev) {
        let {dispatch, commit} = this.$store
        if (this.loginForm.userName.trim() === '' || this.loginForm.password.trim() === '') {
          this.showResult('01', 'success', '请输入账户或密码！')
          return false
        }
        if (this.isShow && this.loginForm.kaptchaCode.trim() === '') {
          this.showResult('01', 'success', '请输入验证码！')
          return false
        }
        this.loading = true
        let prams = {
          'userName': this.loginForm.userName,
          'password': window.btoa(this.loginForm.password),
          'kaptchaCode': this.loginForm.kaptchaCode
        }
        dispatch(LOG_IN, prams).then(res => {
          if (res.resultCode === '00') {
            return dispatch('GenerateRoutes', res.sysResources).then(_ => {
              Cookies.set('token', res.token)
              commit(PUT_TOKEN, res.token)
              commit(PUT_SYSRESOURCES, res.sysResources)
              this.loading = false
              router.addRoutes(store.getters.appendRouters)
              window.localStorage.setItem('userName', this.loginForm.userName)
              this.$router.push({name: '我的应用'})
            }).catch(error => {
              this.showResult(error, 'success', 'error')
              this.loginForm.kaptchaCode = ''
              this.loading = false
            })
          } else {
            this.srcUrl()
            this.changeKaptcha()
            Notification({
              title: '登录失败',
              message: JSON.stringify(res.message),
              type: 'error'
            })
            this.loading = false
            this.isShow = true
            this.loginForm.kaptchaCode = ''
          }
        }).catch(error => {
          this.showResult(error, 'success', 'error')
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
    },
    mounted () {
//      this.srcUrl()
      this.version = DM_VERSION
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  div,
  h2,
  img,
  button,
  input,
  form {
    margin: 0;
    padding: 0;
  }

  .dm-box {
    width: 100%;
    height: 100%;
    background-size: cover;
    position: relative;
    background: #f6f7fc;
    overflow: hidden;
  }

  .login-bg {
    width: 62%;
    height: 100%;
    background: url('../assets/login-bg.svg');
    position: absolute;
    right: 0;
  }

  .dm-con-box {
    width: 100%;
    min-height: 100%;
    z-index: 10000;
    position: absolute;
  }

  .dm-con-box img {
    width: 400px;
  }

  .dm-login-top {
    margin-top: 10%;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    font-family: pingfontweb, Helvetica Neue, Helvetica, Roboto, Arial, PingFang SC, Hiragino Sans GB, Microsoft Yahei, Microsoft Jhenghei, sans-serif;
  }

  .dm-login-top > h4 {
    font-size: 14px;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.0);
    font-weight: 100;
    opacity: .7;
    color: #040b33;
  }

  .dm-login-top > h3 {
    font-size: 18px;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.0);
    font-weight: 100;
    opacity: .7;
    color: #1aa9e0;
  }

  .dm-login-top > h2 {
    font-weight: 400;
    font-size: 38px;
    color: #333;
  }

  .dm-login-box {
    width: 510px;
    border-radius: 6px;
    color: #fff;
    margin: 3% auto 0;
  }

  .dm-login-box .el-form-item__label {
    color: #fff;
  }

  .dm-login-box .el-input__inner {
    background-color: rgba(255, 255, 255, 0.3);
  }

  .dm-button-box {
    text-align: center;
  }

  .dm-login-box .login-button {
    font-size: 22px;
    color: #fff;
    background-color: #1aa9e0;
    margin: 10% auto;
    height: 64px;
    width: 280px;
    border-radius: 32px;
    border: none;
    box-shadow: 0 0 24px rgba(0, 204, 255, .3);
  }

  .dm-login-box .login-button:hover {
    background-color: #1ab2ef;
  }

  .dm-login-label {
    margin-bottom: 30px;
  }

  .dm-login-input {
    height: 74px;
    width: 446px;
    border: 1px solid #1aa9e0;
    border-radius: 37px;
    padding: 0 37px;
  }

  .el-input-group .el-input__inner {
    border: none !important;
    height: 100%;
  }

  .dm-login-input .el-input-group__append {
    border: 0;
    background: #fff !important;
    padding: 8px 0;
  }

  .dm-login-box .el-form-item__error {
    left: 37px;
    font-size: 14px;
    color: #f76260;
  }

  .dm-login-box .el-form-item__error:before {
    content: '\E615';
    font-family: element-icons !important;
    speak: none;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    display: inline-block;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin-right: 3px;
  }

  @media screen and (max-width: 1440px) {
    .dm-login-top {
      margin-top: 55px;
    }
    .dm-login-box {
      margin: 40px auto 0;
    }
    .dm-login-box .el-button--primary {
      margin-top: 30px;
    }
  }
</style>

