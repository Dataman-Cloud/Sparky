<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchFun">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" v-on:click="userAdd">新建用户</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="filterUsers" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="userName" label="用户名" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="name" label="姓名" min-width="100" sortable>
      </el-table-column>

      <el-table-column prop="accountGroups" label="组名 / 用户角色" min-width="150">
        <template scope="scopes">
          <div v-for="group in scopes.row.accountGroups">
            <div v-if="group.role === 'superuser'">{{group.group.name}} <span style=" font-style:italic;">超级管理员</span>
            </div>
            <div v-else-if="group.role === 'owner'">{{group.group.name}} <span style=" font-style:italic;">组管理员</span>
            </div>
            <div v-else-if="group.role === 'member'">{{group.group.name}} <span style=" font-style:italic;">组成员</span>
            </div>
            <div v-else></div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="用户状态" min-width="100">
        <template scope="user">
          {{user.row.status ? '正常' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column prop="createAt" label="更新时间" min-width="150">
        <template scope="user">
          {{user.row.createAt | moment("YYYY/MM/DD hh:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template scope="user">
          <span v-if="user.row.status">
            <el-button size="mini" @click="userDisable(user.row)">禁止</el-button>
          </span>
          <span v-else>
            <el-button size="mini" @click="userEnable(user.row)">启用</el-button>
          </span>
          <el-dropdown>
            <span class="el-dropdown-link"> <el-button size="mini">更多</el-button></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link :to="{name: '用户修改', query: { user: user.row }}">
                  <el-button size="mini" style="width: 100%;">编  辑</el-button>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button @click="groupEdit(user.row)" size="mini" style="width: 100%;">编辑组</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button @click="userDel(user.row)" size="mini" style="width: 100%;">删  除</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button @click="resetPwd(user.row)" size="mini" style="width: 100%;">修改密码</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize" :total="getTotal"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="重置密码" :visible.sync="dialog_resetPwd">
      <el-form :model="u_form" :rules="rules" ref="u_form">
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="u_form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="chkpwd">
          <el-input type="password" v-model="u_form.chkpwd"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_resetPwd = false">取 消</el-button>
        <el-button type="primary" @click="update">确 定</el-button>
      </div>

    </el-dialog>

    <el-dialog title="编辑用户组" :visible.sync="dialog_groupEdit" @close="editGroupClose">
      <el-form :model="e_form" :rules="rules" ref="e_form">
        <el-form-item label="添加组">
          <el-form-item>
            <el-select @change="changeSelect" v-model="e_form.groupId" placeholder="选择组">
              <el-option
                v-for="item in group_options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <!--
            <el-select v-model="e_form.role" placeholder="组中角色" style="margin-left: 30px;" v-if="e_form.groupId === 1">
              <el-option label="超级管理员" value="superuser"></el-option>
            </el-select>
            -->
            <el-select v-model="e_form.role" placeholder="组中角色" style="margin-left: 30px;">
              <el-option label="普通管理员" value="owner"></el-option>
              <el-option label="组成员" value="member"></el-option>
            </el-select>
            <el-button type="text" @click="addGroup">添加</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
      <template>
        <el-table
          :data="e_form.accountGroups"
          style="width: 100%">
          <el-table-column
            prop="group.name"
            label="用户组"
            width="180">
          </el-table-column>
          <el-table-column
            prop="role"
            label="组中角色"
            width="180">
          </el-table-column>
          <el-table-column
            label="操作">
            <template scope="scope">
              <el-button type="text" @click="delGroup(scope, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_groupEdit = false">取 消</el-button>
        <el-button type="primary" @click="dialog_groupEdit = false">确 定</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import * as type from '../../../store/user/mutations_types'

  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.u_form.chkpwd !== '') {
            this.$refs.u_form.validateField('chkpwd')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.u_form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        u_form: {
          password: '',
          chkpwd: ''
        },
        e_form: {
          accountGroups: [{
            accountId: '',
            groupId: '',
            role: '',
            accountGroups: []
          }]
        },
        filters: {
          name: ''
        },
        rules: {
          password: [
            {required: true, validator: validatePass, trigger: 'blur'},
            {pattern: /((?=.*[A-Z])(?=.*[A-Za-z0-9]))^.{8,16}$/, message: '密码必须包含大写字母，长度为8-16位。', trigger: 'blur'}
          ],
          chkpwd: [
            {required: true, validator: validatePass2, trigger: 'blur'}
          ]
        },
        page: 1,
        pageSize: 10,
        dialog_resetPwd: false,
        dialog_groupEdit: false,
        listLoading: false,
        search: true,
        list: [],
        getTotal: 0,
        currentPage: 1 // 从第一页开始
      }
    },
    computed: {
      ...mapState({
        users (state) {
          return state.user.users.users
        },
        total (state) {
          this.getTotal = state.user.users.total
          return state.user.users.total
        },
        group_options (state) {
          return state.user.groups.groups
        },
        group_optionsTotal1 (state) {
          return state.user.groups.total
        }
      }),
      filterUsers: function () {
        if (this.search) {
          let name = this.filters.name
          if (name !== null && name !== '') {
            let list = []
            // 循环比对
            for (let u of this.users) {
              if (u.userName.indexOf(name) > -1) {
                list.push(u)
              }
            }
            this.search = false
            this.list = list.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
            this.getTotal = list.length
            this.currentPage = 1
            return this.list
          } else {
            this.search = false
            this.list = this.users.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
            this.getTotal = this.total
            return this.list
          }
        }
/*        console.log(5555555555)
        if (this.list === null || this.list.length === 0) {
          this.getTotal = this.total
          return this.users.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
        } */
//        return this.list
        this.getTotal = this.total
        return this.users.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
      }
    },
    methods: {
      ...mapActions({
        fetchGroups: type.FETCH_GROUPS,
        fetchUserDetail: type.FETCH_USER_DETAIL,
        fetchUsers: type.FETCH_USERS,
        fetchUsersDisable: type.FETCH_USERS_DISABLE,
        fetchUsersEnable: type.FETCH_USERS_ENABLE,
        fetchUsersDelGroup: type.FETCH_USERS_DEL_GROUPS,
        fetchUsersDel: type.FETCH_USERS_DEL,
        fetchPwdReset: type.USER_PWD_RESET,
        fetchUsersAddInGroup: type.FETCH_USERS_ADD_IN_GROUPS
      }),
      searchFun () {
        this.search = true
      },
      addGroup () {
        let param = {accountId: this.e_form.accountId, groupId: this.e_form.groupId, role: this.e_form.role}
        this.$refs.e_form.validate((valid) => {
          if (valid) {
            this.fetchUsersAddInGroup(param).then(() => {
              this.fetchUserDetail(param.accountId).then((data) => {
                this.e_form = {
                  accountId: data.account.id,
                  groupId: '',
                  role: '',
                  accountGroups: data.account.accountGroups
                }
              })
            })
          } else {
            return false
          }
        })
      },
      changeSelect: function () {
        this.e_form.role = ''
      },
      delGroup: function (index, row) {
        let param = {accountId: row.accountId, groupId: row.groupId}
        this.$confirm('是否删该用户组', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定后请求删除接口
          return this.fetchUsersDelGroup(param).then(() => {
            this.fetchUserDetail(param.accountId).then((data) => {
              console.log(data)
              this.e_form = {
                accountId: data.account.id,
                groupId: '',
                role: '',
                accountGroups: data.account.accountGroups
              }
            })
          })
        })
      },
      editGroupClose () {
        this.fetchUsers()
      },
      groupEdit (user) {
        let fetchGroup = this.fetchGroups(user.id)
        let fetchUserDetail = this.fetchUserDetail(user.id)
        Promise.all([fetchGroup, fetchUserDetail])
          .then(res => {
            this.e_form = {
              accountId: user.id,
              groupId: '',
              role: '',
              accountGroups: res[1].account.accountGroups
            }
            this.dialog_groupEdit = true
          })
      },
      handleCurrentChange (val) {
        this.page = val
        this.search = true
      },
      resetPwd (user) {
        this.u_form = {
          id: user.id
        }
        this.dialog_resetPwd = true
      },
      userAdd () {
        this.$router.push({path: '/system/user/add'})
      },
      userDisable (user) {
        this.fetchUsersDisable(user.id).then((data) => {
          if (data.resultCode === '00') {
            this.$message({
              message: '禁止成功',
              type: 'success',
              onClose: this.fetchUsers
            })
          } else {
            this.$message({
              message: data.message,
              type: 'error'
            })
          }
        })
      },
      userEnable (user) {
        this.fetchUsersEnable(user.id).then(() => {
          this.$message({
            message: '启用成功',
            type: 'success',
            onClose: this.fetchUsers
          })
        })
      },
      userDel (user) {
        this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fetchUsersDel(user.id).then((data) => {
            if (data.resultCode === '00') {
              this.$message({
                message: '删除成功',
                type: 'success',
                onClose: this.fetchUsers
              })
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      update () {
        let param = {id: this.u_form.id, pwd: this.u_form}
        this.$refs.u_form.validate((valid) => {
          if (valid) {
            this.fetchPwdReset(param).then(() => {
              this.$message({
                message: '更新成功',
                type: 'success',
                onClose: this.fetchUsers
              })
              this.dialog_resetPwd = false
            })
          } else {
            return false
          }
        })
      }
    },
    mounted () {
      this.listLoading = true
      this.fetchUsers()
        .then(() => {
          this.listLoading = false
        })
      this.getTotal = this.total
    }
  }
</script>

<style scoped>
</style>
