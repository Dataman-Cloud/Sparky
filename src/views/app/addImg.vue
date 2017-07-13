<template>

  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="表单模式" name="formModel">

        <el-form-item label="应用id" prop="name" style="width: 400px;">
          <el-input v-model="ruleForm.name"></el-input>
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
          <el-select v-model="ruleForm.vcluster" placeholder="请选择集群">
            <el-option v-for="item in this.mutation.clusters" :label="item.vClusterLabel" :key="item.vClusterLabel"
                       :value="item.vClusterLabel"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择主机" prop="master">
          <el-select v-model="ruleForm.master" placeholder="请选择主机">
            <el-option v-for="item in this.node" :label="item.hostName" :value="item.hostName"
                       :key="item.hostName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用组" prop="group">
          <el-select v-model="ruleForm.group" placeholder="请选择应用组">
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
          <table>
            <tr>
              <th style="padding-bottom: 10px;"><label>CPUs</label></th>
              <th>
                <el-input-number v-model="ruleForm.cpus" size="small" :min="0.01" :step="0.01"></el-input-number>
              </th>
              <th style="padding-bottom: 10px;"><label>{{ruleForm.cpus}}</label></th>

              <th style="padding-bottom: 11px;"><label>内存</label></th>
              <th>
                <el-input-number v-model="ruleForm.memory" size="small" :min="16" :step="1"></el-input-number>
              </th>
              <th style="padding-bottom: 11px;"><label>{{ruleForm.memory}}MB</label></th>

              <th style="padding-bottom: 11px;"><label>硬盘</label></th>
              <th>
                <el-input-number v-model="ruleForm.hardDrive" size="small" :min="0" :step="1"></el-input-number>
              </th>
              <th style="padding-bottom: 11px;"><label>{{ruleForm.hardDrive}}MB</label></th>
            </tr>
          </table>


        </el-form-item>
        <el-form-item label="容器个数" prop="dockerNum"
                      :rules="[
      { required: true, message: '容器不能为空'},
      { type: 'number', message: '容器必须为数字值'}
    ]"
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
            <a v-show="ruleForm.network==='BRIDGE'" @click="addPorts">添加端口<a class="el-icon-plus"
                                                                             style="cursor:pointer;"></a></a>
            <br v-show="ruleForm.network==='BRIDGE'"/>
            <!--<el-button @click="addPorts">添加端口</el-button><br/>-->
            <el-form-item v-show="ruleForm.network==='BRIDGE'"
                          v-for="(port, index) in ruleForm.ports" :key="index" class="margin-left-100">
              <table>
                <tr>
                  <th>
                    <el-input v-model="port.containerPort" placeholder="端口号" size="small" style="width: 120px; padding-bottom: 16px;" ></el-input>
                  </th>
                  <th style="padding-bottom: 16px;">
                    <el-select v-model="port.protocol" placeholder="" size="small" style="width:100px;">
                      <el-option label="tcp" value="tcp"></el-option>
                      <el-option label="udp" value="udp"></el-option>
                    </el-select>
                  </th>
                  <th style="padding-bottom: 16px;">
                    <el-button @click.prevent="removePorts(port)" size="small">删除</el-button>
                  </th>
                </tr>
              </table>
            </el-form-item>

            <!--<el-button @click="addMount">添加挂载目录</el-button><br/>-->
            <a @click="addMount">挂载目录<a class="el-icon-plus cursor-pointer"></a></a><br/>
            <el-form-item
              v-for="(mount, index) in ruleForm.mounts" :key="index" class="margin-left-100">
              <el-input v-model="mount.containerPath" placeholder="容器路径" size="small" style="width: 300px;"></el-input>
              <el-input v-model="mount.hostPath" placeholder="主机路径" size="small" style="width: 300px;"></el-input>
              <el-select v-model="mount.mode" size="small" style="width: 100px;">
                <el-option label="只读" value="RO"></el-option>
                <el-option label="读写" value="RW"></el-option>
              </el-select>
              <el-button @click.prevent="removeMount(mount)" size="small">删除</el-button>
            </el-form-item>


            <!--<el-button @click="addHealth">添加健康检查</el-button>-->
            <a @click="addHealth">健康检查<a class="el-icon-plus" style="cursor:pointer;"></a></a><br/>
            <el-form-item
              v-for="(h, index) in ruleForm.health" style="margin-left: -100px;" :key="index">

              <table>
                <tr style="height: 20px;">
                  <th>协议</th>
                  <th v-if="h.healthHttpPathText" :id="'healthHttpPathText' + index">路径</th>
                  <th>
                    <el-tooltip content="在这一时间段内，健康检查返回的失败结果将被忽略，即允许健康检查失败的时间间隔。" placement="top">
                      <a class="el-icon-information"></a>
                    </el-tooltip>
                    宽限时间（秒）
                  </th>
                  <th>
                    <el-tooltip content="两次健康检查之间的时间间隔。" placement="top">
                      <a class="el-icon-information"></a>
                    </el-tooltip>
                    检查间隔（秒）
                  </th>
                  <th>
                    <el-tooltip content="如果健康检查的返回结果超过这个时间即认为此次健康检查结果为不健康，而无论最终的返回结果是健康或不健康。" placement="top">
                      <a class="el-icon-information"></a>
                    </el-tooltip>
                    检查超时（秒）
                  </th>
                  <th>
                    <el-tooltip content="设置该参数后，如果一个实例的健康检查连续不健康的次数达到该参数，该实例将被停止。但如果该参数设为0，健康检查获取不健康返回时并不会停止实例。"
                                placement="top">
                      <a class="el-icon-information"></a>
                    </el-tooltip>
                    最多持续失败次数
                  </th>
                  <th>端口类型</th>
                  <th>{{h.portNumOrPortIndexText}}</th>
                  <th></th>
                </tr>
                <tr style="height: 30px;">
                  <th style="padding-bottom: 16px;">
                    <el-select @change="healthProtocolChange(h)" v-model="h.protocol" size="small"
                               style="width: 100px;">
                      <el-option label="HTTP" value="HTTP"></el-option>
                      <el-option label="TCP" value="TCP"></el-option>
                    </el-select>
                  </th>
                  <th v-if="h.healthHttpPathCode" :id="'healthHttpPathCode' + index" style="padding-bottom: 16px;">
                    <el-input v-model="h.path" placeholder="" size="small" style="width: 120px;"></el-input>
                  </th>
                  <th style="padding-bottom: 16px;">
                    <el-input-number v-model="h.gracePeriodSeconds" size="small" :min="0" :step="1"></el-input-number>
                  </th>
                  <th style="padding-bottom: 16px;">
                    <el-input-number v-model="h.intervalSeconds" size="small" :min="0" :step="1"></el-input-number>
                  </th>
                  <th style="padding-bottom: 16px;">
                    <el-input-number v-model="h.timeoutSeconds" size="small" :min="0" :step="1"></el-input-number>
                  </th>
                  <th style="padding-bottom: 16px;">
                    <el-input-number v-model="h.maxConsecutiveFailures" size="small" :min="0"
                                     :step="1"></el-input-number>
                  </th>
                  <th style="padding-bottom: 16px;">
                    <el-select @change="healthPortTypeChange(h)" v-model="h.portType" size="small"
                               style="width: 100px;">
                      <el-option label="端口组索引" value="1"></el-option>
                      <el-option label="端口号" value="2"></el-option>
                    </el-select>
                  </th>
                  <th>
                    <el-input id="protNum" v-if="h.protNumCode" v-model="h.port" property="端口号" size="small" style="width: 120px; padding-bottom: 16px;" ></el-input>
                    <el-input id="protIndex" v-if="h.portIndexCode" v-model="h.portIndex" property="端口组索引" size="small" style="width: 120px; padding-bottom: 16px;" ></el-input>
                  </th>
                  <th style="padding-bottom: 16px;">
                    <el-button @click.prevent="removeHealth(h)" size="small">删除</el-button>
                  </th>
                </tr>
                <tr>
                  <th v-if="h.healthHttpCheckBoxCode" colspan="2" :id="'healthHttpCheckBoxCode' + index" style="">
                    <el-checkbox label="忽略HTTP返回码100~199" v-model="h.ignoreHttp1xx"></el-checkbox>
                  </th>
                  <!--
                   <th></th>
                   <th></th>
                   <th></th>
                   <th></th>
                   <th></th>
                   <th></th>
                   <th></th>
                   <th></th>
                   -->
                </tr>
              </table>
            </el-form-item>

            <!--<el-button @click="addEnvironmentVariable">添加自定义环境变量</el-button><br/>-->
            <a @click="addEnvironmentVariable">自定义环境变量<a class="el-icon-plus  cursor-pointer"></a></a><br/>
            <el-form-item
              v-for="(ev, index) in ruleForm.environmentVariables" class="margin-left-100" :key="index">
              <el-input v-model="ev.key" placeholder="key" size="small" style="width: 300px;"></el-input>
              <el-input v-model="ev.value" placeholder="value" size="small" style="width: 300px;"></el-input>
              <el-button @click.prevent="removeEnvironmentVariable(ev)" size="small">删除</el-button>
            </el-form-item>

            <!--<el-button @click="addDockerPar">添加自定义Docker参数</el-button><br/>-->
            <a @click="addDockerPar">自定义Docker参数<a class="el-icon-plus cursor-pointer"></a></a>
            <el-form-item
              v-for="(dp, index) in ruleForm.dockerPar" class="margin-left-100" :key="index">
              <el-input v-model="dp.key" placeholder="key" size="small" style="width: 300px;"></el-input>
              <el-input v-model="dp.value" placeholder="value" size="small" style="width: 300px;"></el-input>
              <el-button @click.prevent="removeDockerPar(dp)" size="small">删除</el-button>
            </el-form-item>


            <el-form-item label="CMD" :rules="rules" style="width: 400px;">
              <el-input v-model="ruleForm.cmd" placeholder="输入需要运行的命令"></el-input>
            </el-form-item>

          </el-collapse-item>
        </el-collapse>
        <br/><br/>

      </el-tab-pane>

      <el-tab-pane label="json模式" name="jsonModel">
        <div class="" v-if="showForm">
          <codemirror v-model="showForm" class="codemirror">
          </codemirror>
        </div>
        <!-- <el-form-item class="jsonText">
          <el-input
            type="textarea"
            :autosize="{ minRows: 10}"
            v-model="showForm">
          </el-input>
        </el-form-item> -->

      </el-tab-pane>
    </el-tabs>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
    </el-form-item>

  </el-form>
</template>
<script>
  import * as nodeType from '../../store/node/mutations_types'
  import * as mutationsType from '../../store/clusters/mutations_types'
  import * as appgroupTypes from '../../store/appgroups/mutations_types'
  import * as userTypes from '../../store/user/mutations_types'
  import * as appTypes from '../../store/app/mutations_types'
  import Image from '@/common/model/Image'
  import Container from '@/common/model/Container'
  import Docker from '@/common/model/Docker'
  import HealthCheck from '@/common/model/HealthCheck'
  import { mapState } from 'vuex'
  import * as editorOptions from '@/common/defaultConfig'
  import Codemirror from '@/components/jsonEditor/index'
  import { Notification } from 'element-ui'

  export default {
    components: {
      Codemirror
    },
    data () {
      return {
        editorOptions: editorOptions.editorOptions,
        ruleForm: {
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
        },
        activeName: 'formModel',
        rules: {
          name: [
            {required: true, message: '请输入应用id', trigger: 'blur'},
            {pattern: /^[a-z0-9-]+$/, message: '应用id只能包含小写字母、数字及中划线', trigger: 'blur'}
          ],
          desc: [],
          image: [
            {required: true, message: '请输入镜像地址', trigger: 'blur'}
          ],
          vcluster: [
            {required: true, message: '请选择集群', trigger: 'change'}
          ],
          group: [
            {required: true, message: '请选择应用组', trigger: 'change'}
          ],
          network: [
            {required: true, message: '请选择网络模式 ', trigger: 'change'}
          ],
          norms: [],
//          dockerNum: [
//            {required: true, message: '请输入主机个数', trigger: 'blur'},
//            {type: 'number', message: '主机个数必须为数字值'}
//          ],
          procedureMount: [
            {required: true, message: '请输入程序包挂载点', trigger: 'blur'}
          ]
        },
        resultForm: new Image(
          undefined,
          undefined,
          0.01,
          5,
          0,
          undefined,
          undefined,
          [],
          new Container(new Docker(undefined, 'BRIDGE', false, undefined, [], []), undefined, undefined),
          {},
          undefined,
          undefined,
          [],
          undefined,
          undefined)
      }
    },
    computed: {
      ...mapState({
        node (state) {
          return state.node.nodes.nodes
        },
        nodeTotal (state) {
          return state.node.nodes.total
        },
        mutation (state) {
          console.log(JSON.stringify(state.clusters.clusters))
          return state.clusters.clusters
        },
        repos (state) {
          return state.user.repos.repos
        },
        mutationTotal (state) {
          return state.clusters.total
        },
        appgroups (state) {
          return state.appgroups.arr
        }
      }),
      filterApps: function () {
        // 从已有数组中返回元素
        return this.apps.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
      },
      showForm: {
        get () {
          console.log('from herererere')
          let F2 = this.resultForm
          let F1 = this.ruleForm
          let container = this.resultForm.container
          let docker = container.docker
          // this.resultForm.constraints = []
          // this.resultForm.healthChecks = []
          let constraints = this.resultForm.constraints = []
          let healths = this.resultForm.healthChecks = []
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
            container.volumes = this.ruleForm.mounts
          }
          if (F1.health != null && F1.health.length > 0) {
//            this.resultForm.healthChecks = this.ruleForm.health
            for (let item of F1.health) {
              healths.push(new HealthCheck(item.protocol, item.path, item.gracePeriodSeconds, item.intervalSeconds, item.timeoutSeconds, item.maxConsecutiveFailures, item.port, item.portIndex, item.ignoreHttp1xx))
            }
//            this.resultForm.healthChecks = healths
          }
          if (F1.cmd != null) {
            F2.cmd = this.ruleForm.cmd
          }
          return F2
        },
        set (newValue) {
//          console.log('***********************' + newValue)
//          this.resultForm = JSON.parse(newValue)
//          this.ruleForm.appId = this.resultForm.id.contains('/') ? this.resultForm.split('/')[1] : this.resultForm.appId
//          this.ruleForm.group = this.resultForm.id.contains('/') ? this.resultForm.split('/')[0] : null// 待修改
        }
      }
    },
    methods: {
      handleClick (tab, event) {
        console.log(tab, event)
      },
      networkChange () {
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
        if (index !== -1) {
          this.ruleForm.ports.splice(index, 1)
        }
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
        if (index !== -1) {
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
        if (index !== -1) {
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
        if (index !== -1) {
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
        if (index !== -1) {
          this.ruleForm.dockerPar.splice(index, 1)
        }
      },
      healthProtocolChange (item) {
        let index = this.ruleForm.health.indexOf(item)
        //  如果选中的option为http
        if (this.ruleForm.health[index].protocol === 'HTTP') {
          if (index !== -1) {
            this.ruleForm.health[index].healthHttpCheckBoxCode = true
            this.ruleForm.health[index].healthHttpPathCode = true
            this.ruleForm.health[index].healthHttpPathText = true
            // healthHttpCheckBoxCode,healthHttpPathCode,healthHttpPathText
          }
        } else if (this.ruleForm.health[index].protocol === 'TCP') {
          if (index !== -1) {
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
          if (index !== -1) {
            this.ruleForm.health[index].port = undefined // 清空之前填写的端口号
            this.ruleForm.health[index].protNumCode = false // “端口号”的input元素隐藏
            this.ruleForm.health[index].portNumOrPortIndexText = '端口组索引'// 文字显示为端口组索引
            this.ruleForm.health[index].portIndexCode = true // “端口组索引”的input元素显示
            this.ruleForm.health[index].portIndex = undefined//  清空之前填写的“端口组索引”
          }
        } else {
          if (index !== -1) {
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
            let router = this.$router
            this.$store.dispatch(appTypes.ADD_APP, this.resultForm).then((data) => {
              if (data.resultCode === '00') {
                this.$message({
                  type: 'success',
                  message: '创建应用成功!'
                })
                router.push({name: '全部的应用'})
              } else {
                Notification({
                  title: '创建应用出错',
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
      resetForm (formName) {
        this.$refs[formName].resetFields()
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
      // 查询主机
      this.$store.dispatch(nodeType.FETCH_ALL_NODE, {})
      // 查询集群
      this.$store.dispatch(mutationsType.FETCH_CLUSTERS, {})
      // 查询应用组
      this.$store.dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
      console.log(this.mutation)
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

  .jsonText {
    /*background-color: black;*/
    /*color:white;*/
    margin-bottom: 20px;
  }

  .jsonText .el-textarea {
    background-color: black;
    color: white;
  }
</style>
