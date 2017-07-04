<template>
  <section>
    <!--面包屑-->
    <!-- <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/system' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户添加</el-breadcrumb-item>
    </el-breadcrumb>-->

    <el-form :label-position="labelPosition" :model="formName" label-width="85px" ref="formName" :rules="rules"
             class="bodybar">
      <el-form-item label="用户名" prop="userName" :rules="[
          { required: true, message: '请输入用户名', trigger: 'blur' }]">
        <el-input type="text" v-model="formName.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="name" :rules="[{required: true, message: '请输入姓名', trigger: 'blur'}]">
        <el-input v-model="formName.name" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="邮箱地址" prop="email" :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]">
        <el-input v-model="formName.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="formName.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="chkpwd">
        <el-input type="password" v-model="formName.chkpwd" placeholder="请确认密码"></el-input>
      </el-form-item>
      <!--
      <el-form-item label="超级管理员">
        <el-col :span="8">
          <el-checkbox v-model="checked">备选项</el-checkbox>
        </el-col>
      </el-form-item>
      -->
      <el-form-item label="用户描述" prop="desc">
        <el-input type="textarea" autosize placeholder="请输入内容">
        </el-input>
      </el-form-item>
      <el-form-item label="添加用户组">
        <el-button type="primary" icon="plus" @click="addGroups" size="mini" class="sub-title">添加组</el-button>
      </el-form-item>
      <el-form-item v-for="(group, index) in formName.accountGroups" :title="group" :key="index">
        <el-form-item label="用户组" class="addGroup" label-width="50"
                      :key="group.index"
                      :prop="'accountGroups.' + index + '.groupId'"
                      :rules="[
                        { required: true, message: '请选择组' }
                      ]">
          <el-select @change="changeSelect(index)" v-model="group.groupId" placeholder="选择组">
            <el-option
              v-for="item in group_options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
<!--
        <el-select v-model="group.role" placeholder="组中角色" style="margin-left: 30px;" v-if="group.groupId === 1">
          <el-option label="超级管理员" value="superuser"></el-option>
        </el-select>
        -->
        <el-form-item label="组角色" label-width="50" class="addGroup"
                      :key="group.index"
                      :prop="'accountGroups.' + index + '.role'"
                      :rules="[
                        { required: true, message: '请选择组' }
                      ]">
          <el-select v-model="group.role" placeholder="组中角色">
            <el-option label="组管理员" value="owner"></el-option>
            <el-option label="组成员" value="member"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="text" @click="delGroup('group')">删除</el-button>
      </el-form-item>
      <div class="btn">
        <el-button type="primary" @click="submitForm" v-bind:disabled="formName.beDisabled" class="btn">创建</el-button>
        <el-button @click="cancelForm">取消</el-button>
      </div>

    </el-form>

  </section>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import * as type from '../../../store/user/mutations_types'
  import { Notification } from 'element-ui'

  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.formName.chkpwd !== '') {
            this.$refs.formName.validateField('chkpwd')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.formName.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        formName: {
          name: '',
          userName: '',
          email: '',
          password: '',
          chkpwd: '',
          accountGroups: [{
            groupId: '',
            role: ''
          }]
        },
        rules: {
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
            {pattern: /((?=.*[A-Z])(?=.*[A-Za-z0-9]))^.{8,16}$/, message: '密码必须包含大写字母，长度为8-16位。', trigger: 'blur'}
          ],
          chkpwd: [
            {required: true, validator: validatePass2, trigger: 'blur'}
          ]
        },
        beDisabled: true,
        labelPosition: 'left',
        checked: false
      }
    },
    computed: {
      ...mapState({
        /*        users (state) {
         return state.userAdd
         } */
        group_options (state) {
          return state.user.groups.groups
        },
        group_optionsTotal1 (state) {
          return state.user.groups.total
        }
      })
    },
    methods: {
      ...mapActions({
        fetchGroups: type.FETCH_GROUPS
      }),
      cancelForm: function () {
        this.$router.push({path: '/system/user/list'})
      },
      addGroups: function () {
        this.formName.accountGroups.push({
          groupId: '',
          role: '',
          key: Date.now()
        })
      },
      changeSelect: function (index) {
        this.formName.accountGroups[index].role = ''
      },
      delGroup: function (group) {
        var index = this.formName.accountGroups.indexOf(group)
        this.formName.accountGroups.splice(index, 1)
        /* if (index !== -1) {
         this.formName.accountGroups.splice(index, 1)
         } */
      },
      submitForm: function () {
        this.$refs.formName.validate((valid) => {
          if (valid) {
            this.$store.dispatch(type.FETCH_USERS_ADD, this.formName).then((data) => {
              this.showResult(data, '用户创建成功!', '用户创建出错', () => {
                this.$router.push({path: '/system/user/list'})
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
    },
    mounted () {
      this.fetchGroups()
    }
  }
</script>

<style scoped>
  .errMsg {
    color: red;
  }

  .btn {
    text-align: center;
    margin: 15px;
  }

  .breadcrumb {
    margin: 15px 0;
  }

  .bodybar {
    margin: 25px 0 0 0;
  }
  .addGroup {
    display: inline-block;
    width: 30%;
  }
</style>
