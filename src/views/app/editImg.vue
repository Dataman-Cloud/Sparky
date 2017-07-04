<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="表单模式" name="formModel">
        <el-form-item label="应用id" prop="name" style="width: 400px;">
          <el-input v-model="ruleForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="镜像地址" prop="image" style="width:800px;">
          <el-input v-model="ruleForm.image"></el-input>
          <el-checkbox label="强制拉取镜像" v-model="ruleForm.force" name="force"></el-checkbox>
        </el-form-item>
        <el-form-item label="仓库认证" prop="base">
          <el-select v-model="ruleForm.base" placeholder="请选择仓库">
            <el-option v-for="item in this.repos" :label="item.name" :value="item.accountId"
                       :key="item.accountId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择集群" prop="vcluster">
          <el-select v-model="ruleForm.vcluster" :disabled="true" placeholder="请选择集群">
            <el-option v-for="item in this.mutation.clusters" :label="item.clusterLabel"
                       :value="item.clusterLabel" :key="item.clusterLabel"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择主机" prop="master">
          <el-select v-model="ruleForm.master" placeholder="请选择主机">
            <el-option v-for="item in this.node.slaves" :label="item.hostname" :value="item.hostname"
                       :key="item.hostname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用组" prop="group">
          <el-select v-model="ruleForm.group" :disabled="true" placeholder="请选择应用组">
            <el-option v-for="item in this.appgroups" :label="item.id | replaceSprit"
                       :value="item.id | replaceSprit" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网络模式">
          <el-radio-group v-model="ruleForm.network" @change="networkChange">
            <el-radio label="BRIDGE">网桥模式</el-radio>
            <el-radio label="HOST">HOST模式</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="容器规格" prop="norms">
          <el-col :span="6" class="height-30 min-width">
            <label for="">CPUs</label>
            <el-input-number v-model="ruleForm.cpus" size="small" :min="0.01" :step="0.01"></el-input-number>
          </el-col>
          <el-col :span="6" class="height-30 min-width">
            <label for="">内存</label>
            <el-input-number v-model="ruleForm.memory" size="small" :min="16" :step="1"></el-input-number>
          </el-col>
          <el-col :span="6" class="height-30 min-width">
            <label for="">硬盘</label>
            <el-input-number v-model="ruleForm.hardDrive" size="small" :min="0" :step="1"></el-input-number>
          </el-col>
        </el-form-item>
        <el-form-item label="容器个数" prop="dockerNum"
                      style="width: 300px;">
          <el-input v-model.number="ruleForm.dockerNum"></el-input>
          <el-checkbox label="1容器：1主机" v-model="ruleForm.dockerProportion" name="dockerProportion"></el-checkbox>
        </el-form-item>

        <el-form-item label="F5 Pool名称" :rules="rules" style="width: 400px;">
          <el-input v-model="ruleForm.f5Pool"></el-input>
        </el-form-item>

        <!--<el-form-item label="程序包挂载" prop="procedureMount" style="width: 400px;">-->
        <!--<el-input v-model="ruleForm.procedureMount"></el-input>-->
        <!--</el-form-item>-->

        <!-- 这里开始高级选项 -->
        <el-collapse>
          <el-collapse-item title="高级选项" name="1">
            <el-row>
              <el-row>
                <a v-show="ruleForm.network==='BRIDGE'" @click="addPorts" class="cursor-pointer">添加端口<i
                  class="el-icon-plus"></i></a>
              </el-row>
              <template v-for="(port, index) in ruleForm.ports">
                <el-col :span="24" :key="index" class="margin-bottom height-30 min-width"
                        v-show="ruleForm.network==='BRIDGE'">
                  <el-input v-model="port.containerPort" placeholder="端口号" size="small" style="width: 120px; padding-bottom: 16px;"></el-input>
                  <el-select v-model="port.protocol" placeholder="" size="small" style="width:100px;">
                    <el-option label="tcp" value="tcp"></el-option>
                    <el-option label="udp" value="udp"></el-option>
                  </el-select>
                  <el-button @click.prevent="removePorts(port)" size="small">删除</el-button>
                </el-col>
              </template>
            </el-row>
            <el-row>
              <el-row>
                <a @click="addMount" class="cursor-pointer">挂载目录<a class="el-icon-plus"></a></a>
              </el-row>
              <el-form-item
                v-for="(mount, index) in ruleForm.mounts" class="margin-left-100" :key="index">
                <el-input v-model="mount.containerPath" placeholder="容器路径" size="small"
                          style="width: 300px;"></el-input>
                <el-input v-model="mount.hostPath" placeholder="主机路径" size="small" style="width: 300px;"></el-input>
                <el-select v-model="mount.mode" size="small" style="width: 100px;">
                  <el-option label="只读" value="RO"></el-option>
                  <el-option label="读写" value="RW"></el-option>
                </el-select>
                <el-button @click.prevent="removeMount(mount)" size="small">删除</el-button>
              </el-form-item>
            </el-row>
            <el-row>
              <el-row>
                <a @click="addHealth" class="cursor-pointer">健康检查<i class="el-icon-plus"></i></a>
              </el-row>
              <template v-for="(h, index) in ruleForm.health">
                <el-col :span="24" :key="index" class="margin-top margin-bottom">
                  <div class="table-cell">
                    <div class="label">
                      <label for="">协议</label>
                    </div>
                    <div class=" height-30">
                      <el-select @change="healthProtocolChange(h)" v-model="h.protocol" size="small"
                                 style="width: 100px;">
                        <el-option label="HTTP" value="HTTP"></el-option>
                        <el-option label="TCP" value="TCP"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div v-if="h.healthHttpPathText" :id="'healthHttpPathText' + index" class="table-cell">
                    <div class="label">
                      <label for="">路径</label>
                    </div>
                    <div class=" height-30">
                      <el-input v-model="h.path" placeholder="" size="small" style="width: 120px;"></el-input>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="label">
                      <el-tooltip content="在这一时间段内，健康检查返回的失败结果将被忽略，即允许健康检查失败的时间间隔。" placement="top">
                        <a class="el-icon-information"></a>
                      </el-tooltip>
                      <label for="">宽限时间（秒）</label>
                    </div>
                    <div class="height-30">
                      <el-input-number v-model="h.gracePeriodSeconds" size="small" :min="0" :step="1"></el-input-number>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="label">
                      <el-tooltip content="两次健康检查之间的时间间隔。" placement="top">
                        <a class="el-icon-information"></a>
                      </el-tooltip>
                      <label for="">检查间隔（秒）</label>
                    </div>
                    <div class="height-30">
                      <el-input-number v-model="h.intervalSeconds" size="small" :min="0" :step="1"></el-input-number>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="label">
                      <el-tooltip content="如果健康检查的返回结果超过这个时间即认为此次健康检查结果为不健康，而无论最终的返回结果是健康或不健康。" placement="top">
                        <a class="el-icon-information"></a>
                      </el-tooltip>
                      <label for="">检查超时（秒）</label>
                    </div>
                    <div class="height-30">
                      <el-input-number v-model="h.timeoutSeconds" size="small" :min="0" :step="1"></el-input-number>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="label">
                      <el-tooltip content="设置该参数后，如果一个实例的健康检查连续不健康的次数达到该参数，该实例将被停止。但如果该参数设为0，健康检查获取不健康返回时并不会停止实例。"
                                  placement="top">
                        <a class="el-icon-information"></a>
                      </el-tooltip>
                      <label for="">最多持续失败次数</label>
                    </div>
                    <div class="height-30">
                      <el-input-number v-model="h.maxConsecutiveFailures" size="small" :min="0"
                                       :step="1"></el-input-number>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="label">
                      <label for="">端口类型</label>
                    </div>
                    <div class="height-30">
                      <el-select @change="healthPortTypeChange(h)" v-model="h.portType" size="small"
                                 style="width: 100px;">
                        <el-option label="端口组索引" value="1"></el-option>
                        <el-option label="端口号" value="2"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="label">
                      <label for="">{{h.portNumOrPortIndexText}}</label>
                    </div>
                    <div class="height-30">
                      <el-input id="protNum" v-if="h.protNumCode" v-model="h.port" property="端口号" size="small"  style="width:120px"></el-input>
                      <el-input id="protIndex" v-if="h.portIndexCode" v-model="h.portIndex" property="端口组索引" size="small" style="width:120px"></el-input>
                    </div>
                  </div>
                  <div class="table-cell">
                    <div class="hidden">
                      <label for="">删除</label>
                    </div>
                    <div class="height-30">
                      <el-button @click.prevent="removeHealth(h)" size="small">删除</el-button>
                    </div>
                  </div>
                  <el-col v-if="h.healthHttpCheckBoxCode" colspan="2" :id="'healthHttpCheckBoxCode' + index" :span="24">
                    <el-checkbox label="忽略HTTP返回码100~199" v-model="h.ignoreHttp1xx"></el-checkbox>
                  </el-col>
                </el-col>
              </template>
            </el-row>
            <el-row>
              <el-row>
                <a @click="addEnvironmentVariable" class="cursor-pointer">自定义环境变量<i class="el-icon-plus"></i></a>
              </el-row>
              <el-form-item
                v-for="(ev, index) in ruleForm.environmentVariables" class="margin-left-100" :key="index">
                <el-input v-model="ev.key" placeholder="key" size="small" style="width: 300px;"></el-input>
                <el-input v-model="ev.value" placeholder="value" size="small" style="width: 300px;"></el-input>
                <el-button @click.prevent="removeEnvironmentVariable(ev)" size="small">删除</el-button>
              </el-form-item>
            </el-row>
            <el-row>
              <el-row>
                <a @click="addDockerPar" class="cursor-pointer">自定义Docker参数<i class="el-icon-plus"></i></a>
              </el-row>
              <el-form-item
                v-for="(dp, index) in ruleForm.dockerPar" class="margin-left-100" :key="index">
                <el-input v-model="dp.key" placeholder="key" size="small" style="width: 300px;"></el-input>
                <el-input v-model="dp.value" placeholder="value" size="small" style="width: 300px;"></el-input>
                <el-button @click.prevent="removeDockerPar(dp)" size="small">删除</el-button>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="CMD" :rules="rules" style="width: 400px;">
                <el-input v-model="ruleForm.cmd" placeholder="输入需要运行的命令"></el-input>
              </el-form-item>
            </el-row>
          </el-collapse-item>
        </el-collapse>
        <br/><br/>
      </el-tab-pane>
      <el-tab-pane label="json模式" name="jsonModel">
        <div class="" v-if="showCodeMirror">
          <codemirror
            :code="showForm"
            :options="editorOptions">
          </codemirror>
        </div>
        <br/><br/>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">更新应用</el-button>
      <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
  import * as nodeType from '@/store/node/mutations_types'
  import * as mutationsType from '@/store/clusters/mutations_types'
  import * as userTypes from '../../store/user/mutations_types'
  import * as appgroupTypes from '@/store/appgroups/mutations_types'
  import * as appTypes from '@/store/app/mutations_types'
  import HealthCheck from '@/common/model/HealthCheck'
  import { mapState } from 'vuex'
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/keymap/sublime'
  import * as defaultOptions from '@/common/defaultConfig'
  import { Notification } from 'element-ui'
  export default {
    components: {
      codemirror
    },
    data () {
      return {
        editorOptions: defaultOptions.editorOptions,
        ruleForm: defaultOptions.ruleForm,
        activeName: 'formModel',
        rules: defaultOptions.formRule,
        resultForm: defaultOptions.resultForm,
        showCodeMirror: false
      }
    },
    computed: {
      ...mapState({
        node ({node}) {
          return node.nodes.nodes
        },
        nodeTotal ({node}) {
          return node.nodes.total
        },
        mutation ({clusters}) {
          return clusters.clusters
        },
        mutationTotal ({clusters}) {
          return clusters.total
        },
        repos (state) {
          return state.user.repos.repos
        },
        appgroups ({appgroups}) {
          return appgroups.arr
        }
      }),
      filterApps: function () {
        // 从已有数组中返回元素
        return this.apps.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
      },
      showForm: {
        get () {
          let F2 = this.transForm()
          return JSON.stringify(F2, null, 2)
        },
        set (newValue) {
          console.log('***********************' + newValue)
          this.resultForm = JSON.parse(newValue)
          this.ruleForm.appId = this.resultForm.id && this.resultForm.id.indexOf('/') > -1 ? this.resultForm.id.split('/')[1] : this.resultForm.appId
          this.ruleForm.group = this.resultForm.id && this.resultForm.id.indexOf('/') > -1 ? this.resultForm.id.split('/')[0] : null// 待修改
        }
      }
    },
    methods: {
      handleClick (tab, event) {
        this.showCodeMirror = true
        // console.log(tab, event)
      },
      networkChange () {
        this.removeAllPorts()
        if (this.ruleForm.network === 'BRIDGE') {
          this.ruleForm.dockerProportion = false
        } else if (this.ruleForm.network === 'HOST') {
          this.ruleForm.dockerProportion = true
        }
      },
      addPorts () {
        this.ruleForm.ports.push({
          containerPort: '1',
          protocol: 'tcp'
        })
      },
      removePorts (item) {
        let index = this.ruleForm.ports.indexOf(item)
        if (index > -1) {
          this.ruleForm.ports.splice(index, 1)
        }
      },
      removeAllPorts () {
        this.ruleForm.ports = []
      },
      addMount () {
        this.ruleForm.mounts.push({
          containerPath: '',
          hostPath: '',
          mode: 'RO' // RW
        })
      },
      removeMount (item) {
        let index = this.ruleForm.mounts.indexOf(item)
        if (index > -1) {
          this.ruleForm.mounts.splice(index, 1)
        }
      },
      addEnvironmentVariable () {
        this.ruleForm.environmentVariables.push({
          key: '',
          value: ''
        })
      },
      removeEnvironmentVariable (item) {
        let index = this.ruleForm.environmentVariables.indexOf(item)
        if (index > -1) {
          this.ruleForm.environmentVariables.splice(index, 1)
        }
      },
      addHealth () {
        this.ruleForm.health.push({
          protocol: 'HTTP',
          gracePeriodSeconds: null,
          intervalSeconds: null,
          timeoutSeconds: null,
          maxConsecutiveFailures: '',
          portType: undefined,
          port: undefined,
          protNumCode: false, // “端口号”的input元素是否显示
          portNumOrPortIndexText: '端口组索引', // 存放“端口号”或“端口组索引”文字
          portIndexCode: true, // “端口组索引”的input元素是否显示
          portIndex: undefined,  // 用于存放选择“端口组索引”后的端口组索引
          path: '', // 用于存放选择http协议后的“http路径input元素的值”
          ignoreHttp1xx: false, // “忽略http返回码”的checkbox是否被选中
          healthHttpCheckBoxCode: true, // 选择http协议后表格第一行“路径”标题是否显示
          healthHttpPathCode: true, // 选择http协议后表格第二行“路径”的input元素是否显示
          healthHttpPathText: true // 选择http协议后表格第三行“忽略http返回码”的checkbox元素是否显示
          // healthHttpCheckBoxCode,healthHttpPathCode,healthHttpPathText
        })
      },
      removeHealth (item) {
        let index = this.ruleForm.health.indexOf(item)
        if (index > -1) {
          this.ruleForm.health.splice(index, 1)
        }
      },
      addDockerPar () {
        this.ruleForm.dockerPar.push({
          key: '',
          value: ''
        })
      },
      removeDockerPar (item) {
        let index = this.ruleForm.dockerPar.indexOf(item)
        if (index > -1) {
          this.ruleForm.dockerPar.splice(index, 1)
        }
      },
      healthProtocolChange (item) {
        let index = this.ruleForm.health.indexOf(item)
        //  如果选中的option为http
        if (this.ruleForm.health[index].protocol === 'HTTP') {
          if (index > -1) {
            this.ruleForm.health[index].healthHttpCheckBoxCode = true
            this.ruleForm.health[index].healthHttpPathCode = true
            this.ruleForm.health[index].healthHttpPathText = true
            // healthHttpCheckBoxCode,healthHttpPathCode,healthHttpPathText
          }
        } else if (this.ruleForm.health[index].protocol === 'TCP') {
          if (index > -1) {
            this.ruleForm.health[index].healthHttpCheckBoxCode = false
            this.ruleForm.health[index].healthHttpPathCode = false
            this.ruleForm.health[index].healthHttpPathText = false
            this.ruleForm.health[index].ignoreHttp1xx = false
          }
        }
      },
      healthPortTypeChange (item) {
        let index = this.ruleForm.health.indexOf(item)
        // 如果选中了端口类型为“端口组索引”
        if (this.ruleForm.health[index].portType === '1') {
          if (index > -1) {
            this.ruleForm.health[index].port = undefined // 清空之前填写的端口号
            this.ruleForm.health[index].protNumCode = false // “端口号”的input元素隐藏
            this.ruleForm.health[index].portNumOrPortIndexText = '端口组索引'// 文字显示为端口组索引
            this.ruleForm.health[index].portIndexCode = true // “端口组索引”的input元素显示
            this.ruleForm.health[index].portIndex = undefined//  清空之前填写的“端口组索引”
          }
        } else {
          if (index > -1) {
            this.ruleForm.health[index].port = undefined // 清空之前填写的端口号
            this.ruleForm.health[index].protNumCode = true // “端口号”的input元素显示
            this.ruleForm.health[index].portNumOrPortIndexText = '端口号'// 文字显示为端口组索引
            this.ruleForm.health[index].portIndexCode = false // “端口组索引”的input元素隐藏
            this.ruleForm.health[index].portIndex = undefined//  清空之前填写的“端口组索引”
          }
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.transForm()
            console.log('success submit!' + JSON.stringify(this.resultForm))
            let router = this.$router
            this.$store.dispatch(appTypes.UPDATE_APP, {
              'aid': window.btoa(this.$route.query.aid),
              'params': this.resultForm
            }).then(data => {
//              console.log('***************************返回结果' + JSON.stringify(data))
              if (data.resultCode === '00') {
                this.$message({
                  type: 'success',
                  message: '更新应用成功!'
                })
                router.push({name: '我的应用'})
              } else {
                Notification({
                  title: '更新应用出错',
                  message: JSON.stringify(data.message),
                  type: 'error'
                })
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      transForm () {
        let F2 = this.resultForm
        let F1 = this.ruleForm
        let container = F2.container
        let docker = container.docker
        let constraints = F2.constraints = []
        let healths = F2.healthChecks = []
        F2.id = F1.group != null ? (F1.group + '/' + F1.name) : F1.name
        F2.cmd = F1.cmd
        F2.cpus = F1.cpus
        F2.mem = F1.memory
        F2.disk = F1.hardDrive
        F2.instances = F1.dockerNum
        if (F1.vcluster) {
          constraints.push(['vcluster', 'LIKE', F1.vcluster])
        }
        if (F1.dockerProportion) {
          constraints.push(['hostname', 'UNIQUE'])
        }
        if (F1.master) {
          constraints.push(['hostname', 'LIKE', F1.master])
        }
        if (F1.image != null) {
          docker.image = F1.image
        }
        if (F1.dockerPar != null && F1.dockerPar.length > 0) {
          docker.parameters = F1.dockerPar
        }
        docker.network = F1.network
        if (docker.network === 'BRIDGE') {
          docker.portMappings = F1.ports
        } else {
          docker.portMappings = []
        }

        docker.forcePullImage = F1.force
        F2.env = {}
        if (F1.f5Pool != null) {
          F2.env.F5_POOL_NAME = F1.f5Pool
        }
        if (F1.environmentVariables.length > 0) {
          for (let obj of F1.environmentVariables) {
            F2.env[obj.key] = obj.value
          }
        }
        if (F1.mounts != null && F1.mounts.length > 0) {
          container.volumes = F1.mounts
        }
        if (F1.health != null && F1.health.length > 0) {
//            F2.healthChecks = F1.health
          for (let item of F1.health) {
            healths.push(new HealthCheck(item.protocol, item.path, item.gracePeriodSeconds, item.intervalSeconds, item.timeoutSeconds, item.maxConsecutiveFailures, item.port, item.portIndex, item.ignoreHttp1xx))
          }
//            F2.healthChecks = healths
        }
        if (F1.cmd != null) {
          F2.cmd = F1.cmd
        }
        return F2
      },
      // resetForm (formName) {
      //   this.$refs[formName].resetFields()
      // },
      mainRender (appModel) {
        // 封装应用模版信息进行显示
        let F1 = this.ruleForm = {
          name: undefined,
          image: undefined,
          force: false,
          base: undefined,
          baseOption: [],
          vcluster: undefined,
          master: undefined,
          group: undefined,
          network: 'BRIDGE',
          cpus: 0,
          memory: 0,
          hardDrive: 0,
          dockerNum: undefined,
          dockerProportion: false,
          f5Pool: undefined,
//          procedureMount: '',
          ports: [],
          mounts: [],
          environmentVariables: [],
          health: [],
          cmd: undefined,
          dockerPar: []
        }
        F1.name = appModel.id.split('/')[2] // 名称
        F1.group = appModel.id.split('/')[1]
        F1.image = appModel.container.docker.image // 镜像
        F1.force = appModel.container.docker.forcePullImage // 强制拉取镜像
        // 仓库认证
        F1.vcluster = appModel.constraints[0][2] // 选择的集群
        F1.network = appModel.container.docker.network  // 网络模式
        F1.cpus = appModel.cpus // cpu
        F1.memory = appModel.mem // 内存
        F1.disk = appModel.disk // 硬盘
        F1.dockerNum = appModel.instances // 容器个数
        for (let constraint of appModel.constraints) {
          if (constraint[0].toUpperCase() === 'UNIQUE') {
            F1.dockerProportion = true
            F1.dockerProportionDefault = true
          } else if (constraint[0].toUpperCase() === 'HOSTNAME') {
            F1.master = constraint[2]
          }
        }
        F1.f5Pool = appModel.env['F5_POOL_NAME']// F5 Pool 名称
        F1.procedureMount = appModel.labels['PACKAGE_VOLUME']// 程序包挂载点
        F1.cmd = appModel.cmd // CMD命令
        //  自定义端口号
        if (appModel.container.docker.portMappings && appModel.container.docker.portMappings.length > 0) {
          for (let v of appModel.container.docker.portMappings) {
            F1.ports.push({containerPort: v.containerPort, protocol: v.protocol})
          }
        }
        // 挂载目录
        if (appModel.container.volumes.length > 0) {
          for (let v of appModel.container.volumes) {
            F1.mounts.push({containerPath: v.containerPath, hostPath: v.hostPath, mode: v.mode})
          }
        }
        // 健康检查
        if (appModel.healthChecks && Array.isArray(appModel.healthChecks) && appModel.healthChecks.length > 0) {
          for (let v of appModel.healthChecks) {
            let health = {
              gracePeriodSeconds: v.gracePeriodSeconds, // 宽限时间
              protocol: v.protocol, // 协议
              intervalSeconds: v.intervalSeconds, // 检查间隔
              timeoutSeconds: v.timeoutSeconds, // 检查超时
              maxConsecutiveFailures: v.maxConsecutiveFailures // 最大失败次数
            }
            if (v.protocol === 'HTTP') {
              health.path = v.path // 选择http协议后的路径
              health.ignoreHttp1xx = v.ignoreHttp1xx // 是否选中了忽略http返回码
              health.healthHttpPathText = true// 选择http协议后表格第一行“路径”标题
              health.healthHttpPathCode = true // 选择http协议后显示表格第二行“路径”
              health.healthHttpCheckBoxCode = true// 选择http协议后显示表格第三行“忽略http返回码”的checkbox元素
            }
            if (v.hasOwnProperty('ifPortIndex')) { // 选中了端口组索引后
              health.portType = '端口组索引' // 选中端口组索引
              health.portIndex = v.portIndex// 端口组索引的值
              health.port = '' // 清空之端口号
              health.protNumCode = false // “端口号”的input元素隐藏
              health.portNumOrPortIndexText = '端口组索引'// 文字显示为端口组索引
              health.portIndexCode = true // “端口组索引”的input元素显示
            } else {
              health.portType = '端口号' // 选中端口号
              health.port = v.port // 端口号的值
              health.protNumCode = true // “端口号”的input元素显示
              health.portNumOrPortIndexText = '端口号'// 文字显示为端口组索引
              health.portIndexCode = false // “端口组索引”的input元素隐藏
              health.portIndex = ''//  清空“端口组索引”
            }
            F1.health.push(health)
          }
        }

        // 自定义环境变量
        for (let v in appModel.env) {
          if (v === 'F5_POOL_NAME') {
            F1.f5Pool = appModel.env[v]
            continue
          }
          F1.environmentVariables.push({key: v, value: appModel.env[v]})
        }
        // 自定义Docker变量
        for (let v of appModel.container.docker.parameters) {
//          if (v['key'] === 'label') {
//            continue
//          }
          F1.dockerPar.push({key: v['key'], value: v['value']})
        }
        this.ruleForm = F1
      }
    },
    filters: {
      replaceSprit (value) {
        return value.replace('/', '')
      }
    },
    mounted () { // 页面加载完成后回调
      // 查询镜像仓库
      this.$store.dispatch(userTypes.FETCH_REPOS, {})
      // 查询集群
      this.$store.dispatch(nodeType.FETCH_ALL_NODE, {})
      // 查询主机
      this.$store.dispatch(mutationsType.FETCH_CLUSTERS, {})
      this.$store.dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
      this.$store.dispatch(appTypes.GET_APP, window.btoa(this.$route.query.aid)).then((data) => {
        if (data.resultCode === '00') {
          this.mainRender(data.data.app)
        }
      })
    }
  }
</script>
<style scoped>
  .formChild {
    display: block;
    float: left;
    height: 30px;
    line-height: 30px;
  }

  .ports .el-form-item {
    margin-top: 20px;
  }

  .ports .el-form-item:first-child {
    margin-top: 0px;
  }

  .height-30 {
    height: 36px;
    line-height: 33px;
    box-sizing: border-box;
    padding-top: 2px;
    display: table-cell;
  }

  .min-width {
    min-width: 130px;
  }

  .margin-bottom {
    margin-bottom: 22px;
  }

  .table-cell {
    margin-left: 3px;
    float: left;
    /*display: table-cell;
    min-width: 130px;*/
  }

  .hidden {
    visibility: hidden;
  }

  .label {
    text-align: center;
  }

  .margin-top {
    margin-top: 10px;
  }
</style>
