<template>
	<section>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="个人信息" name="first">
        <el-form :label-position="labelPosition" :model="formName" label-width="110px" ref="formName" class="bodybar">
          <el-form-item label="用户名" prop="userName" style="background: #D3DCE6;">
            <span v-model="formName.userName" style="margin: 0 40px;">{{user.userName}}</span>
          </el-form-item>
          <el-form-item label="姓名" prop="name" >
            <span v-model="formName.name" style="margin: 0 40px;">{{user.name}}</span>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" style="background: #D3DCE6;">
            <span v-model="formName.email" style="margin: 0 40px;">{{user.email}}</span>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleName">
            <span v-model="formName.roleName" style="margin: 0 40px;">{{user.roleName}}</span>
          <!--  <div v-for="group in user.accountGroups" style="margin: 0 40px;">
              <div v-if="group.role === 'superuser'">{{group.group.name}} <span style=" font-style:italic;">超级管理员</span></div>
              <div v-else-if="group.role === 'owner'">{{group.group.name}} <span style=" font-style:italic;">普通管理员</span></div>
              <div v-else-if="group.role === 'member'">{{group.group.name}} <span style=" font-style:italic;">组成员</span></div>
              <div v-else></div>
            </div> -->
          </el-form-item>
          <el-form-item label="用户描述" prop="title"  style="background: #D3DCE6;">
            <span v-model="formName.title" style="margin: 0 40px;">{{user.title}}</span>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="密码修改" name="second">
        <el-form :label-position="labelPosition" :rules="rules" :model="pwdForm" label-width="95px" ref="pwdForm" class="bodybar">
          <el-form-item label="旧密码" prop="oldPassword" :rules="[
            {max: 50, message: '长度不能超过50个字符', trigger: 'blur' },
				    { required: true, message: '请输入旧密码', trigger: 'blur' }]">
            <el-col :span="8">
            <el-input type="password" v-model="pwdForm.oldPassword"  placeholder="请输入旧密码"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="新密码" prop="password">
            <el-col :span="8">
            <el-input type="password" v-model="pwdForm.password" placeholder="请输入新密码"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认新密码" prop="chkpwd">
            <el-col :span="8">
            <el-input type="password" v-model="pwdForm.chkpwd"  placeholder="请重新输入新密码"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancelForm('pwdForm')">取消</el-button>
            <el-button type="primary" @click="submitForm('pwdForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

	</section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../store/user/mutations_types'
  import { Notification } from 'element-ui'

  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value === this.pwdForm.oldPassword) {
          callback(new Error('新密码和旧密码一致,请重新输入新密码!'))
        } else {
          if (this.pwdForm.chkpwd !== '') {
            this.$refs.pwdForm.validateField('chkpwd')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.pwdForm.password) {
          callback(new Error('两次输入新密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        formName: {
          userName: 123123,
          name: '',
          email: '',
          desc: '',
          role: ''
        },
        activeName: 'first',
        labelPosition: 'left',
        rules: {
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
            {pattern: /((?=.*[A-Z])(?=.*[A-Za-z0-9]))^.{8,16}$/, message: '密码必须包含大写字母，长度为8-16位。', trigger: 'blur'}
          ],
          chkpwd: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        },
        pwdForm: {
          oldPassword: '',
          password: '',
          chkpwd: ''
        }
      }
    },
    computed: {
      ...mapState({
        user (state) {
          return state.user.aboutme
        }
      })
    },
    methods: {
      cancelForm (formName) {
        this.$refs[formName].resetFields()
        this.activeName = 'first'
      },
      handleClick (tab, event) {
        console.log(tab, event)
      },
      submitForm: function (pram) {
        this.$refs[pram].validate((valid) => {
          if (valid) {
            this.$store.dispatch(type.USER_CHGPWD, this.pwdForm).then((data) => {
              this.showResult(data, '修改密码成功!', '修改密码出错', () => {
                this.activeName = 'first'
              })
            })
          } else {
            return false
          }
        })
      },
      showResult (data, success, errorTitle, callback) {
        success = success || '操作成功'
        errorTitle = errorTitle || '操作失败'
        if (data.resultCode === '00') {
          // 删除成功后重新请求数据
          // 删除成功提示
          this.$message({
            type: 'success',
            message: success
          })
          if (callback) {
            callback()
          }
        } else {
          Notification({
            title: errorTitle,
            message: JSON.stringify(data.message),
            type: 'error'
          })
        }
      }
    }
  }
</script>

<style scoped>
.bodybar {
  margin-top: 30px;
  margin-left: 20px;
}
.btn {
  text-align: center;
}
.row {
	text-align: left;
	margin: 20px;

}
.row1 {
	text-align: left;
	background-color: #E5E9F2;
	margin: 20px;

}
</style>
