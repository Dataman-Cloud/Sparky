<template>
  <div>
    <!-- 正常添加或修改模版的表单 -->
    <el-form :model="ruleForm" v-if="!catalogStackCreateForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :label-position="labelPosition">
      <div v-if="catalogStackCreate" style="background: #F9FAFC; padding: 10px 0; border-radius: 15px;">
        <el-form-item label="模板名称"  prop="name" style="width: 400px;" >
          <el-input v-model="ruleForm.name" v-bind:disabled="catalogStackCreate"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" min-width="70" sortable v-if="catalogStackCreate">
          {{ruleForm.createdTime | moment("YYYY/MM/DD HH:mm:ss")}}
        </el-form-item>
        <el-form-item label="描述" prop="desc" style="width:800px;">
          <el-input type="textarea" v-model="ruleForm.desc" v-bind:disabled="catalogStackCreate"></el-input>
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="模板名称"  prop="name" style="width: 400px;" >
          <el-input v-model="ruleForm.name" v-bind:disabled="catalogStackCreate"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" min-width="70" sortable v-if="catalogStackCreate">
          {{ruleForm.createdTime | moment("YYYY/MM/DD HH:mm:ss")}}
        </el-form-item>
        <el-form-item label="描述" prop="desc" style="width:800px;">
          <el-input type="textarea" v-model="ruleForm.desc" v-bind:disabled="catalogStackCreate" :maxlength="255" placeholder="最多输入255个字符"></el-input>
        </el-form-item>
      </div>
    <base-form :isEdit='false' :ruleForm="ruleForm">
      <el-form-item label="程序包挂载" prop="procedureMount" style="width: 400px;" slot="mount">
        <el-input v-model="ruleForm.procedureMount" placeholder="容器路径"></el-input>
      </el-form-item>
    </base-form>
    <el-form-item>
      <el-button type="primary" @click="cancelForm('ruleForm')" v-if="!catalogStackCreate">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')" v-if="!catalogStackCreate">{{updateOrCreate}}</el-button>
      <el-button type="primary" @click="cancelForm" v-if="catalogStackCreate">上一步</el-button>
      <el-button type="primary" @click="cscFormController" v-if="catalogStackCreate">下一步</el-button>
      <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
    </el-form-item>
      </el-form>

    <el-form :model="cscForm" v-if="catalogStackCreateForm" :rules="cscFormRules" ref="cscForm" label-width="100px" class="demo-ruleForm">
      <div style="background: #EFF2F7; padding: 10px 0; border-radius: 15px;">
      <el-form-item label="模板名称" style="width: 400px;" >
        <el-input v-model="ruleForm.name" v-bind:disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" min-width="70" sortable>
        {{ruleForm.createdTime | moment("YYYY/MM/DD HH:mm:ss")}}
      </el-form-item>
      <el-form-item label="描述" style="width:800px;">
        <el-input type="textarea" v-model="ruleForm.desc" v-bind:disabled="true" ></el-input>
      </el-form-item><!-- -->
      </div>
      <el-form-item label="应用组" prop="appsGroup"  >
        <el-select v-model="cscForm.appsGroup" v-bind:disabled="cscForm.success" placeholder="请选择应用组" >
          <el-option v-for="item in selfAppGroups" :label="item.id.replace('/','')" :value="item.id.replace('/','')" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称"  style="width: 400px;" prop="appsName" :rules="[
            {required: true, message: '应用名称', trigger: 'blur'},
            {pattern: /^[a-z0-9-]+$/, message: '名称只能包含小写字母、数字和中划线', trigger: 'blur'}]">
        <el-input v-model="cscForm.appsName" v-bind:disabled="cscForm.success"></el-input>
      </el-form-item>
      <el-form-item label="版本号"  style="width: 400px;" prop="version" >
        <el-input v-model="cscForm.version" v-bind:disabled="cscForm.success"></el-input>
      </el-form-item>
      <el-form-item v-if="!cscForm.success" label="包类型" prop="packageType" required>
        <el-radio-group v-model="cscForm.packageType" >
          <el-radio :label="0" >微服务(.jar)</el-radio>
          <el-radio :label="1" >Dubbo(.jar)</el-radio>
          <el-radio :label="2" >Nginx(.zip)</el-radio>
          <el-radio :label="3" >Tomcat(.war)</el-radio>
          <el-radio :label="4" >WebLogic(.war)</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- :http-request="fileUpload"  -->
      <el-form-item style="width:300px;"  v-if="!cscForm.success" prop="uploadFile1" >
        <el-upload
          class="upload-demo"
          ref="upload"
          name="upload"
          v-bind:action="uploadFileAction"
          :on-remove="handleRemove"
          v-bind:multiple="false"
          v-bind:data="uploadParam"
          v-bind:headers="uploadHeaders"
          :before-upload="beforeAvatarUpload"
          :on-change="uploadChange"
          v-bind:auto-upload="uploadFile">
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
        <span id="fileUploadErr"></span>
      </el-form-item>
      <el-form-item  v-if="!cscForm.success">
        <el-button type="primary" @click="cscFormController" v-if="catalogStackCreate">上一步</el-button>
        <el-button type="primary" @click="cscFormSubmit('cscForm')">发布</el-button>
        <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
      </el-form-item>
      <el-form-item v-show="cscForm.success">
        <el-form-item label="状态" min-width="70" sortable>发布完成</el-form-item>
      </el-form-item>
      <el-form-item v-show="cscForm.success">
        <el-button type="primary" @click="appList" >查看应用列表</el-button>
<!--        <el-button type="primary" @click="appInfo" >查看应用详情</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import baseForm from 'views/app/baseForm.vue'
import * as nodeType from '@/store/node/mutations_types'
import * as mutationsType from '@/store/clusters/mutations_types'
import * as reposType from '@/store/user/mutations_types'
import * as modelType from '@/store/model/mutations_types'
import * as appgroupTypes from '@/store/appgroups/mutations_types'
import * as appType from '@/store/app/mutations_types'
import {mapState, mapActions} from 'vuex'
import AppModel from '@/common/model/AppModel'
import Container from '@/common/model/Container'
import Docker from '@/common/model/Docker'
import { Notification } from 'element-ui'
import store from 'store'
import appConf from '@/common/app'

export default {
  extends: baseForm,
  components: {
    baseForm
  },
  data () {
    return {
      labelPosition: 'left',
      ruleForm: appConf.modelForm(),
      isUploadFile: false, // 文件是否上传标志
      catalogStackCreate: false, // 是否为程序包发布进入
      catalogStackCreateForm: false, // 程序包发布进入后的表单控制
      updateOrCreate: '立即创建', // 创建或更新的文本
      uploadFileAction: window.location.protocol + '/jborg/catalogs/uploadCatalogsStack', // 上传的文件路径
      uploadHeaders: {'Authorization': store.getters.token}, // 上传文件headers信息
      // uploadFileAction: '/jborg/catalogs/uploadCatalogsStack', // 上传的文件路径
      uploadFile: false, // 是否立即上传
      isRole: false, // 是否有更新该模板的权限
      portIndexVal: 0,
      portsLength: 1,
      portsType: '1',
      cscForm: { // 发布程序包的表单
        appsGroup: '',
        appsName: '',
        version: '',
        packageType: 0,
        NEED_HAPROXY: false,
        success: false // 是否发布程序包成功，成功后禁用应用组名称，应用名称，版本号，隐藏：包类型和上传按钮，显示：状态为创建完成，“应用列表”和“查看应用详情”按钮
      },
      cscFormRules: {
        appsName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        version: [
          { required: true, message: '版本号', trigger: 'blur' }
        ],
        appsGroup: [
          { required: true, message: '请选择应用组', trigger: 'change' }
        ]
        /*    uploadFile1: [
              { required: true, message: '请选择上传文件', trigger: 'blue' }
            ]
            packageType: [
              { required: true, message: '请选择包类型', trigger: 'click' }
            ] */
      },
      rules: appConf.modelFormRule()
    }
  },
  computed: {
    ...mapState({
      selfAppGroups (state) {
        return state.appgroups.selfGroups
      },
      uploadPackageFilePath ({ model }) {
        return model.model.uploadPackageFilePath
      },
      getUserInfo ({ user }) {
        return user.aboutme
      },
      getModelInfo (state) {
        return state.model.model.model
      },
      uploadParam () {
        return {
          GroupName: this.cscForm.appsGroup,
          AppName: this.cscForm.appsName,
          Version: this.cscForm.version,
          PackageType: this.getPackageType}
      },
      setObjModelJSON (state) {
        let appModel = JSON.parse(state.model.model.model.json)
        // 封装应用模板信息进行显示
        this.ruleForm.id = state.model.model.model.id // id
        this.ruleForm.name = state.model.model.model.name // 名称
        this.ruleForm.desc = state.model.model.model.desc // 描述
        this.ruleForm.createdTime = state.model.model.model.createdAt // 创建时间
        this.ruleForm.image = appModel.container.docker.image // 镜像
        this.ruleForm.force = appModel.container.docker.forcePullImage // 强制拉取镜像
        // 仓库认证
        this.ruleForm.vcluster = appModel.constraints[0][2] // 选择的集群
        // this.ruleForm.network = appModel.container.docker.network === 'BRIDGE' ? 0 : 1 // 网络模式
        this.ruleForm.network = appModel.container.docker.network // 网络模式
        this.ruleForm.cpus = appModel.cpus // cpu
        this.ruleForm.memory = appModel.mem // 内存
        this.ruleForm.hardDrive = appModel.disk // 硬盘
        this.ruleForm.dockerNum = appModel.instances // 容器个数
        switch (appModel.constraints.length) {
          case 1: // 没有选择集群和1容器：1主机
            break
          case 2: // 集群和1容器：1主机选择了1个
            if (appModel.constraints[1][1] === 'UNIQUE') { // 是否选择了1容器：1主机
              this.ruleForm.dockerProportion = true
              this.ruleForm.dockerProportionDefault = true
              for (var host1 of appModel.constraints[1][2].split('|')) {
                this.ruleForm.master.push(host1)
              }
            } else { // 没有选择1容器：1主机则选择了主机
              this.ruleForm.dockerProportion = false
              this.ruleForm.dockerProportionDefault = true
              // 选择的主机
              for (var host of appModel.constraints[1][2].split('|')) {
                this.ruleForm.master.push(host)
              }
//              this.ruleForm.master = appModel.constraints[1][2]
            }
            break
          case 3: // 集群和1容器：1主机都进行了选择
            //  1容器：1主机
            this.ruleForm.dockerProportion = true
            this.ruleForm.dockerProportionDefault = true
            // 选择的主机
//            this.ruleForm.master = appModel.constraints[2][2]
            for (var host2 of appModel.constraints[2][2].split('|')) {
              this.ruleForm.master.push(host2)
            }
            break
        }
        // this.ruleForm.f5Pool = appModel.env['F5_POOL_NAME']// F5 Pool 名称
        if (appModel.hasOwnProperty('labels')) {
          if (appModel.labels.hasOwnProperty('PACKAGE_VOLUME')) {
            this.ruleForm.procedureMount = appModel.labels['PACKAGE_VOLUME']// 程序包挂载点
          }
          if (appModel.labels.hasOwnProperty('NEED_HAPROXY')) {
            this.ruleForm.NEED_HAPROXY = appModel.labels['NEED_HAPROXY'] // haproxy
          }
        }
        this.ruleForm.cmd = appModel.cmd // CMD命令
        //  自定义端口号
        for (let v of appModel.container.docker.portMappings) {
          this.ruleForm.ports.push({containerPort: v.containerPort, protocol: v.protocol})
        }
        // 挂载目录
        for (let v of appModel.container.volumes) {
          this.ruleForm.mounts.push({containerPath: v.containerPath, hostPath: v.hostPath, mode: v.mode})
        }
        if (appModel.hasOwnProperty('healthChecks')) {
          // 健康检查
          for (let v of appModel.healthChecks) {
            let health = {}
            health.protocol = v.protocol // 协议
            health.gracePeriodSeconds = v.gracePeriodSeconds // 宽限时间
            health.intervalSeconds = v.intervalSeconds// 检查间隔
            health.timeoutSeconds = v.timeoutSeconds// 检查超时
            health.maxConsecutiveFailures = v.maxConsecutiveFailures // 最大失败次数
            if (v.protocol === 'HTTP' || v.protocol === 'MESOS_HTTP') {
              // ---http
              health.path = v.path // 选择http协议后的路径
              health.ignoreHttp1xx = v.ignoreHttp1xx // 是否选中了忽略http返回码
              health.healthHttpPathText = true// 选择http协议后表格第一行“路径”标题
              health.healthHttpPathCode = true // 选择http协议后显示表格第二行“路径”
              health.healthHttpCheckBoxCode = true// 选择http协议后显示表格第三行“忽略http返回码”的checkbox元素
            } else {
              health.ignoreHttp1xx = false
              health.healthHttpPathText = false
              health.healthHttpPathCode = false
              health.healthHttpCheckBoxCode = false
            }
            // ---端口号
            if (v.hasOwnProperty('ifPortIndex') && v.ifPortIndex === 1) { // 选中了端口组索引后
              this.portsType = '1'
              health.portType = '1' // 选中端口组索引
              health.portIndex = v.portIndex// 端口组索引的值
              health.portNum = '' // 清空之端口号
              health.protNumCode = false // “端口号”的input元素隐藏
              health.portNumOrPortIndexText = '端口组索引'// 文字显示为端口组索引
              health.portIndexCode = true // “端口组索引”的input元素显示
            } else {
              this.portsType = '2'
              health.portType = '2' // 选中端口号
              health.port = v.port // 端口号的值
              health.protNumCode = true // “端口号”的input元素显示
              health.portNumOrPortIndexText = '端口号'// 文字显示为端口组索引
              health.portIndexCode = false // “端口组索引”的input元素隐藏
              health.portIndex = ''//  清空“端口组索引”
            }
            this.ruleForm.health.push(health)
          }
          // 自定义环境变量
          let env = {}
          if (appModel.hasOwnProperty('env')) {
            env = appModel.env
          }
          for (let v in env) {
            if (v === 'F5_POOL_NAME') {
              this.ruleForm.f5Pool = appModel.env[v]
              break
            }
            this.ruleForm.environmentVariables.push({key: v, value: appModel.env[v]})
          }
          // 自定义Docker变量
          for (let v of appModel.container.docker.parameters) {
            this.ruleForm.dockerPar.push({key: v['key'], value: v['value']})
          }
        }
      }
    }),
    getObjModelJSON: function () {
      // 集群，主机信息
      let constraints = null
      if (this.ruleForm.dockerProportion === true) { // 是否勾选了1主机:1容器
        if (this.ruleForm.master.length > 0) {
          let host = this.ruleForm.master.toString()

          constraints = [
            ['vcluster', 'LIKE', this.ruleForm.vcluster], // 集群
            ['hostname', 'UNIQUE'],
            ['hostname', 'LIKE', host.replace(/,/g, '|')]  // 主机
          ]
        } else {
          constraints = [
            ['vcluster', 'LIKE', this.ruleForm.vcluster], // 集群
            ['hostname', 'UNIQUE']
          ]
        }
      } else if (this.ruleForm.dockerProportion === false) {
        if (this.ruleForm.master.length > 0) {
          let host = this.ruleForm.master.toString()
          constraints = [
            ['vcluster', 'LIKE', this.ruleForm.vcluster], // 集群
            ['hostname', 'LIKE', host.replace(/,/g, '|')] // 主机
          ]
        } else {
          constraints = [
            ['vcluster', 'LIKE', this.ruleForm.vcluster] // 集群
          ]
        }
      }
      let labels = {}
      labels['NEED_HAPROXY'] = this.ruleForm.NEED_HAPROXY
      labels['PACKAGE_VOLUME'] = this.ruleForm.procedureMount
      // 自定义环境变量
      let env = {}
      for (let v of this.ruleForm.environmentVariables) {
        if (v.key !== '' && v.value !== '') { // 确保不为空的情况
          env[v.key] = v.value
        }
      }
      // 添加F5 Pool 名称
      env['F5_POOL_NAME'] = this.ruleForm.f5Pool
      // 自定义Docker参数
      let parameters = []
      for (let v of this.ruleForm.dockerPar) {
        if (v.key !== '' && v.value !== '') {
          let par = {}
          par['key'] = v.key
          par['value'] = v.value
          parameters.push(par)
        }
      }
      // 自定义端口号
      let portMappings = []
      this.portsLength = this.ruleForm.ports.length === 0 ? 1 : this.ruleForm.ports.length
      for (let v of this.ruleForm.ports) {
        let port = {}
        port['containerPort'] = parseInt(v.containerPort) // 端口号
        port['name'] = null // ''
        port['protocol'] = v.protocol // tcp或udp
        portMappings.push(port)
      }
      // 挂载目录
      let volumes = []
      for (let v of this.ruleForm.mounts) {
        let vol = {}
        vol['containerPath'] = v.containerPath // 容器路径
        vol['hostPath'] = v.hostPath // 主机路径
        vol['mode'] = v.mode // 读写RW或只读RO
        volumes.push(vol)
      }
      // docker和挂载目录
      let cont = new Container(
        new Docker(
          this.ruleForm.image, // 镜像地址
          // this.ruleForm.network === 0 ? 'BRIDGE' : 'HOST', // 网桥模式，HOST模式
          this.ruleForm.network,
          this.ruleForm.force, // 是否强制拉取镜像
          null,
          parameters, // 自定义Docker参数
          portMappings // 自定义端口
        ),
        null,
        volumes
      )
      // 健康检查
      let healthChecks = []
      for (let v of this.ruleForm.health) {
        let heal = {}
        heal['protocol'] = v.protocol // 协议http或tcp
        heal['value'] = ''
        heal['delaySeconds'] = null
        heal['gracePeriodSeconds'] = v.gracePeriodSeconds // 宽限时间
        heal['intervalSeconds'] = v.intervalSeconds// 间隔时间
        heal['portName'] = ''
        heal['timeoutSeconds'] = v.timeoutSeconds// 检查超时
        heal['maxConsecutiveFailures'] = v.maxConsecutiveFailures// 最多持续失败次数
        if (v.protocol === 'HTTP' || v.protocol === 'MESOS_HTTP') {
          heal['ignoreHttp1xx'] = v.ignoreHttp1xx// 选择http协议后是否勾选了忽略http返回码
          heal['path'] = v.path // 选择http协议后填写的路径
        }
        if (v.portType === '1') { // 选择了端口组索引
          heal['ifPortIndex'] = 1
          // 判断转为int
          if (v.portIndex !== '' && v.portIndex !== null) {
            heal['portIndex'] = parseInt(v.portIndex)// 选择端口组索引后的 端口组索引值
            this.portIndexVal = parseInt(v.portIndex)
          }
        } else if (v.portType === '2') { // 选择了端口号
          // 判断转为int
          if (v.port !== '' && v.port !== null) {
            heal['port'] = parseInt(v.port) // 端口号，如选择端口组索引则没有此属性
          }
        }
        healthChecks.push(heal)
      }
      return JSON.stringify(new AppModel(
        this.ruleForm.cpus,
        this.ruleForm.memory,
        this.ruleForm.hardDrive,
        constraints, // 选择的集群，主机信息，1容器：1主机
        cont, // docker,挂载目录
        this.ruleForm.dockerNum, // 健康检查
        healthChecks,
        this.ruleForm.cmd,
        labels,
        env
      ), null, 4)
    },
    getPackageType () {
      let result = ''
      // 添加程序包类型
      switch (this.cscForm.packageType) {
        case 0:
          result = 'micro'
          break
        case 1:
          result = 'dubbo'
          break
        case 2:
          result = 'nginx'
          break
        case 3:
          result = 'tomcat'
          break
        case 4:
          result = 'weblogic'
          break
      }
      return result
    },
    checkModelRole () { // 检查当前登录用户是否有该模板操作的权限
      /* -- 判断权限 -- */
      // 当前登录用户的当前组信息
      let groups = []
      let group = {}
      for (let v of this.getUserInfo.accountGroups) {
        if (this.getUserInfo.currentGroupId === v.groupId) {
          groups.push(v)
        }
      }
      for (let v of groups) { // 取最大的权限
        if (this.getUserInfo.userName === 'admin') { // 超管
          group = {'role': 'superuser'}
          break
        } else if (v.role === 'owner') { // 组管理员
          group = v
          break
        } else if (v.role === 'member') { // 普通组员
          group = v
        }
      }
      // 默认没有权限
      this.isRole = false
      if (group.role === 'superuser') { // 超管有权限
        this.isRole = true
      } else if (group.role === 'owner' && group.groupId === this.getModelInfo.groupId) { // 为该模板的创建组并为组管理员
        this.isRole = true
      } else if (group.role === 'member' && this.getUserInfo.id === this.getModelInfo.accountId) { // 为组员但为该模板的创建者
        this.isRole = true
      } else if (this.getModelInfo.accountsName === 'admin') { // 该模板的创建者为超管
        this.isRole = true
      }
    }
  },
  methods: {
    ...mapActions({
      fetchSelfAppGroups: appgroupTypes.FATCH_SELF_APPGROUP
    }),
    cancelForm: function () {
      this.$router.go(-1)
    },
    resetForm () {
//      this.$refs['ruleForm'].resetFields()
    },
    appList () { // 跳转应用列表
      this.$router.push({path: '/app/list/apps'})
    },
    appInfo () { // 跳转应用详细列表
      this.$router.push({ path: '/app/appInstance/list/' + this.cscForm.appsGroup + '/' + this.cscForm.appsName })
    },
    cscFormSubmit (formName) {
      if (this.isUploadFile) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 提交文件上传
            this.$refs.upload.submit()
          }
        })
      } else {
     //   document.getElementById('fileUploadErr').htmlText('请上传文件')
        this.$message.error('还没有上传文件')
      }
    /*  this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交文件上传
          this.$refs.upload.submit()
        }
      }) */
    },
    handleRemove (file, fileList) {
      this.isUploadFile = false
    },
    // 更改文件时触发，添加文件、上传成功和上传失败时都会被调用
    uploadChange (file, fileList) {
      this.isUploadFile = true
      if (file.status === 'ready') {
        if (fileList.length > 1) {
          this.$message.error('只能上传一个文件')
          this.isUploadFile = false // 没有上传文件
          // 清空已上传的文件列表
          this.$refs.upload.clearFiles()
        }
      } else if (file.status === 'success') {
        if (file.response.resultCode !== '00') {
          this.$message.error('上传失败')
          // 取消上传请求
          this.$refs.upload.abort()
          this.isUploadFile = false // 没有上传文件
          // 清空已上传的文件列表
          this.$refs.upload.clearFiles()
        } else {
            //  上传成功
          /* -----拼装json--------- */
          // 获取json对象
          let appModel = JSON.parse(this.getObjModelJSON)
          // 添加应用组和应用名称
          appModel.id = this.cscForm.appsGroup + '/' + this.cscForm.appsName
          // 合并挂载目录
          let vol = {}
          vol['containerPath'] = appModel.labels.PACKAGE_VOLUME // 容器路径
          vol['hostPath'] = file.response.data // 主机路径
          vol['mode'] = 'RW' // 读写RW或只读RO
          appModel.container.volumes.push(vol)
          // 添加label
          appModel.labels['PACKAGE_VOLUME'] = this.cscForm.appsName
          appModel.labels['CURRENT_VERSION'] = this.cscForm.version
          appModel.labels['DEPLOY_TIMES'] = '1'
          appModel.labels['PACKAGE_TYPE'] = this.getPackageType
          appModel.labels['NEED_HAPROXY'] = this.cscForm.NEED_HAPROXY
          // 创建应用接口
          this.$store.dispatch(appType.ADD_APP, appModel)
            .then((data) => {
              if (data.resultCode === '00') {
                // 更新状态为完成
                this.cscForm.success = true
              } else {
                Notification.error({
                  title: '创建应用出错',
                  message: JSON.stringify(data.message)
                })
                // 取消上传请求
                this.$refs.upload.abort()
                // 清空已上传的文件列表
                this.$refs.upload.clearFiles()
                this.isUploadFile = false // 没有上传文件
              }
            })
        }
      } else if (file.status === 'fail') {
        this.$message.error('上传失败')
        // 取消上传请求
        this.$refs.upload.abort()
        // 清空已上传的文件列表
        this.$refs.upload.clearFiles()
        this.isUploadFile = false // 没有上传文件
      }
    },
    fileUpload (e) { // 上传文件并创建模板
      // 获取json对象
      let appModel = JSON.parse(this.getObjModelJSON)
      let par = {
        file: e.file,
        url: e.action,
        GroupName: this.cscForm.appsGroup,
        AppName: this.cscForm.appsName,
        Version: this.cscForm.version,
        PackageType: this.getPackageType
      }
      this.$store.dispatch(modelType.FETCH_UPLOAD_CATALOGSTACK, par)
        .then(data => {
          if (data.resultCode === '00') {
            // 拼装json
            // 添加应用组和应用名称
            appModel.id = this.cscForm.appsGroup + '/' + this.cscForm.appsName
            // 合并挂载目录
            let vol = {}
            vol['containerPath'] = appModel.labels.PACKAGE_VOLUME // 容器路径
            vol['hostPath'] = this.uploadPackageFilePath // 主机路径
            vol['mode'] = 'RW' // 读写RW或只读RO
            appModel.container.volumes.push(vol)
            // 添加label
            appModel.labels['PACKAGE_VOLUME'] = this.cscForm.appsName
            appModel.labels['CURRENT_VERSION'] = this.cscForm.version
            appModel.labels['DEPLOY_TIMES'] = '1'
            appModel.labels['PACKAGE_TYPE'] = this.getPackageType
            appModel.labels['NEED_HAPROXY'] = this.cscForm.NEED_HAPROXY
//            console.log(appModel)
            //  创建应用接口
            this.$store.dispatch(appType.ADD_APP, appModel)
              .then((data) => {
                if (data.resultCode === '00') {
                  // 更新状态为完成
                  this.cscForm.success = true
                } else {
                  Notification.error({
                    title: '创建应用出错',
                    message: JSON.stringify(data.message)
                  })
                }
              })
          } else {
            Notification.error({
              title: '上传程序包出错',
              message: JSON.stringify(data.message)
            })
          }
        })
    },
    submitForm (formName) { // 更新模板
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let jsonObj = this.getObjModelJSON
          let health = JSON.parse(jsonObj).healthChecks[0]
          // 有健康检查||选择端口号
//          console.log(JSON.stringify(health))
          if (health !== undefined) {
            this.portIndexVal = health.portIndex === undefined ? 0 : health.portIndex
          } else {
            this.portsLength = 1
            this.portIndexVal = 0
          }
//          console.log('portsLength ' + this.portsLength)
//          console.log('portIndexVal ' + this.portIndexVal)
          if (this.portIndexVal < this.portsLength && this.portIndexVal >= 0) {
            if (this.updateOrCreate === '立即更新') {
              //  更新操作
              let modelInfo = {
                'name': this.ruleForm.name,
                'desc': this.ruleForm.desc,
                'json': jsonObj,
                'id': this.ruleForm.id
              }
              this.$store.dispatch(modelType.FETCH_UPDATA_MODEL, {
                modelInfo: modelInfo
              }).then((data) => {
                if (data.resultCode === '00') {
                  // 更新成功
                  this.$message({message: '更新成功', type: 'success'})
                  this.$router.push({path: '/app/list/appsModel'})
                } else {
                  Notification.error({
                    title: '更新模板出錯',
                    message: JSON.stringify(data.message)
                  })
                }
              })
            } else if (this.updateOrCreate === '立即创建') {
              // 创建操作
              this.$store.dispatch(modelType.FETCH_CREATE_MODEL, {
                modelInfo: {'name': this.ruleForm.name, 'json': this.getObjModelJSON, 'desc': this.ruleForm.desc} })
                .then((data) => {
                  if (data.resultCode === '00') {
                    this.$message({message: '创建成功', type: 'success'})
                    // 跳转回列表
                    this.$router.push({path: '/app/list/appsModel'})
                  } else {
                    Notification.error({
                      title: '创建应用模板出错',
                      message: JSON.stringify(data.message)
                    })
                  }
                })
            }
          } else {
            this.$message.error('健康检查配置错误：无效的端口组索引号')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 程序包发布表单控制
    cscFormController () {
      this.isUploadFile = false
      this.getObjModelJSON
      if (this.portsType === '1' && this.portIndexVal < this.portsLength && this.portIndexVal >= 0) {
        if (this.catalogStackCreateForm === false) {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              this.catalogStackCreateForm = true
            }
          })
        } else if (this.catalogStackCreateForm === true) {
          this.catalogStackCreateForm = false
        }
      } else {
        this.$message.error('健康检查配置错误：无效的端口组索引号')
      }
    },
    // 控制上传文件类型
    beforeAvatarUpload (file) {
      this.isUploadFile = true
      let result = true
      // 获取后缀名
      const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      // 获取应上传的后缀名
      switch (this.cscForm.packageType) {
        case 0:
          if (fileType !== 'jar') {
            this.$message.error('必须上传jar文件')
            result = false
            this.isUploadFile = false
          }
          break
        case 1:
          if (fileType !== 'jar') {
            this.$message.error('必须上传jar文件')
            result = false
            this.isUploadFile = false
          }
          break
        case 2:
          if (fileType !== 'zip') {
            this.$message.error('必须上传zip文件')
            result = false
            this.isUploadFile = false
          }
          break
        case 3:
          if (fileType !== 'war') {
            this.$message.error('必须上传war文件')
            result = false
            this.isUploadFile = false
          }
          break
        case 4:
          if (fileType !== 'war') {
            this.$message.error('必须上传war文件')
            result = false
            this.isUploadFile = false
          }
          break
      }
      return result
    },
    queryErrorMsg (data, msg) {
      if (data.resultCode !== '00') {
        Notification.error({
          title: msg,
          message: JSON.stringify(data.message)
        })
      }
    }
  },
  mounted () { // 页面加载完成后回调
    // 根据用户名查询应用组
    this.fetchSelfAppGroups()
    // 查询仓库
    this.$store.dispatch(reposType.FETCH_REPOS, {})
      .then((data) => { this.queryErrorMsg(data, '查询仓库失败') })
    // 查询主机
    this.$store.dispatch(nodeType.FETCH_ALL_NODE, {})
      .then((data) => { this.queryErrorMsg(data, '查询主机失败') })
    // 查询集群
    this.$store.dispatch(mutationsType.FETCH_CLUSTERS, {})
      .then((data) => { this.queryErrorMsg(data, '查询集群失败') })
    // 如果为更新页面的话
    if (this.$route.path === '/app/list/updateModel') {
      // 获取该模板id并查询该id的模板信息
      this.$store.dispatch(modelType.FETCH_SELECT_MODELID, {modelID: this.$route.query.id})
        .then((data) => {
          if (data.resultCode === '00') {
            // 判断是否有权限
   //         this.checkModelRole
            // 显示到页面
            this.setObjModelJSON
          } else {
            Notification.error({
              title: '查询模板信息出错',
              message: JSON.stringify(data.message)
            })
          }
        })
      this.updateOrCreate = '立即更新'
    } else if (this.$route.path === '/app/list/catalogStackCreate') { // 如果为程序包发布页面的话
      // 获取该模板id并查询该id的模板信息
      this.$store.dispatch(modelType.FETCH_SELECT_MODELID, {modelID: this.$route.query.id})
        .then((data) => {
          if (data.resultCode === '00') {
            // 显示到页面
            this.setObjModelJSON
          } else {
            Notification.error({
              title: '查询模板信息出错',
              message: JSON.stringify(data.message)
            })
          }
        })
      // 禁用名称和描述，并显示模板创建时间
      this.catalogStackCreate = true
      // 查询应用组
      this.$store.dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
        .then((data) => { this.queryErrorMsg(data, '查询应用组失败') })
    } else { // 创建模板页面
      this.isRole = true
    }
  }
}
</script>

<style lang="css">
  .line {
    height:1px;
    border:none;
    width: 80%;
    align: left;
    border-top:1px dashed  #0066CC;
  }
</style>
