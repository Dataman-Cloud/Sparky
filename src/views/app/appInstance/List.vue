<template>
  <section>
    <el-form label-position="left" inline class="demo-table-expand" style="padding-top: 20px;">

      <el-form-item label="healthy" v-bind:style="smallLable">
        <el-tag type="gray">{{healthy }}</el-tag>
      </el-form-item>
      <el-form-item label="unhealthy" v-bind:style="smallLable">
        <el-tag type="gray">{{unhealthy }}</el-tag>
      </el-form-item>
      <el-form-item label="unknown" v-bind:style="smallLable">
        <el-tag type="gray">{{unknown }}</el-tag>
      </el-form-item>
      <br clear="all">
      <el-form-item label="应用名称" v-bind:style="smallLable">
        <span>{{appInfo.id }}</span>
      </el-form-item>
      <el-form-item label="应用状态" v-bind:style="smallLable">
        <span>{{appInfo.status }}</span>
      </el-form-item>
      <el-form-item label="访问地址" v-bind:style="smallLable">
        <span>-</span>
      </el-form-item>
      <br clear="all">
      <el-form-item label="最近更新时间" style="margin-bottom: 20px;">
        <span>{{appInfo.version | moment('YYYY-MM-DD HH:mm:ss') }}</span>
      </el-form-item>
      <br clear="all">

      <el-button type="primary" @click="stopApp">停止</el-button>
      <el-button type="primary" @click="editDialogVisible = true">修改所属</el-button>
      <el-button type="primary" @click="dialogVisible = true">扩展</el-button>
      <el-button type="primary" @click="delApp">删除</el-button>
<!--      <el-button type="primary">更新</el-button> -->
    </el-form>

    <el-tabs v-model="activeName">

      <el-tab-pane label="实例" name="first">

        <el-col :span="24" v-bind:style="{marginBottom:'10px'}">
          <el-button type="primary" v-on:click="init">刷新</el-button>
          <el-button type="primary" v-show="selectIds.length" v-on:click="kill">KILL&RESTART</el-button>
          <el-button type="primary" v-show="selectIds.length" v-on:click="killCancel">KILL&CANCEL</el-button>
        </el-col>

        <el-table :data="tasks" highlight-current-row border ref="multipleTable" style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="实例ID" min-width="400" sortable>
            <template scope="scope">
              <router-link
                :to="{name: '容器信息', path: 'resource/node/instance/info', query:{instanceId: getInstanceId(scope.row.id), nodeIp: scope.row.host }}">
                {{scope.row.id }}
              </router-link> <br />

              -<a target="_blank" :href="getIPAddr(scope.row)"><span>{{scope.row.host }}:{{scope.row.ports }}</span></a>
            </template>
          </el-table-column>
          <el-table-column prop="host" label="IP" min-width="150" sortable>
          </el-table-column>
          <el-table-column prop="ports" label="端口" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="taskHealth" label="健康" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="taskStatus" label="状态" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="version" label="版本" min-width="200" sortable>
            <template scope="scope">
              {{scope.row.version | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column prop="startedAt" label="更新时间" min-width="200" sortable>
            <template scope="scope">
              {{scope.row.startedAt | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column label="日志" min-width="150" sortable>
            <template scope="scope">
              <a :href="getStderr(scope.row.id)" target="_blank">stderr</a>
              <a :href="getStdout(scope.row.id)" target="_blank">stdout</a>
            </template>
          </el-table-column>

        </el-table>
        <el-col :span="24" class="toolbar">
          <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
                         style="float:right;">
          </el-pagination>
        </el-col>
      </el-tab-pane>

      <el-tab-pane label="配置" name="second">
        <template v-for="(version, index) in versions">
          <time-line refs="time-line" :index="index" @expandClick="expandList(version)">
            <span slot="title">{{version === appInfo.version ? '当前版本' : version}}</span>
            <template slot="action">
              <el-button type="primary" icon="edit" size="mini">编辑</el-button>
              <el-button type="primary" icon="caret-right" size="mini">部署</el-button>
            </template>
            <!-- v-if="version === appInfo.version"  -->
            <template slot="content">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="应用名称">
                  <span>{{versionAPPInfo.id }}</span>
                </el-form-item>
                <el-form-item label="CPU">
                  <span>{{versionAPPInfo.cpus * 100 }}%</span>
                </el-form-item>
                <el-form-item label="内存">
                  <span>{{versionAPPInfo.mem }}M</span>
                </el-form-item>
                <el-form-item label="实例个数">
                  <span>{{versionAPPInfo.instances }}</span>
                </el-form-item>
                <el-form-item label="CMD">
                  <span>{{versionAPPInfo.cmd }}</span>
                </el-form-item>
                <el-form-item label="版本">
                  <span>{{versionAPPInfo.version }}</span>
                </el-form-item>
                <el-form-item label="应用端口">
                  <span v-if="versionAPPInfo.labels !== undefined">{{versionAPPInfo.labels.BORG_FRONTEND_APP_PORT }}</span>
                </el-form-item>
                <el-form-item label="协议">
                  <span v-if="versionAPPInfo.labels !== undefined">{{versionAPPInfo.labels.BORG_FRONTEND_PROTO }}</span>
                </el-form-item>
                <el-form-item label="映射端口">
                  <span v-if="versionAPPInfo.labels !== undefined">{{versionAPPInfo.labels.BORG_FRONTEND_MAP_PORT }}</span>
                </el-form-item>
                <el-form-item label="仓库认证">
                  <span>{{versionAPPInfo.uris }}</span>
                </el-form-item>
                <el-form-item label="环境变量">
                  <span>{{versionAPPInfo.envJson }}</span>
                </el-form-item>

                <el-form-item label="限制条件" v-bind:style="bigLable">
                  <div v-bind:style="codeView">
                    <pre v-bind:style="codeViewPre">{{versionAPPInfo.constraintsJson}}</pre>
                  </div>
                </el-form-item>
                <el-form-item label="健康检查" v-bind:style="bigLable">
                  <div v-bind:style="codeView">
                    <pre v-bind:style="codeViewPre">{{versionAPPInfo.healthChecksJson}}</pre>
                  </div>
                </el-form-item>
                <el-form-item label="容器信息" v-bind:style="bigLable">
                  <div v-bind:style="codeView">
                    <pre v-bind:style="codeViewPre">{{versionAPPInfo.containerJson}}</pre>
                  </div>
                </el-form-item>
              </el-form>
            </template>
          </time-line>
        </template>
      </el-tab-pane>

      <el-tab-pane label="调试" name="third">

        <el-table :data="lastTaskFailureArr" highlight-current-row border style="width: 100%">
          <el-table-column prop="key" label="key" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="value" label="value" min-width="400" sortable>
          </el-table-column>
        </el-table>

      </el-tab-pane>

    </el-tabs>


    <el-dialog title="修改所属" :visible.sync="editDialogVisible" size="tiny">
      <el-select v-model="userId" placeholder="请选择所属用户">
        <el-option v-for="item in users" :label="item.name" :value="item.id" :key="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="扩展" :visible.sync="dialogVisible" size="tiny">
      <el-input-number v-model="instancesNum" size="small" :min="0" :step="1"></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="extend()">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import { mapState } from 'vuex'
  import * as type from '../../../store/app/mutations_types'
  import * as userType from '../../../store/user/mutations_types'
  import TimeLine from '@/components/timeline/index'

  export default {
    components: {
      TimeLine
    },
    data () {
      return {
        smallLable: {
          width: '30%'
        },
        bigLable: {
          width: '80%'
        },
        codeView: {
          minWidth: '600px',
          background: 'black',
          color: 'white',
          fontSize: '12px',
          margin: '10px'
        },
        codeViewPre: {
          margin: '0px',
          lineHeight: '18px'
        },
        activeName: 'first',
        download: `${window.location.protocol}//${window.location.host}/jborg/file/download/`, // 下载文件的接
        page: 1, // 默认当前第1页
        pageSize: 10, // 一页显示几条数据
        interval: null,
        healthy: 0,
        unhealthy: 0,
        unknown: 0,
        selectIds: [],
        activeNames: null,
        userId: null,
        editDialogVisible: false,
        instancesNum: 0,
        dialogVisible: false,
        versionAPPInfo: undefined
      }
    },
    computed: {
      ...mapState({
        appInfo (state) {
          let appinfo = state.app.apps.currApp
          let queue = state.app.apps.queue.queue || []
          this.detectAppStatus(appinfo)
          this.applyAppDelayStatus(appinfo, queue)
          this.activeNames = appinfo.version
          appinfo.containerJson = JSON.stringify(appinfo.container, null, 4)
          appinfo.healthChecksJson = JSON.stringify(appinfo.healthChecks, null, 4)
          appinfo.envJson = JSON.stringify(appinfo.env, null, 4)
          appinfo.constraintsJson = JSON.stringify(appinfo.constraints, null, 4)
          this.instancesNum = appinfo.instances
          // 版本应用信息默认为当前应用信息
          this.versionAPPInfo = appinfo
          return appinfo
        },
        tasks (state) {
          let arr = state.app.apps.currApp.tasks || []
          // console.log(arr.length)
          for (let task of arr) {
            let taskStatus = this.getTaskStatus(task)
            task.taskStatus = taskStatus
            let taskHealth = this.getTaskHealth(task)
            task.taskHealth = taskHealth
            this.countHealth(taskHealth)
          }
          return arr.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
        },
        containers (state) {
          return state.app.apps.currContainers
        },
        lastTaskFailureArr (state) {
          let arr = []
          if (!state.app.apps.currApp.lastTaskFailure) {
            return arr
          }
          for (var key of Object.keys(state.app.apps.currApp.lastTaskFailure)) {
            arr.push({key: key, value: state.app.apps.currApp.lastTaskFailure[key]})
          }
          return arr
        },
        queue (state) {
          return state.app.apps.queue.queue
        },
        versions (state) {
          return state.app.apps.appVersions.versions
        },
        users (state) {
          return state.user.users.users
        },
        total (state) {
          // 获取元素个数
          return Object.getOwnPropertyNames(state.app.apps.currContainers).length - 1
        },
        versionsInfo (state) {
          let appVersionInfo = state.app.apps.appVersionInfo
          appVersionInfo.containerJson = JSON.stringify(appVersionInfo.container, null, 4)
          appVersionInfo.healthChecksJson = JSON.stringify(appVersionInfo.healthChecks, null, 4)
          appVersionInfo.envJson = JSON.stringify(appVersionInfo.env, null, 4)
          appVersionInfo.constraintsJson = JSON.stringify(appVersionInfo.constraints, null, 4)
          return appVersionInfo
        }
      })
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
      },
      getAppInfo () {
        let aid = window.btoa(this.$route.query.id)
        return this.$store.dispatch(type.FETCH_APP_INFO, aid)
      },
      getQueue () {
        return this.$store.dispatch(type.FETCH_QUEUE)
      },
      getAppVersions () {
        let aid = window.btoa(this.$route.query.id)
        return this.$store.dispatch(type.FETCH_APP_VERSIONS, aid)
      },
      getAppContainers () {
        let aid = window.btoa(this.$route.query.id)
        return this.$store.dispatch(type.FETCH_APP_CONTAINERS, aid)
      },
      getInstanceId (taskId) {
//        console.log('*********************containers=' + this.containers.length + ':::::::::::::::::' + JSON.stringify(this.containers))
//        console.log('***************taskId=' + 'test_aaaa.c770c2c8-5580-11e7-bb08-02428b347a54')
//        console.log('=--------------------taskId:' + taskId)
        try {
          let container = this.containers[taskId]
//          console.log('222222222222222222222' + JSON.stringify(container))
          return container.containerId
        } catch (err) {
          console.log('**********************' + err)
          return ''
        }
      },
      getTaskHealth (task) {
        let healthStatus = 'Unknown'
        let healthCheckResults = task.healthCheckResults
        if (healthCheckResults != null && healthCheckResults.length > 0) {
          let isHealthy = false
          for (let i = 0; i < healthCheckResults.length; i++) {
            let hcr = healthCheckResults[i]
            if (hcr.firstSuccess) {
              isHealthy = hcr.alive
            }
            if (!isHealthy) {
              healthStatus = 'Unhealthy'
              break
            } else {
              healthStatus = 'Healthy'
            }
          }
        }
        return healthStatus
      },
      getTaskStatus (task) {
        let status = 'Started'
        if (task.startedAt != null) {
          status = 'Started'
          task.updatedAt = task.startedAt
        } else if (task.stagedAt != null) {
          status = 'Staged'
          task.updatedAt = task.stagedAt
        } else if (task.localVolumes != null && task.localVolumes.length > 0) {
          status = 'Suspended'
        }
        return status
      },
      detectAppStatus (app) {
        if (app.deployments != null && app.deployments.length > 0) {
          let results = app.readinessCheckResults || []
          app.status = 'DEPLOYING'
          if (results != null && results.length > 0) {
            var isWaitingForUserAction = results.some(function (result) {
              if (result.lastResponse != null && result.lastResponse.body != null) {
                let status = null
                try {
                  status = JSON.parse(result.lastResponse.body).status
                } catch (e) {
                  return false
                }
                return status != null && status === 'Waiting'
              }
            })
            if (isWaitingForUserAction === true) {
              app.status = 'WAITING_FOR_USER_ACTION'
            }
          }
        } else if (app.instances === 0 && !app.tasksRunning) {
          app.status = 'SUSPENDED'
        } else if (app.tasksRunning > 0) {
          app.status = 'RUNNING'
        }
      },
      applyAppDelayStatus (app, queue) {
        let queueEntry = queue.find(function (entry) {
          return entry.app != null && app.id === entry.app.id && entry.delay != null
        })
        if (queueEntry) {
          let status = queueEntry.delay.overdue ? 'WAITING' : 'DELAYED'
          app.status = status
        }
      },
      countHealth (taskHealth) {
        switch (taskHealth) {
          case 'Unknown' :
            this.unknown++
            break
          case 'Unhealthy' :
            this.unhealthy++
            break
          case 'Healthy' :
            this.healthy++
            break
        }
      },
      getIPAddr (para) {
        let ip = para.host
        let port = para.ports
        return 'http://' + ip + ':' + port
      },
      getStderr (id) {
        if (this.containers !== undefined && this.containers[id] !== undefined) {
          let filePath = window.btoa(this.containers[id].stderrPath)
          let stderr = this.download + `stderr?filePath=${filePath}`
          return stderr
        }
      },
      getStdout (id) {
        if (this.containers !== undefined && this.containers[id] !== undefined) {
          let stdoutPath = window.btoa(this.containers[id].stdoutPath)
          let stdout = this.download + `stdout?filePath=${stdoutPath}`
          return stdout
        }
      },
      handleSelectionChange (val) {
        this.selectIds = []
        for (let task of val) {
          this.selectIds.push(task.id)
        }
      },
//      initSelect () {
//        this.selectIds.forEach(id => {
//          let tasks = this.tasks.find(function (task) { return task.id === id })
//          if (tasks.length > 0) {
//            this.$refs.multipleTable.toggleRowSelection(tasks[0])
//          }
//        })
//      },
      kill () {
        let param = {ids: this.selectIds}
        this.$confirm('是否确认kill选中的实例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.KILL_TASK, param).then(() => {
            this.$message({message: 'kill success', type: 'success'})
            this.init()
          })
        }).catch(() => {
          this.$refs.multipleTable.clearSelection()
        })
      },
      killCancel () {
        let param = {ids: this.selectIds}
        this.$confirm('是否确认kill选中的实例并scale应用?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.KILL_TASK_SCALE, param).then(() => {
            this.$message({message: 'kill success', type: 'success'})
            this.init()
          })
        }).catch(() => {
          this.$refs.multipleTable.clearSelection()
        })
      },
      handleChange (open) {
        console.log(open)
      },
      getUsers () {
        this.$store.dispatch(userType.FETCH_USERS)
      },
      editUser () {
        let labels = this.appInfo.labels
        labels.USER_ID = this.userId + ''
        let param = {'aid': window.btoa(this.appInfo.id), 'params': {'labels': labels}}
        this.$store.dispatch(type.UPDATE_APP, param).then((data) => {
          if (data.code === 0) {
            this.$message({type: 'success', message: '修改所属用户成功!'})
            this.editDialogVisible = false
          }
        })
      },
      stopApp () {
        let myMessage = this.$message
        let param = {'aid': window.btoa(this.appInfo.id), 'params': {'instances': 0}}
        this.$store.dispatch(type.UPDATE_APP, param).then(function (data) {
          if (data.resultCode === '00') {
            myMessage({type: 'success', message: '停止成功!'})
          }
        })
      },
      extend () {
        let myMessage = this.$message
        let param = {'aid': window.btoa(this.appInfo.id), 'params': {'instances': this.instancesNum}}
        this.$store.dispatch(type.UPDATE_APP, param).then((data) => {
          if (data.resultCode === '00') {
            myMessage({type: 'success', message: '扩展成功!'})
            this.dialogVisible = false
            this.init()
          }
        })
      },
      delApp () {
        let aid = this.appInfo.id
        this.$confirm(`是否删除${aid}应用`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          // 确定后请求删除接口
          return this.$store.dispatch(type.DEL_APP, window.btoa(aid.substring(1))).then(() => {
            this.$message({type: 'success', message: '删除成功!', onClose: this.goAppList})
          })
        })
      },
      goAppList () {
        this.$router.push('/app/list/apps')
      },
      init () {
        this.healthy = 0
        this.unhealthy = 0
        this.unknown = 0
        this.getAppInfo()
        this.getAppContainers()
        this.getQueue()
//        this.initSelect()
      },
      expandList (version) {
        // 对比当前的版本信息
        if (this.versionAPPInfo !== undefined && this.versionAPPInfo.version !== version) {
          // 查询该版本的应用信息
          this.$store.dispatch(type.FETCH_APP_VERSION_INFO, {'aid': window.btoa(this.appInfo.id), 'vid': window.btoa(version)})
            .then((data) => {
              if (data.resultCode !== '00') {
                this.$message({type: 'error', message: '查询该版本应用信息失败!', onClose: this.goAppList})
              } else {
                this.versionAPPInfo = this.versionsInfo
              }
            })
        }
      }
    },
    mounted () {
      this.init()
      this.getAppVersions()
      this.getUsers()
//      this.interval = setInterval(() => this.init(), 30000)
    },
    beforeDestroy: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
