<template>
  <section class="bodybar">
    <el-row class="margin-bottom-20">
      <el-button type="primary" icon="plus" @click="groupAdd" size="big">新建用户组</el-button>
    </el-row>
    <el-row>
    <el-col :span="24">
      <el-collapse accordion @change="expand" :value="'expandedRow'">
        <el-collapse-item v-for="group in filterGroup" :key="group.id" :name="group.id">
          <template slot="title">
            {{group.name}}
            <div class="float-right">
              <!-- <el-button size="mini" @click="groupDesc(group)">详情</el-button> -->
              <el-button size="mini" @click.prevent="groupEdit(group)">编辑</el-button>
              <el-button size="mini" @click="groupDel(group)">删除</el-button>
            </div>
          </template>
          <el-row style="margin: 20px;" justify="space-between" align="middle" type="flex">
            <el-col :span="10">
              <el-tooltip content="集群数" placement="top-start">
                <span><i class="fa fa-tasks"></i><span  style="padding-left: 10px;">{{group.clustersNumber}}</span></span>
              </el-tooltip>
              <el-tooltip content="用户数" placement="top-end" style="padding-left: 30px;">
                <span><i class="fa fa-user"></i><span  style="padding-left: 10px;">{{group.usersNumber}}</span></span>
              </el-tooltip>
            </el-col>
            <el-col :span="8">
              <el-button icon="plus" @click="clusterAdd">新建集群</el-button>
              <el-button icon="plus" @click="addUserToGroup">添加用户</el-button>
            </el-col>
          </el-row>
          <el-row>
            <div>集群</div>
          </el-row>
          <el-table  :data="group.clusterss" highlight-current-row style="width: 100%;">
            <el-table-column prop="vClusterLabel" label="名称" min-width="100" >
            </el-table-column>
            <!--         <el-table-column prop="vCluster.groupName" label="组名称" min-width="100" >
                     </el-table-column>
                     <el-table-column prop="vCluster.desc" label="描述" min-width="100" >
                     </el-table-column>-->
            <el-table-column prop="createAt" label="更新时间" min-width="150">
              <template scope="cluster">
                {{cluster.row.createAt | moment("YYYY/MM/DD hh:mm:ss")}}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
              <template scope="cluster">
                <el-button size="mini" @click="clusterDelFromGroup(cluster.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentClustersChange" :page-size="6" :total="group.clustersNumber"
                         style="float:right;">
          </el-pagination>
          <div>用户</div>
          <el-table  :data="group.userss" highlight-current-row style="width: 100%;">
            <el-table-column prop="userName" label="用户名" min-width="100" >
            </el-table-column>
            <el-table-column prop="role" label="权限" min-width="100" >
              <template scope="scopes">
                <div v-for="aGroup in scopes.row.accountGroups">
                  <div v-if="aGroup.role === 'superuser' && group.id === aGroup.groupId"><span style=" font-style:italic;">超级管理员</span>
                  </div>
                  <div v-else-if="aGroup.role === 'owner' && group.id === aGroup.groupId"><span style=" font-style:italic;">普通管理员</span>
                  </div>
                  <div v-else-if="aGroup.role === 'member' && group.id === aGroup.groupId"><span style=" font-style:italic;">组成员</span>
                  </div>
                  <div v-else></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createAt" label="更新时间" min-width="150">
              <template scope="user">
                {{user.row.createAt | moment("YYYY/MM/DD hh:mm:ss")}}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100">
              <template scope="user">
                <el-button size="mini" @click="userDelFromGroup(user.row)">移除</el-button>
              </template>

            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" @current-change="handleCurrentUsersChange" :page-size="6" :total="group.usersNumber"
                         style="float:right;">
          </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </el-col>
  </el-row>


    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>

    <!-- 添加用户组和编辑用户组的dialog -->
    <el-dialog title="添加用户组" :visible.sync="dialog_group">
      <el-form label-position="left" :model="groupForm" label-width="95px" ref="groupForm">
 			<el-form-item label="名称" prop="name" :rules="[
 				{ required: true, message: '请输入名称', trigger: 'blur' }]">
 				<el-input type="text" v-model="groupForm.name" placeholder="请输名称"></el-input>
 			</el-form-item>
 			 <el-form-item label="用户描述">
 				<el-input type="textarea" v-model="groupForm.description" autosize placeholder="请输入内容"></el-input>
 			</el-form-item>
 		 </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_group = false">取 消</el-button>
        <el-button type="primary" @click="submitGroupForm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户到当前选择的组 -->
    <el-dialog title="用户添加" :visible.sync="dialog_addUserToGroup" size="tiny" style="text-align: left">
      <el-form :model="userForm" :rules="rules" label-width="80px" label-position="left" ref="userForm">
        <el-form-item label="用户" prop="userName">
          <el-select v-model="userForm.userName" placeholder="请选择用户">
            <el-option v-for="user in users" :label="user.userName" :value="user.id" :key="user.id"></el-option>
          </el-select>
        </el-form-item>
<!--
        <el-form-item label="类型" prop="role" v-if="groupInfo.id === 1">
          <el-select v-model="userForm.role" placeholder="角色类型">
            <el-option label="超级管理员" value="superuser"></el-option>
          </el-select>
        </el-form-item>
        -->
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="角色类型">
            <el-option label="组管理员" value="owner"></el-option>
            <el-option label="组成员" value="member"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_addUserToGroup = false">取 消</el-button>
        <el-button type="primary" @click="addToGroup(userForm)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加集群 -->
    <add-cluster @ok="clusterSubmit" ref="addCluster"></add-cluster>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '@/store/user/mutations_types'
  import addCluster from '@/components/modal/addCluster'
  import * as clusterType from '@/store/clusters/mutations_types'
  import { Notification } from 'element-ui'

  export default {
    components: {
      addCluster
    },
    data () {
      let userNameChk = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择用户'))
        } else {
          callback()
        }
      }
      let roleChk = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选择角色权限'))
        } else {
          callback()
        }
      }
      return {
        // 添加组的dialog
        dialog_group: false,
        groupForm: {
          name: '',
          description: ''
        },
        // 添加用户的dialog
        dialog_addUserToGroup: false,
        userForm: {
          userName: '',
          role: ''
        },
        groupInfo: {
          userName: '',
          id: 1
        },
        // 展开的 key
        expandedKeys: [],
        expandedRow: ['1'],
        page: 1,
        usersPage: 1,
        clustersPage: 1,
        listLoading: false,
        rules: {
          userName: [
            {validator: userNameChk, trigger: 'change'}
          ],
          role: [
            {validator: roleChk, trigger: 'change'}
          ]
        }
      }
    },
    computed: {
      ...mapState({
        users ({ user }) {
          return user.users.users
        },
        groups ({ user }) {
          return user.groups.groups
        },
        total (state) {
          return state.user.groups.total
        }
      }),
      filterGroup: function () {
        let groups
        if (this.groups && this.groups.length > 0) {
          groups = this.groups.slice((this.page - 1) * 10, this.page * 10)
          groups.forEach((group, index) => {
            if (group.users && Array.isArray(group.users) && group.users.length > 0) {
              groups[index].userss = group.users.slice((this.usersPage - 1) * 6, this.usersPage * 6)
            }
            if (group.clusters && Array.isArray(group.clusters) && group.clusters.length > 0) {
              groups[index].clusterss = group.clusters.slice((this.clustersPage - 1) * 6, this.clustersPage * 6)
            }
          })
        }
        return groups
      }
      // filterClustersInGroup: function () {
      //   return this.clustersByGroup.slice((this.page - 1) * 20, this.page * 20)
      // }
    },
    methods: {
      // 打开添加组的dialog
      groupAdd () {
        this.groupForm = {
          name: '',
          description: ''
        }
        this.dialog_group = true
      },
      groupEdit (group) {
        this.groupForm = {
          id: group.id,
          name: group.name,
          description: group.description
        }
        this.dialog_group = true
      },
      submitGroupForm () {
        let fetchType = type.FETCH_GROUP_ADD
        if (this.groupForm.id !== undefined) {
          fetchType = type.FETCH_GROUP_EDIT
        }
        this.$refs.groupForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch(fetchType, this.groupForm).then(() => {
              this.$message({
                message: '添加成功',
                type: 'success',
                onClose: this.listGroup
              })
              this.dialog_group = false
            })
          } else {
            return false
          }
        })
      },
      // 打开添加用户到组的dialog
      addUserToGroup () {
        this.dialog_addUserToGroup = true
      },
      fetchAllUsers () {
        this.$store.dispatch(type.FETCH_USERS)
      },
      addToGroup (user) {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            user.groupId = this.groupInfo.id
            user.accountId = user.userName
            this.$store.dispatch(type.FETCH_USERS_ADD_IN_GROUPS, user).then(() => {
              this.$message({
                message: '添加成功',
                type: 'success',
                onClose: this.fetchExpandInfo(user.groupId)
              })
              this.dialog_addUserToGroup = false
            })
          } else {
            return false
          }
        })
      },
      // 添加集群
      clusterAdd () {
        this.$refs.addCluster.open({groupId: this.groupInfo.id})
      },
      clusterSubmit (form) {
        this.$store.dispatch(clusterType.ADD_CLUSTERS, form).then(() => {
          this.$message({
            message: '添加成功',
            type: 'success',
            onClose: this.fetchExpandInfo(form.groupId)
          })
        })
      },
      clusterDelFromGroup (parm) {
        this.$confirm('此操作将永久删除该集群, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(clusterType.DEL_CLUSTER, parm.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              onClose: this.fetchExpandInfo(this.groupInfo.id)
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      userDelFromGroup (pram) {
        this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = { userId: pram.id, groupId: this.groupInfo.id }
          this.$store.dispatch(type.FETCH_USERS_DEL_IN_GROUPS, ids).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              onClose: this.fetchExpandInfo(this.groupInfo.id)
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleCurrentChange (val) {
        this.page = val
      },
      handleCurrentClustersChange (val) {
        this.clustersPage = val
      },
      handleCurrentUsersChange (val) {
        this.usersPage = val
      },
      listGroup () {
        this.resetExpandedKeys()
        return this.$store.dispatch(type.FETCH_GROUPS)
      },
      groupDesc (row) {
        this.$router.push({name: '用户组操作', query: {group: row}})
      },
      //
      // update () {
      //   this.$store.dispatch(type.FETCH_GROUP_EDIT, this.g_form).then(() => {
      //     this.$message({
      //       message: '更新成功',
      //       type: 'success',
      //       onClose: this.listGroup
      //     })
      //     this.dialog_groupEdit = false
      //   })
      // },
      groupDel (group) {
        this.$confirm('此操作将永久删除该用户组信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.FETCH_GROUP_DEL, group.id).then((data) => {
/*            this.$message({
              message: '删除成功',
              type: 'success',
              onClose: this.listGroup
            }) */
            this.showResult(data, '删除组成功', '删除组出错', () => {
              this.listGroup()
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      expand (id) {
        console.log(this.expandedRow, '123123123')
        if (!id || this.expandedKeys.includes(id)) {
          let group = this.groups.find((group) => group.id === id)
          this.groupInfo.userName = group ? group.name : ''
          this.groupInfo.id = group ? group.id : 1
          return false
        }
        this.expandedKeys.push(id)
        this.fetchExpandInfo(id)
        let group = this.groups.find((group) => group.id === id)
        this.groupInfo.userName = group ? group.name : ''
        this.groupInfo.id = group ? group.id : 1
      },
      resetExpandedKeys () {
        this.expandedKeys = []
        this.expandedRow = ''
      },
      /* userListWithGroup (id) {
        this.$store.dispatch(type.FETCH_USERS_IN_GROUPS, id)
      }, */
      fetchExpandInfo (id) {
        this.$store.dispatch(type.FETCH_CLUSTERS_IN_GROUPS, id || this.groupInfo.id)
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
      this.fetchAllUsers()
      this.listLoading = true
      this.listGroup()
        .then(() => {
          this.listLoading = false
        })
    }
  }
</script>

<style scoped>
  .bodybar {
    margin-top: 20px;
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

  .float-right {
    float: right;
    padding-right: 20px;
  }
</style>
