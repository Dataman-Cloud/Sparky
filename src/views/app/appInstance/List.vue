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
<!--      <el-form-item label="访问地址" v-bind:style="smallLable">
        <span>-</span>
      </el-form-item> -->
      <br clear="all">
      <el-form-item label="最近更新时间" style="margin-bottom: 20px;">
        <span>{{appInfo.version | moment('YYYY-MM-DD HH:mm:ss') }}</span>
      </el-form-item>
      <br clear="all">

      <el-button type="primary" v-showBtn="stopApp" @click="stopApp">停止</el-button>
     <!-- <el-button type="primary" @click="editDialogVisible = true">修改所属</el-button> -->
      <el-button type="primary" v-showBtn="extendApp" @click="extendApp">扩展</el-button>
      <el-button type="primary" v-showBtn="delApp" @click="delApp">删除</el-button>
<!--      <el-button type="primary">更新</el-button> -->
    </el-form>

    <el-tabs v-model="activeName">

      <el-tab-pane label="实例" name="first">

        <el-col :span="24" v-bind:style="{marginBottom:'10px'}">
          <el-button type="primary" v-on:click="init">刷新</el-button>
          <el-button type="primary" v-show="selectIds.length" v-on:click="kill">重启实例</el-button>
          <el-button type="primary" v-show="selectIds.length" v-on:click="killCancel">删除实例</el-button>
        </el-col>

        <el-table :data="tasks" highlight-current-row border ref="multipleTable" style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="id" label="实例ID" min-width="430" sortable>
            <template scope="scope">
              <router-link
                :to="{name: '容器信息', path: 'resource/node/instance/info', query:{instanceId: getInstanceId(scope.row.id), nodeIp: scope.row.host }}">
                {{scope.row.id }}
              </router-link> <br />
              <template v-if="!isMacVlan">
                <span >{{scope.row.host }}:
                  <template v-if="networkType === 'HOST' && appInfo.ipAddress">
                    <template v-for="(port, index) in appInfo.ipAddress.discovery.ports">
                      <a target="_blank"  :href="getIPAddr(scope.row.host,port.number)">{{port.number }}&nbsp&nbsp</a>
                    </template>
                  </template>
                  <template v-if="networkType === 'BRIDGE'">
                    <template v-for="port in scope.row.ports">
                      <a target="_blank"  :href="getIPAddr(scope.row.host,port)">{{port }}&nbsp&nbsp</a>
                    </template>
                  </template>
                </span>
              </template>
              <template v-else>
                <!--// 默认只有一个 mac 一个ip-->
                <span > {{scope.row.ipAddresses[0].ipAddress }}:
                  <template v-if="networkType === 'HOST' && appInfo.ipAddress">
                    <template v-for="(port, index) in appInfo.ipAddress.discovery.ports">
                      <a target="_blank"  :href="getIPAddr(scope.row.ipAddresses[0].ipAddress,port.number)">{{port.number }}&nbsp&nbsp</a>
                    </template>
                  </template>
                  <template v-if="networkType === 'BRIDGE'">
                    <template v-for="(port, index) in scope.row.ports"> <a target="_blank"  :href="getIPAddr(scope.row.ipAddresses[0].ipAddress,appInfo.container.docker.portMappings[index].containerPort)">{{appInfo.container.docker.portMappings[index].containerPort }}&nbsp&nbsp</a> </template>
                  </template>
                  </span>
              </template>

            </template>
          </el-table-column>
          <el-table-column prop="host" label="宿主机IP" min-width="130" sortable>
          </el-table-column>
          <el-table-column prop="ports" label="端口映射" min-width="200" sortable>
            <template scope="scope">
              <template v-if="!isMacVlan">
                <template v-if="networkType === 'HOST' && appInfo.ipAddress">
                  <template v-for="(port, index) in appInfo.ipAddress.discovery.ports">{{port.number}}</template>
                </template>
                <template v-if="networkType === 'BRIDGE'">
                  <template v-for="(port, index) in scope.row.ports"> {{port }}({{appInfo.container.docker.portMappings[index].containerPort }})&nbsp&nbsp </template>
                </template>
              </template>
              <template v-else>
                <template v-if="networkType === 'HOST' && appInfo.ipAddress">
                  <template v-for="(port, index) in appInfo.ipAddress.discovery.ports">{{port.number}}</template>
                </template>
                <template v-if="networkType === 'BRIDGE'">
                  <template v-for="(port, index) in scope.row.ports"> {{appInfo.container.docker.portMappings[index].containerPort }}({{appInfo.container.docker.portMappings[index].containerPort }})&nbsp&nbsp </template>
                </template>
              </template>
              </template>
          </el-table-column>
          <el-table-column prop="taskHealth" label="健康" min-width="150" sortable>
          </el-table-column>
          <el-table-column prop="taskStatus" label="状态" min-width="150" sortable>
          </el-table-column>
          <el-table-column prop="stagedAt" label="版本" min-width="250" sortable>
            <template scope="scope">
              {{scope.row.stagedAt | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column prop="startedAt" label="更新时间" min-width="250" sortable>
            <template scope="scope">
              {{scope.row.startedAt | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column label="日志" min-width="180" sortable>
            <template scope="scope">
              <a :href="getStderr(scope.row.id)" target="_blank"><el-button size="mini">stderr</el-button></a> &nbsp;
              <a :href="getStdout(scope.row.id)" target="_blank"><el-button size="mini">stdout</el-button></a>
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
        <timeline refs="timeline" :accordion='true' @expandClick="expandList">
          <template v-for="(version, index) in versions">
            <timeline-item refs="timeline-item" :index="index">
              <span slot="title">{{version === appInfo.version ? '当前版本' : version}}</span>
              <template slot="action">
                <el-button type="primary" icon="edit" size="mini" @click="versionAppUpdate(version)">编辑</el-button>
                <el-button type="primary" icon="caret-right" size="mini" @click="versionDeployment(version)"
                           v-if="version !== appInfo.version">部署</el-button>
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
            <!--      <el-form-item label="仓库认证">
                    <span>{{versionAPPInfo.uris }}</span>
                  </el-form-item> -->
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
            </timeline-item>
          </template>
        </timeline>
      </el-tab-pane>

      <el-tab-pane label="调试" name="third">

        <el-table :data="lastTaskFailureArr" highlight-current-row border style="width: 100%;">
          <el-table-column prop="key" min-width="300"  label="Last Task Failure">
          </el-table-column>
          <el-table-column prop="value" min-width="1400" show-overflow-tooltip >
          </el-table-column>
        </el-table>

      </el-tab-pane>

      <el-tab-pane label="转发规则" name="forth">
        <div style="margin-bottom: 20px;">
          <el-button type="primary" size="small" @click="bambooBtn">查看bamboo</el-button>
        <!--  <span style="margin-left: 20px;">{{bamboo}}</span> -->
        </div>
        <el-table :data="httpType" highlight-current-row border ref="multipleTable" style="width: 100%">
            <el-table-column prop="Id" label="Id" min-width="600" >
            </el-table-column>
            <el-table-column prop="Acl" label="Acl" min-width="600">
              <template scope="scope">
                <span v-for="item in scope.row.Acl.split(' ')">
                  <a target="_blank" :href="aclLink(item)">{{item}}</a> &nbsp;
                </span>
<!--                <a target="_blank" :href="aclLink(scope.row)">{{scope.row.Acl}}</a> -->
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="450" sortable>
              <template scope="scope">
                <el-button size="mini" @click="editAppRule(scope.row)">编辑</el-button> &nbsp;

                <el-button size="mini" @click="delAppAcl(scope.row)" v-show="scope.row.Acl">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
        <!--<el-col :span="24" class="toolbar">
          <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
                         style="float:right;">
          </el-pagination>
        </el-col>-->
      </el-tab-pane>

    </el-tabs>

    <el-dialog title="修改规则" :visible.sync="dialog_editAppRule" size="tiny">
      <el-form :model="appForm" ref="appForm">
        <el-form-item label="AppID" prop="Id">
          <el-input v-model="appForm.Id" v-bind:disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Acl" prop="Acl" :rules="[
          { required: true, message: '请添加ACL规则', trigger: 'blur'}]">
<!--          <el-input v-model="appForm.Acl"  required></el-input> -->
          <el-input placeholder="请输入Acl规则" v-model="appForm.Acl">
            <template slot="prepend">path_beg -i </template>
          </el-input>
        </el-form-item>

        <span>ACL 规则示例： <br/>
              <strong>path_beg -i /app-group/app1</strong> (不能仅为/)；如果有多个ACL规则请以<strong>&nbsp;空格&nbsp;</strong>隔开。</span>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog_editAppRule = false">取 消</el-button>
        <el-button type="primary" @click="updateAcl(appForm)">确 定</el-button>
      </div>

    </el-dialog>

<!--    <el-dialog title="修改所属" :visible.sync="editDialogVisible" size="tiny">
      <el-select v-model="userId" placeholder="请选择所属用户">
        <el-option v-for="item in users" :label="item.name" :value="item.id" :key="item.id"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>-->

    <el-dialog title="扩展" :visible.sync="dialogVisible" size="tiny">
      <el-input-number v-model="instancesNums" size="small" :min="0" :step="1"></el-input-number>
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
  import Timeline from '@/components/timeline/timeline'
  import TimelineItem from '@/components/timeline/timeline-item'
  import * as appTypes from '@/store/app/mutations_types'
  import { Notification } from 'element-ui'

  export default {
    components: {
      Timeline,
      TimelineItem
    },
    data () {
      return {
        appForm: {
          Id: '',
          Acl: null
        },
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
        dialog_editAppRule: false,
        bamboo: '',
        activeName: 'first',
        /*
         import {DEFAULT_BASE_URL} from '@/config'
         download: `DEFAULT_BASE_URL/jborg/file/download/`, // 下载文件的接
        */
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
        instancesNums: 0,
        dialogVisible: false,
        versionAPPInfo: undefined,
        // appIdEncoded: window.btoa('/' + this.$route.params.group + '/' + this.$route.params.name)
        appIdEncoded: window.btoa(this.$route.params.appid),
        isMacVlan: false,
        networkType: ''
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
          let isMacVlan = false
          let networkType = ''
          if (appinfo && appinfo.container && appinfo.container.docker && appinfo.container.docker.network) {
            networkType = appinfo.container.docker.network
          }
          if (appinfo && appinfo.container && appinfo.container.docker && appinfo.container.docker.parameters) {
            for (let p of appinfo.container.docker.parameters) {
              if (p.key === 'net') {
                isMacVlan = true
              }
            }
          }
          this.isMacVlan = isMacVlan
          this.networkType = networkType
          return appinfo
        },
        httpType (state) {
          let httpTypes = []
         /* if (this.appInfo.labels.HAPROXY_PROTOCOL_TYPE !== 'https') {
            return httpTypes
          } */
//          let json = state.app.appAcl
          let value = JSON.parse(state.app.appAcl.data)
          value.Acl = value.Acl.substring(12, value.Acl.length)
          httpTypes.push(value)
          return httpTypes
        },
        getBamboo (state) {
          return state.app.appAcl.bamboo
        },
        getServiceUrl (state) {
          return state.app.appAcl.serviceUrl
        },
        tasks (state) {
          let arr = state.app.apps.currApp.tasks || []
//          console.log(11111111111)
//          console.log(JSON.stringify(state.app.apps.currApp))
          this.healthy = 0
          this.unhealthy = 0
          this.unknown = 0
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
          let versions = state.app.apps.appVersions.versions
          let arrs = [] // 排序后
          for (let i = 0; i < versions.length; i++) {
            arrs.push(versions[versions.length - i - 1])
          }
          return arrs
        },
        users (state) {
          return state.user.users.users
        },
        total (state) {
          //  获取元素个数
      //    console.log(state.app.apps.currContainers)
          return Object.getOwnPropertyNames(state.app.apps.currContainers).length - 1
        },
        versionsInfo (state) {
          return state.app.apps.appVersionInfo
        }
      })
    },
    methods: {
      bambooBtn () {
        this.bamboo = this.getBamboo
        let $a = document.createElement('a')
        $a.target = '_blank'
        $a.href = this.getBamboo
        let evt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: false
        })
        $a.dispatchEvent(evt)
      },
      extendApp () {
        this.instancesNums = this.instancesNum
        this.dialogVisible = true
      },
      addAclGroups () {
        this.appForm.Acl += ' ' + this.appForm.Acl
      },
      delAppAcl (parm) {
        let aid = parm.Id
        this.$confirm('是否删除此应用的Acl?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.DEL_APPACL, window.btoa(aid)).then((data) => {
            if (data.resultCode === '00') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getAppAcl()
              this.activeName = 'first'
            } else {
              Notification({
                title: '删除出错',
                message: JSON.stringify(data.message),
                type: 'error'
              })
            }
          })
        })
      },
      updateAcl (parm) {
        // (\/)[A-Za-z0-9\/]+
        var truePat = /^\/[/A-Za-z0-9-.]+$/
        var errPat = /^\/+$/
        let arrs = parm.Acl.trim().split(' ')
        for (let arr of arrs) {
          if (errPat.test(arr) || !truePat.test(arr)) {
            this.$message.error('无效的ACL规则 ' + arr)
            return false
          }
        }
        this.$refs.appForm.validate((valid) => {
          if (valid) {
            this.$store.dispatch(type.UPDATE_APPACL, {Id: parm.Id, Acl: 'path_beg -i ' + parm.Acl}).then(() => {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.dialog_editAppRule = false
              this.getAppAcl()
              this.activeName = 'first'
            })
          }
        })
      },
      editAppRule (para) {
        this.dialog_editAppRule = true
        this.appForm.Id = para.Id
        this.appForm.Acl = para.Acl
      },
      getAppAcl () {
        return this.$store.dispatch(type.GET_APPACL_BY_APPID, this.appIdEncoded)
      },
      handleCurrentChange (val) {
        this.page = val
      },
      getAppInfo () {
        return this.$store.dispatch(type.FETCH_APP_INFO, this.appIdEncoded)
      },
      getQueue () {
        return this.$store.dispatch(type.FETCH_QUEUE)
      },
      getAppVersions () {
        return this.$store.dispatch(type.FETCH_APP_VERSIONS, this.appIdEncoded)
      },
      getAppContainers () {
        return this.$store.dispatch(type.FETCH_APP_CONTAINERS, this.appIdEncoded)
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
      aclLink (parm) {
        let url = ''
        if (parm.startsWith('/')) {
          url = 'http://' + this.getServiceUrl + parm
        } else {
          url = 'http://' + this.getServiceUrl + '/' + parm
        }
        return url
      },
      getIPAddr (host, port) {
        // console.log(para)
//        let ip = para.host
//        let port = para.ports
        return 'http://' + host + ':' + port
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
        this.$confirm('是否确认重启选中的实例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.KILL_TASK, param).then(() => {
            this.$message({message: '重启中', type: 'success'})
            this.init()
          })
        }).catch(() => {
          this.$refs.multipleTable.clearSelection()
        })
      },
      killCancel () {
        let param = {ids: this.selectIds}
        this.$confirm('是否确认删除选中的实例?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.KILL_TASK_SCALE, param).then(() => {
            this.$message({message: '删除中', type: 'success'})
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
        let param = {'aid': window.btoa(this.appInfo.id), 'params': {'instances': this.instancesNums}}
        this.$store.dispatch(type.UPDATE_APP, param).then((data) => {
          if (data.resultCode === '00') {
            myMessage({type: 'success', message: '扩展实例中'})
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
        this.getAppVersions()
        this.getAppContainers()
        this.getQueue()
        this.getAppAcl()
//        if (this.appInfo.labels.HAPROXY_PROTOCOL_TYPE === 'https') {
//          this.getAppAcl()
//        }
//       this.initSelect()
      },
      // 根据版本查询应用信息
      expandList (index) {
        let version = this.versions[index]
        // 对比当前的版本信息
        if (this.versionAPPInfo !== undefined && this.versionAPPInfo.version !== version) {
          // 查询该版本的应用信息
          this.$store.dispatch(type.FETCH_APP_VERSION_INFO, {'aid': window.btoa(this.appInfo.id), 'vid': window.btoa(version)})
            .then((data) => {
              if (data.resultCode !== '00') {
                this.$message({type: 'error', message: '查询该版本应用信息失败!', onClose: this.goAppList})
              } else {
                let appVersionInfo = this.versionsInfo
                appVersionInfo.containerJson = JSON.stringify(appVersionInfo.container, null, 4)
                appVersionInfo.healthChecksJson = JSON.stringify(appVersionInfo.healthChecks, null, 4)
                appVersionInfo.envJson = JSON.stringify(appVersionInfo.env, null, 4)
                appVersionInfo.constraintsJson = JSON.stringify(appVersionInfo.constraints, null, 4)
                this.versionAPPInfo = appVersionInfo
              }
            })
        }
      },
      // 根据版本部署应用
      versionDeployment (version) {
        this.$confirm(`是否部署此版本?`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          // 对比当前的版本信息
          if (this.versionAPPInfo !== undefined && this.versionAPPInfo.version !== version) {
            // 查询该版本的应用信息
            this.$store.dispatch(type.FETCH_APP_VERSION_INFO, {'aid': window.btoa(this.appInfo.id), 'vid': window.btoa(version)})
              .then((data) => {
                if (data.resultCode !== '00') {
                  this.$message({type: 'error', message: '查询该版本应用信息失败!', onClose: this.goAppList})
                } else {
                  /!* -----封装json数据 ----------- *!/
                  let parJSON = this.versionsInfo
                  parJSON['id'] = parJSON['id'].substring(1, parJSON['id'].length)
                  // 删除version，不删报错
                  delete (parJSON['version'])
                  this.$store.dispatch(appTypes.UPDATE_APP, {
                    'aid': window.btoa(this.versionAPPInfo.id),
                    'params': parJSON
                  }).then(data => {
                    //        console.log('***************************返回结果' + JSON.stringify(data))
                    if (data.resultCode === '00') {
                      this.$message({
                        type: 'success',
                        message: '部署应用成功!'
                        //  onClose: this.activeName = 'first'
                      })
                      this.activeName = 'first'
                    } else {
                      Notification({
                        title: '部署应用出错',
                        message: JSON.stringify(data.message),
                        type: 'error'
                      })
                    }
                  })
                }
              })
          }
        })
      },
      versionAppUpdate (version) {
        this.$router.push({path: '/app/versionAppUpdate', query: {'aid': this.appInfo.id, 'vid': version}})
      }
    },
    mounted () {
      this.init()
      this.getAppVersions()
      // this.getUsers()
      this.interval = setInterval(() => this.init(), 5000)
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
  a,
  a:focus,
  a:hover {
    text-decoration: none;
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
