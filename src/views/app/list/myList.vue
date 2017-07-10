<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters" ref="test">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="应用名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="listApp">查询</el-button>
          </el-form-item>
          <el-form-item>
            <router-link to="../list/catalogStackList">
              <el-button type="primary">添加程序包</el-button>
            </router-link>
          </el-form-item>
          <el-form-item>
            <router-link to="../addImg">
              <el-button type="primary">添加应用</el-button>
            </router-link>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showCreateAppGroup()">创建应用组</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--应用组列表-->
    <el-row
      style="border: 1px solid #E5E9F2;height: 40px;border-bottom: none;vertical-align: middle;padding-left: 20px;line-height: 40px;background-color: #D3DCE6">
      <el-col :span="10">应用组名称</el-col>
      <el-col :span="10">应用(正常/总数)</el-col>
      <el-col :span="4">操作</el-col>
    </el-row>
    <el-collapse accordion v-model="activeSelfGroup">
      <el-collapse-item v-for="item in appgroups" :key="item.id" :name="item.id">
        <template slot="title">
          <el-row style="float: right;width:95%">
            <el-col :span="10">{{item.id | replaceSprit}}</el-col>
            <el-col :span="10">{{item.healthy}}/{{item.apps.length}}</el-col>
            <el-col :span="4">
              <i v-if="item.apps.length > 0" class="el-icon-edit">
              </i>
              <i v-else class="el-icon-delete" style="color:red"
                 @click.stop="delAppGroup(item.id)"></i>
            </el-col>
          </el-row>
        </template>
        <el-table :data="item.apps" v-loading="false" style="width: 100%;" v-if="item.apps.length > 0">
          <el-table-column prop="id" label="名称" min-width="100" sortable>
            <template scope="app">
              <router-link :to="{name: '应用实例信息', query:{id : app.row.id}}">{{app.row.id | getName}}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="所属" width="100" prop="owner">
          </el-table-column>
          <el-table-column label="当前状态" width="130" prop="status" sortable>
          </el-table-column>
          <el-table-column prop="vclusterName" label="集群" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="instances" label="实例" min-width="100" sortable>
          </el-table-column>
          <el-table-column label="健康状态" min-width="120" sortable>
            <template scope="test3">
              <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">
                  <span>
                    数量：{{test3.row.healthy}}  状态:healthy<br/>
                  </span>
                  <span>
                    数量：{{test3.row.running}}  状态:running<br/>
                  </span>
                  <span>
                    数量：{{test3.row.staged}}  状态:staged<br/>
                  </span>
                  <span>
                    数量：{{test3.row.overcapacity}}  状态:overcapacity<br/>
                  </span>
                  <span>
                    数量：{{test3.row.unscheduled}}  状态:unscheduled<br/>
                  </span>
                  <span>
                    数量：{{test3.row.unknown}}  状态:unknown<br/>
                  </span>
                </div>
                <!--TO DO-->
                <ul class="progress">
                  <!--<li v-for="(status, index) in getAppHealth(test3.row).state" :class="status.state" style="width: 10%"></li>-->
                  <li class="healthy" :style="{width:(test3.row.healthy/test3.row.instances)*100+'%'}"></li>
                  <li class="unhealthy" :style="{width:(test3.row.unhealthy/test3.row.instances)*100+'%'}"></li>
                  <li class="unknown" :style="{width:(test3.row.unknown/test3.row.instances)*100+'%'}"></li>
                  <li class="staged" :style="{width:(test3.row.staged/test3.row.instances)*100+'%'}"></li>
                  <li class="over-capacity" :style="{width:(test3.row.overcapacity/test3.row.instances)*100+'%'}"></li>
                  <li class="unscheduled" :style="{width:(test3.row.unscheduled/test3.row.instances)*100+'%'}"></li>
                </ul>
              </el-tooltip>

            </template>
          </el-table-column>
          <el-table-column label="版本" min-width="200" prop="version" sortable>
          </el-table-column>
          <el-table-column label="操作" min-width="130">
            <template scope="scope">
              <el-button type="warning" size="mini" @click="stop(scope.row.id)">停止</el-button>
              <el-dropdown>
                <span class="el-dropdown-link"> <el-button size="mini" type="info">更多</el-button></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <router-link :to="{name:'修改镜像',query:{aid:scope.row.id}}">
                      <el-button type="primary" icon="edit" size="small">修改</el-button>
                    </router-link>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button type="danger" icon="delete" size="small" @click="removeModel(scope.row.id)">删除
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button @click="showExtend(scope.row.id, scope.row.instances)" type="success" size="small" style="width: 60px;">扩展
                    </el-button>

                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button @click="showEdit(scope.row.labels.USER_ID,scope.row)" type="info" size="mini"
                               style="width: 60px;">
                      修改用户
                    </el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-row v-else>
          未查到应用数据
        </el-row>
        <!--<el-col :span="24" class="toolbar">-->
        <!--<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total"-->
        <!--style="float:right;">-->
        <!--</el-pagination>-->
        <!--</el-col>-->
      </el-collapse-item>
    </el-collapse>

    <el-dialog
      title="扩展"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <el-input-number v-model="instances" size="small" :min="0" :step="1"></el-input-number>
      <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="extend()">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="创建应用组"
      :visible.sync="createAppGroupDialogVisisble"
    >
      <el-form :model="addAppGroupForm" ref="addAppGroupForm" :rules="addAppGroupRule">
        <el-form-item label="应用名称" prop="id">
          <el-input v-model="addAppGroupForm.id" @input="checkForm('addAppGroupForm')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
              <el-button @click="createAppGroupDialogVisisble = false">取 消</el-button>
    <el-button type="primary" :disabled="createable" @click="createAppGroup()">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      :before-close="handleClose">
      <el-select v-model="userId" placeholder="请选择用户">
        <el-option v-for="item in users" :label="item.name" :value="item.id" :key="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser()">确 定</el-button>
  </span>
    </el-dialog>
    <!--工具条-->
  </section>
</template>

<script>
  import { mapState } from 'vuex'
  import { LABEL_PREFIX } from '../../../config'
  import * as type from '../../../store/app/mutations_types'
  import * as appgroupTypes from '../../../store/appgroups/mutations_types'
  import * as userType from '../../../store/user/mutations_types'
  import ElCol from 'element-ui/packages/col/src/col'
  import ElFormItem from '../../../../node_modules/element-ui/packages/form/src/form-item'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button'
  import { Notification } from 'element-ui'
  export default {
    components: {
      ElButton,
      ElFormItem,
      ElCol
    },
    data () {
      return {
        filters: {
          name: ''
        },
        addAppGroupForm: {
          id: null
        },
        addAppGroupRule: {
          id: [
            {required: true, message: '应用组名称不可为空', trigger: 'input'},
            {pattern: /^[a-z0-9-]+$/, message: '应用id只能包含小写字母、数字及中划线', trigger: 'input'}
          ]
        },
        createable: true,
        dialogVisible: false,
        editDialogVisible: false,
        createAppGroupDialogVisisble: false,
        userId: null,
        currentId: null,
        newAppGroupId: null,
        currentApp: {},
        instances: 0,
        page: 1,
        listLoading: false,
        prefix: LABEL_PREFIX,
        interval: null
      }
    },
    computed: {
      activeSelfGroup: {
        get: function () {
          console.log('****************' + sessionStorage.getItem('activeSelfGroup'))
          return sessionStorage.getItem('activeSelfGroup')
        },
        set: function (name) {
          console.log('****************' + sessionStorage.getItem('activeSelfGroup') + '============' + name)
          sessionStorage.setItem('activeSelfGroup', name)
        }
      },
      ...mapState({
        curGroupId (state) {
          return state.user.aboutme.currentGroupID
        },
        userMap (state) {
          let map = new Map()
          for (let user of state.user.users.users) {
            map.set(user.id, user.name)
          }
          return map
        },
        appgroups (state) {
          let appgroups = state.appgroups.selfGroups
//          console.log('*********************appgroups=' + JSON.stringify(state))
          for (let item of appgroups) {
            let healthy = 0
            for (let app of item.apps) {
              if (app.healthy > 0 || app.running > 0) {
                healthy += 1
              }
            }
            item.healthy = healthy
          }
//          console.log('*********************appgroups=' + JSON.stringify(appgroups))
          return appgroups
        },
        queue (state) {
          return state.app.apps.queue.queue
        },
        users (state) {
          return state.user.users.users
        }
      }),
      filterApps: function () {
//        console.log(this.page)
        return this.apps.slice((this.page - 1) * 20, this.page * 20)
      }
    },
    methods: {
      getHealthyCount (arr) {
//        console.log('**********************' + JSON.stringify(arr))
        if (arr !== undefined && arr != null && arr.length) {
          let healthy = 0
          for (let app of arr) {
            if (app.tasksHealthy > 0 || app.tasksRunning > 0) {
              healthy += 1
            }
          }
//          console.log('-==============================' + healthy)
          return healthy + '/' + arr.length
        }
      },
      removeModel (index) {
//        var noticeMessage = this.$message
        this.$confirm('是否删除应用', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定后请求删除接口
          return this.$store.dispatch(type.DEL_APP, window.btoa(index.substring(1))).then((data) => {
            this.showResult(data, '删除成功!', '删除应用出错',
              () => {
                this.listApp()
              }
            )
          })
        })
      },
      stop (aid) {
        this.$store.dispatch(type.UPDATE_APP, {
          'aid': window.btoa(aid),
          'params': {'instances': 0}
        }).then((data) => {
          this.showResult(data, '停止应用成功!', '停止应用出错')
        })
      },
      showExtend (appId, instances) {
        this.dialogVisible = true
        this.currentId = appId
        this.instances = instances
      },
      extend () {
        this.$store.dispatch(type.UPDATE_APP, {
          'aid': window.btoa(this.currentId),
          'params': {'instances': this.instances}
        }).then((data) => {
          this.showResult(data, '扩展应用成功!', '扩展应用出错',
            () => {
              this.listLoading = true
              this.listApp()
              this.dialogVisible = false
            }
          )
        })
      },
      showEdit (currentUser, app) {
        this.editDialogVisible = true
        this.userId = parseInt(currentUser)
        this.currentApp = app
      },
      editUser () {
        let labels = this.currentApp.labels
        labels.USER_ID = this.userId + ''
        this.$store.dispatch(type.UPDATE_APP, {
          'aid': window.btoa(this.currentApp.id),
          'params': {'labels': labels}
        }).then((data) => {
          this.showResult(data, '修改所属用户成功', '修改所属用户失败', () => {
            this.listLoading = true
            this.listApp()
            this.editDialogVisible = false
          })
        })
      },
      handleCurrentChange (val) {
        this.page = val
      },
      handleClose (done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      //  获取用户列表
      listApp () {
        this.listLoading = true
        this.$store.dispatch(type.FETCH_QUEUE).then(() => {
          this.$store.dispatch(appgroupTypes.FATCH_SELF_APPGROUP).then(() => {
            this.listLoading = false
          })
        })
      },
      getUserName (userId) {
        return this.userMap.get(parseInt(userId))
      },
      showCreateAppGroup () {
        this.addAppGroupForm.id = null
        this.createAppGroupDialogVisisble = true
      },
      createAppGroup () {
        let topThis = this
        this.$store.dispatch(appgroupTypes.ADD_APPGROUP, {'id': this.addAppGroupForm.id}).then((data) => {
          topThis.showResult(data, '创建应用组成功', '创建应用组出错', () => {
            this.listApp()
            this.createAppGroupDialogVisisble = false
          })
        })
      },
      checkForm (formName) {
        this.$refs[formName].validate((valid) => {
          this.createable = !valid
        })
      },
      delAppGroup (groupId) {
        groupId = groupId.replace('/', '')
        this.$confirm('确认删除' + groupId + '应用组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(appgroupTypes.DEL_APPGROUP, groupId).then((data) => {
            this.showResult(data, '删除应用组成功!', '删除应用组出错', () => {
              this.listApp()
            })
          })
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
      this.$store.dispatch(userType.FETCH_USERS).then(() => {
        this.interval = setInterval(this.listApp, 50000)
        this.listApp()
      })
    },
    filters: {
      localMoment (str, df) {
        return this.moment(str, df)
      },
      replaceSprit (value) {
        return value.replace('/', '')
      },
      getName (value) {
        return value.split('/')[2] ? value.split('/')[2] : value.split('/')[1]
      }
    },
    beforeDestroy: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
  .el-progress div {
    background-color: black;
  }

  .progress {
    height: 10px;
    background-color: #e8e8e8;
  }

  .progress, .progress li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .progress li {
    float: left;
    -webkit-transition: width .6s ease;
    transition: width .6s ease;
  }

  .progress .healthy {
    height: 100%;
    background-color: #28f7a1;
  }

  .progress .unhealthy {
    height: 100%;
    background-color: #ff7c64;
  }

  .progress .unknown {
    height: 100%;
    background-color: #929599;
  }

  .progress .staged {
    height: 100%;
    background-color: #fff57a;
  }

  .progress .over-capacity {
    height: 100%;
    background-color: #4ca1ff;
  }

  .progress .unscheduled {
    height: 100%;
    background-color: #2a2c30;
  }

  .input-number-fix {
    height: 33px !important;
    line-height: 33px !important;
  }
</style>
