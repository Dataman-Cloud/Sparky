<template>
  <div >
    <!-- 正常添加或修改模版的表单 -->
    <el-form :model="ruleForm" v-if="!catalogStackCreateForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="模版名称"  prop="name" style="width: 400px;" >
        <el-input v-model="ruleForm.name" v-bind:disabled="catalogStackCreate"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" min-width="70" sortable v-if="catalogStackCreate">
        {{ruleForm.createdTime | moment("YYYY/MM/DD HH:mm:ss")}}
      </el-form-item>
      <el-form-item label="描述" :rules="rules" prop="desc" style="width:800px;">
        <el-input type="textarea" v-model="ruleForm.desc" v-bind:disabled="catalogStackCreate"></el-input>
      </el-form-item>
      <el-form-item label="镜像地址" prop="image" style="width:800px;">
        <el-input v-model="ruleForm.image"></el-input>
        <el-checkbox label="强制拉取镜像" v-model="ruleForm.force" name="force"></el-checkbox>
      </el-form-item>
      <el-form-item label="仓库认证" prop="base">
        <el-select v-model="ruleForm.base"  placeholder="请选择仓库">
          <el-option v-for="item in this.repos" :label="item.name" :value="item.accountId" :key="item.accountId"></el-option>
        </el-select>
      </el-form-item><!-- -->
      <el-form-item label="选择集群" prop="groups" >
        <el-select v-model="ruleForm.groups"  placeholder="请选择集群">
          <el-option v-for="item in this.mutation.clusters" :label="item.vClusterLabel" :value="item.vClusterLabel" :key="item.vClusterLabel"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择主机"><!--prop="master"-->
        <el-select v-model="ruleForm.master"  placeholder="请选择主机">
          <el-option v-for="item in this.node" :label="item.hostName" :value="item.hostName" :key="item.hostName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网络模式">
        <el-radio-group @change="networkChange()" v-model="ruleForm.network" >
          <el-radio :label="0" >网桥模式</el-radio>
          <el-radio :label="1" >HOST模式</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="容器规格" prop="norms" >
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
          <el-input-number v-model="ruleForm.hardDrive" size="small" :debounce="3000" :min="0" :step="1"></el-input-number>
        </el-col>
      </el-form-item>

      <el-form-item
        label="容器个数"
        prop="dockerNum"
        :rules="[
      { required: true, message: '容器个数不能为空'},
      { type: 'number', message: '容器个数必须为数字值'}
    ]"
      >
        <el-input type="age" v-model.number="ruleForm.dockerNum" auto-complete="off" style="width: 300px"></el-input><br/>
        <el-checkbox label="1容器：1主机" v-model="ruleForm.dockerProportion" name="dockerProportion"></el-checkbox>
      </el-form-item>

      <el-form-item label="F5 Pool名称" :rules="rules" style="width: 400px;" >
        <el-input v-model="ruleForm.f5Pool"></el-input>
      </el-form-item>

      <el-form-item label="程序包挂载" prop="procedureMount" style="width: 400px;" >
        <el-input v-model="ruleForm.procedureMount" placeholder="容器路径"></el-input>
      </el-form-item>

      <!-- 这里开始高级选项 -->
      <el-collapse>
        <el-collapse-item title="高级选项" name="1">
          <a @click="addPorts" v-show="ruleForm.network=== 0" class="cursor-pointer">添加端口<i class="el-icon-plus"></i></a><br/>
          <!--<el-button @click="addPorts">添加端口</el-button><br/>-->
          <template v-for="(port, index) in ruleForm.ports">
            <el-col :span="24" :key="index" class="margin-bottom height-30 min-width"  v-show="ruleForm.network===0">
              <el-input v-model="port.port" size="small" placeholder="端口号" style="width:120px" ></el-input>
              <el-select v-model="port.type" placeholder="" size="small" style="width:100px;">
                <el-option label="tcp" value="tcp"  ></el-option>
                <el-option label="udp" value="udp"></el-option>
              </el-select>
              <el-button @click.prevent="removePorts(port)" size="small">删除</el-button>
            </el-col>
          </template>




          <!--<el-button @click="addMount">添加挂载目录</el-button><br/>-->
          <a @click="addMount" class="cursor-pointer">挂载目录<a class="el-icon-plus"></a></a><br/>
          <el-form-item
            v-for="(mount, index) in ruleForm.mounts" style="margin-left: -100px;" :key="index">
            <el-input v-model="mount.dockerPath" placeholder="容器路径" size="small" style="width: 300px;" ></el-input>
            <el-input v-model="mount.masterPath" placeholder="主机路径" size="small" style="width: 300px;" ></el-input>
            <el-select v-model="mount.type" size="small" style="width: 100px;">
              <el-option label="读写" value="RW"></el-option>
              <el-option label="只读" value="RO"></el-option>
            </el-select>
            <el-button @click.prevent="removeMount(mount)" size="small">删除</el-button>
          </el-form-item>


          <!--<el-button @click="addHealth">添加健康检查</el-button>-->
          <a @click="addHealth" class="cursor-pointer">健康检查<a class="el-icon-plus"></a></a><br/>
          <template v-for="(h, index) in ruleForm.health">
            <el-col :span="24" :key="index" class="margin-top margin-bottom">
              <div class="table-cell">
                <div class="label">
                  <label for="">协议</label>
                </div>
                <div class=" height-30">
                  <el-select @change="healthProtocolChange(h)" v-model="h.networkProtocol" size="small" style="width: 100px;">
                    <el-option label="HTTP" value="HTTP" ></el-option>
                    <el-option label="TCP" value="TCP"></el-option>
                  </el-select>
                </div>
              </div>
              <div v-if="h.healthHttpPathText" :id="'healthHttpPathText' + index"  class="table-cell">
                <div class="label">
                  <label for="">路径</label>
                </div>
                <div class=" height-30">
                  <el-input v-model="h.healthHttpPath" placeholder="" size="small" style="width: 120px;" ></el-input>
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
                  <el-input-number v-model="h.graceTime" size="small" :min="0" :step="1" ></el-input-number>
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
                  <el-input-number v-model="h.intervalTime" size="small" :min="0" :step="1" ></el-input-number>
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
                  <el-input-number v-model="h.overtime" size="small" :min="0" :step="1" ></el-input-number>
                </div>
              </div>
              <div class="table-cell">
                <div class="label">
                  <el-tooltip content="设置该参数后，如果一个实例的健康检查连续不健康的次数达到该参数，该实例将被停止。但如果该参数设为0，健康检查获取不健康返回时并不会停止实例。" placement="top">
                    <a class="el-icon-information"></a>
                  </el-tooltip>
                  <label for="">最多持续失败次数</label>
                </div>
                <div class="height-30">
                  <el-input-number v-model="h.maxFail" size="small" :min="0" :step="1" ></el-input-number>
                </div>
              </div>
              <div class="table-cell">
                <div class="label">
                  <label for="">端口类型</label>
                </div>
                <div class="height-30">
                  <el-select @change="healthPortTypeChange(h)" v-model="h.portType" size="small" style="width: 100px;">
                    <el-option label="端口组索引" value="1"  ></el-option>
                    <el-option label="端口号" value="2"  ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="table-cell">
                <div class="label">
                  <label for="">{{h.portNumOrPortIndexText}}</label>
                </div>
                <div class="height-30">
                  <el-input id="protNum" v-if="h.protNumCode"  v-model="h.portNum" property="端口号" size="small" style="width: 120px;" ></el-input>
                  <el-input id="protIndex" v-if="h.portIndexCode"  v-model="h.portIndex" property="端口组索引" size="small" style="width: 120px;"></el-input>
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
                <el-checkbox label="忽略HTTP返回码100~199" v-model="h.healthIsIgnoreHttpCode"></el-checkbox>
              </el-col>
            </el-col>

          </template>

          <a @click="addEnvironmentVariable" class="cursor-pointer">自定义环境变量<a class="el-icon-plus"></a></a><br/>
          <el-form-item
            v-for="(ev, index) in ruleForm.environmentVariables" class="margin-left-100" :key="index">
            <el-input v-model="ev.key" placeholder="key" size="small" style="width: 300px;" ></el-input>
            <el-input v-model="ev.value" placeholder="value" size="small" style="width: 300px;" ></el-input>
            <el-button @click.prevent="removeEnvironmentVariable(ev)" size="small">删除</el-button>
          </el-form-item>

          <a  @click="addDockerPar"  class="cursor-pointer">自定义Docker参数<a class="el-icon-plus"></a></a>
          <el-form-item
            v-for="(dp, index) in ruleForm.dockerPar" style="margin-left: -100px;" :key="index">
            <el-input v-model="dp.key" placeholder="key" size="small" style="width: 300px;" ></el-input>
            <el-input v-model="dp.value" placeholder="value" size="small" style="width: 300px;" ></el-input>
            <el-button @click.prevent="removeDockerPar(dp)" size="small">删除</el-button>
          </el-form-item>
          <p>
            <small>Docker的参数中，凡是要对宿主机的文件、网络和设备等本地资源进行操作，请确保该操作能被正确执行，包括 env-file、network、publish、volume、device 等。<br>env-file 参数：若通过此参数读取本地文件，需提前将目标文件上传到该宿主机的如下目录 —— /data/envfiles。</small>
          </p>



          <el-form-item label="CMD" :rules="rules" style="width: 400px;" >
            <el-input v-model="ruleForm.cmd" placeholder="输入需要运行的命令"></el-input>
          </el-form-item>

        </el-collapse-item>
      </el-collapse>
      <br/><br/>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="!catalogStackCreate && isRole">{{this.updateOrCreate}}</el-button>
        <el-button type="primary" @click="cscFormController" v-if="catalogStackCreate">下一步</el-button>
        <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
    <!-- 发布程序包的表单-->
    <el-form :model="cscForm" v-if="catalogStackCreateForm" :rules="cscFormRules" ref="cscForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="模版名称" style="width: 400px;" >
        <el-input v-model="ruleForm.name" v-bind:disabled="true" ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" min-width="70" sortable>
        {{ruleForm.createdTime | moment("YYYY/MM/DD HH:mm:ss")}}
      </el-form-item>
      <el-form-item label="描述" :rules="rules" style="width:800px;">
        <el-input type="textarea" v-model="ruleForm.desc" v-bind:disabled="true" ></el-input>
      </el-form-item><!-- -->
      <el-form-item label="选择应用组" prop="appsGroup"  >
        <el-select v-model="cscForm.appsGroup" v-bind:disabled="this.cscForm.success" placeholder="请选择应用组" >
          <el-option v-for="item in this.appgroups" :label="item.id.replace('/','')" :value="item.id.replace('/','')" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="应用名称"  style="width: 400px;" prop="appsName" >
        <el-input v-model="cscForm.appsName" v-bind:disabled="this.cscForm.success"></el-input>
      </el-form-item>
      <el-form-item label="版本号"  style="width: 400px;" prop="version" >
        <el-input v-model="cscForm.version" v-bind:disabled="this.cscForm.success"></el-input>
      </el-form-item>
      <el-form-item v-if="!this.cscForm.success" label="包类型">
        <el-radio-group v-model="cscForm.packageType" >
          <el-radio :label="0" >微服务(.jar)</el-radio>
          <el-radio :label="1" >Dubbo(.jar)</el-radio>
          <el-radio :label="2" >Nginx(.zip)</el-radio>
          <el-radio :label="3" >Tomcat(.war)</el-radio>
          <el-radio :label="4" >WebLogic(.war)</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- :http-request="fileUpload" -->
      <el-form-item style="width:300px;"  v-if="!this.cscForm.success">
        <el-upload
          class="upload-demo"
          ref="upload"
          name="upload"
          v-bind:action="uploadFileAction"
          v-bind:multiple="false"
          v-bind:data="uploadParam"
          v-bind:headers="uploadHeaders"
          :before-upload="beforeAvatarUpload"
          :on-change="uploadChange"
          v-bind:auto-upload="uploadFile">
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item  v-if="!this.cscForm.success">
        <el-button type="primary" @click="cscFormController" v-if="catalogStackCreate">上一步</el-button>
        <el-button type="primary" @click="cscFormSubmit('cscForm')">创建</el-button>
        <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
      </el-form-item>
      <el-form-item v-if="this.cscForm.success">
        <el-form-item label="状态" min-width="70" sortable>创建完成</el-form-item>
      </el-form-item>
      <el-form-item v-if="this.cscForm.success">
        <el-button type="primary" @click="appList" >查看应用列表</el-button>
        <el-button type="primary" @click="appInfo" >查看应用详情</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import * as nodeType from '@/store/node/mutations_types'
  import * as mutationsType from '@/store/clusters/mutations_types'
  import * as reposType from '@/store/user/mutations_types'
  import * as modelType from '@/store/model/mutations_types'
  import * as appgroupTypes from '@/store/appgroups/mutations_types'
  import * as appType from '@/store/app/mutations_types'
  import {mapState} from 'vuex'
  import AppModel from '@/common/model/AppModel'
  import Container from '@/common/model/Container'
  import Docker from '@/common/model/Docker'
  import { Notification } from 'element-ui'
  export default {
    data () {
      return {
        catalogStackCreate: false, // 是否为程序包发布进入
        catalogStackCreateForm: false, // 程序包发布进入后的表单控制
        updateOrCreate: '立即创建', // 创建或更新的文本
        uploadFileAction: window.location.protocol + '/jborg/catalogs/uploadCatalogsStack', // 上传的文件路径
        uploadHeaders: {'Authorization': localStorage.getItem('token')}, // 上传文件headers信息
        // uploadFileAction: '/jborg/catalogs/uploadCatalogsStack', // 上传的文件路径
        uploadFile: false, // 是否立即上传
        isRole: false, // 是否有更新该模板的权限
        cscForm: { // 发布程序包的表单
          appsGroup: '',
          appsName: '',
          version: '',
          packageType: 0,
          success: false // 是否发布程序包成功，成功后禁用应用组名称，应用名称，版本号，隐藏：包类型和上传按钮，显示：状态为创建完成，“应用列表”和“查看应用详情”按钮
        },
        ruleForm: { // 创建或更新的表单
          id: '',
          name: '',
          desc: '',
          image: '',
          force: false,
          base: '',
          groups: '',
          master: '',
          network: 0,
          cpus: 0,
          memory: 0,
          hardDrive: 0,
          dockerNum: '',
          dockerProportion: false,
          dockerProportionDefault: false, // dockerProportion的值是否为原有的值(查询出的值)
          f5Pool: '',
          procedureMount: '',
          ports: [],
          mounts: [],
          environmentVariables: [],
          health: [],
          cmd: undefined,
          dockerPar: [],
          createdTime: ''
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
        },
        rules: {
          name: [
            { required: true, message: '请输入模版名称', trigger: 'blur' }
          ],
          desc: [
          ],
          image: [
            { required: true, message: '请输入镜像地址', trigger: 'blur' }
          ],
          groups: [
            { required: true, message: '请选择集群', trigger: 'change' }
            // { required: true, type: 'number', message: '请选择集群', trigger: 'change' }
          ],
          /*
           master: [
           { required: true, message: '请选择主机', trigger: 'change' }
           ],
           */
          network: [
            { required: true, message: '请选择网络模式 ', trigger: 'change' }
          ],
          norms: [
          ],
          procedureMount: [
            { required: true, message: '请输入程序包挂载点', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      ...mapState({
        node ({ node }) {
          return node.nodes.nodes
        },
        nodeTotal ({ node }) {
          return node.nodes.total
        },
        mutation ({ clusters }) {
          return clusters.clusters
        },
        mutationTotal ({ clusters }) {
          return clusters.total
        },
        repos ({ user }) {
          return user.repos.repos
        },
        reposTotal ({ user }) {
          return user.repos.total
        },
        appgroups ({ appgroups }) {
          return appgroups.arr
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
          console.log(state.model.model.model)
          let appModel = JSON.parse(state.model.model.model.json)
          // 封装应用模版信息进行显示
          this.ruleForm.id = state.model.model.model.id // id
          this.ruleForm.name = state.model.model.model.name // 名称
          this.ruleForm.desc = state.model.model.model.desc // 描述
          this.ruleForm.createdTime = state.model.model.model.CreatedAt // 创建时间
          this.ruleForm.image = appModel.container.docker.image // 镜像
          this.ruleForm.force = appModel.container.docker.forcePullImage // 强制拉取镜像
          // 仓库认证
          this.ruleForm.groups = appModel.constraints[0][2] // 选择的集群
          this.ruleForm.network = appModel.container.docker.network === 'BRIDGE' ? 0 : 1 // 网络模式
          this.ruleForm.cpus = appModel.cpus // cpu
          this.ruleForm.memory = appModel.mem // 内存
          this.ruleForm.hardDrive = appModel.disk // 硬盘
          this.ruleForm.dockerNum = appModel.instances // 容器个数
          switch (appModel.constraints.length) {
            case 1:// 没有选择集群和1容器：1主机
              break
            case 2:// 集群和1容器：1主机选择了1个
              if (appModel.constraints[1][1] === 'UNIQUE') { // 是否选择了1容器：1主机
                this.ruleForm.dockerProportion = true
                this.ruleForm.dockerProportionDefault = true
              } else { // 没有选择1容器：1主机则选择了主机
                this.ruleForm.dockerProportion = false
                this.ruleForm.dockerProportionDefault = true
                // 选择的主机
                this.ruleForm.master = appModel.constraints[1][2]
              }
              break
            case 3: // 集群和1容器：1主机都进行了选择
              // 1容器：1主机
              this.ruleForm.dockerProportion = true
              this.ruleForm.dockerProportionDefault = true
              // 选择的主机
              this.ruleForm.master = appModel.constraints[2][2]
              break
          }
          // this.ruleForm.f5Pool = appModel.env['F5_POOL_NAME']// F5 Pool 名称
          if (appModel.hasOwnProperty('labels')) {
            if (appModel.labels.hasOwnProperty('PACKAGE_VOLUME')) {
              this.ruleForm.procedureMount = appModel.labels['PACKAGE_VOLUME']// 程序包挂载点
            }
          }
          this.ruleForm.cmd = appModel.cmd // CMD命令
          //  自定义端口号
          for (let v of appModel.container.docker.portMappings) {
            this.ruleForm.ports.push({port: v.containerPort, type: v.protocol})
          }
          // 挂载目录
          for (let v of appModel.container.volumes) {
            this.ruleForm.mounts.push({dockerPath: v.containerPath, masterPath: v.hostPath, type: v.mode})
          }
          if (appModel.hasOwnProperty('healthChecks')) {
            // 健康检查
            for (let v of appModel.healthChecks) {
              let health = {}
              health.networkProtocol = v.protocol // 协议
              health.graceTime = v.gracePeriodSeconds // 宽限时间
              health.intervalTime = v.intervalSeconds// 检查间隔
              health.overtime = v.timeoutSeconds// 检查超时
              health.maxFail = v.maxConsecutiveFailures // 最大失败次数
              if (v.protocol === 'HTTP') {
                // ---htrp
                health.healthHttpPath = v.path // 选择http协议后的路径
                health.healthIsIgnoreHttpCode = v.ignoreHttp1xx // 是否选中了忽略http返回码
                health.healthHttpPathText = true// 选择http协议后表格第一行“路径”标题
                health.healthHttpPathCode = true // 选择http协议后显示表格第二行“路径”
                health.healthHttpCheckBoxCode = true// 选择http协议后显示表格第三行“忽略http返回码”的checkbox元素
              }
              // ---端口号
              if (v.hasOwnProperty('ifPortIndex') && v.ifPortIndex === 1) { // 选中了端口组索引后
                health.portType = '1' // 选中端口组索引
                health.portIndex = v.portIndex// 端口组索引的值
                health.portNum = '' // 清空之端口号
                health.protNumCode = false // “端口号”的input元素隐藏
                health.portNumOrPortIndexText = '端口组索引'// 文字显示为端口组索引
                health.portIndexCode = true // “端口组索引”的input元素显示
              } else {
                health.portType = '2' // 选中端口号
                health.portNum = v.port // 端口号的值
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
          constraints = [
            ['vcluster', 'LIKE', this.ruleForm.groups], // 集群
            ['hostname', 'UNIQUE'],
            ['hostname', 'LIKE', this.ruleForm.master]// 主机
          ]
        } else if (this.ruleForm.dockerProportion === false) {
          constraints = [
            ['vcluster', 'LIKE', this.ruleForm.groups], // 集群
            ['hostname', 'LIKE', this.ruleForm.master]// 主机
          ]
        }
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
        for (let v of this.ruleForm.ports) {
          let port = {}
          port['containerPort'] = parseInt(v.port) // 端口号
          port['name'] = ''
          port['protocol'] = v.type // tcp或udp
          portMappings.push(port)
        }
        // 挂载目录
        let volumes = []
        for (let v of this.ruleForm.mounts) {
          let vol = {}
          vol['containerPath'] = v.dockerPath // 容器路径
          vol['hostPath'] = v.masterPath // 主机路径
          vol['mode'] = v.type // 读写RW或只读RO
          volumes.push(vol)
        }
        // docker和挂载目录
        let cont = new Container(
          new Docker(
            this.ruleForm.image, // 镜像地址
            this.ruleForm.network === 0 ? 'BRIDGE' : 'HOST', // 网桥模式，HOST模式
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
          heal['protocol'] = v.networkProtocol // 协议http或tcp
          heal['value'] = ''
          heal['delaySeconds'] = null
          heal['gracePeriodSeconds'] = v.graceTime // 宽限时间
          heal['intervalSeconds'] = v.intervalTime// 间隔时间
          heal['portName'] = ''
          heal['timeoutSeconds'] = v.overtime// 检查超时
          heal['maxConsecutiveFailures'] = v.maxFail// 最多持续失败次数
          if (v.networkProtocol === 'HTTP') {
            heal['ignoreHttp1xx'] = v.healthIsIgnoreHttpCode// 选择http协议后是否勾选了忽略http返回码
            heal['path'] = v.healthHttpPath // 选择http协议后填写的路径
          }
          if (v.portType === '1') { // 选择了端口组索引
            heal['ifPortIndex'] = 1
            // 判断转为int
            if (v.portIndex !== '' && v.portIndex !== null) {
              heal['portIndex'] = parseInt(v.portIndex)// 选择端口组索引后的 端口组索引值
            }
          } else if (v.portType === '2') { // 选择了端口号
            // 判断转为int
            if (v.portNum !== '' && v.portNum !== null) {
              heal['port'] = parseInt(v.portNum) // 端口号，如选择端口组索引则没有此属性
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
          this.ruleForm.procedureMount,
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
        } else if (this.getModelInfo.groupId === 1) { // 该模版的创建者为超管
          this.isRole = true
        }
      }
    },
    methods: {
      appList () { // 跳转应用列表
        this.$router.push({path: '/app/list/apps'})
      },
      appInfo () { // 跳转应用详细列表
        this.$router.push({path: '/app/appInstance/list',
          query: {'id': '%2F' + this.cscForm.appsGroup + '%2F' + this.cscForm.appsName}})
      },
      networkChange () {
        if (this.ruleForm.network === 0) {
          this.ruleForm.dockerProportion = false
          this.dockerProportionDefault = false
        } else if (this.ruleForm.network === 1 && this.dockerProportionDefault === false) {
          this.ruleForm.dockerProportion = true
        }
      },
      addPorts () {
        this.ruleForm.ports.push({
          port: 1,
          type: 'tcp'
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
          dockerPath: '',
          masterPath: '',
          type: 'RO' // RW
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
          networkProtocol: 'HTTP',
          graceTime: '',
          intervalTime: '',
          overtime: '',
          maxFail: '',
          portType: '1',
          portNum: '',
          protNumCode: false, // “端口号”的input元素是否显示
          portNumOrPortIndexText: '端口组索引', // 存放“端口号”或“端口组索引”文字
          portIndexCode: true, // “端口组索引”的input元素是否显示
          portIndex: '',  // 用于存放选择“端口组索引”后的端口组索引
          healthHttpPath: '', // 用于存放选择http协议后的“http路径input元素的值”
          healthIsIgnoreHttpCode: false, // “忽略http返回码”的checkbox是否被选中
          healthHttpCheckBoxCode: true, // 选择http协议后表格第三行“忽略http返回码”的checkbox元素是否显示
          healthHttpPathCode: true, // 选择http协议后表格第二行“路径”的input元素是否显示
          healthHttpPathText: true // 选择http协议后表格第一行“路径”标题是否显示
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
        if (this.ruleForm.health[index].networkProtocol === 'HTTP') {
          if (index !== -1) {
            this.ruleForm.health[index].healthHttpCheckBoxCode = true
            this.ruleForm.health[index].healthHttpPathCode = true
            this.ruleForm.health[index].healthHttpPathText = true
            // healthHttpCheckBoxCode,healthHttpPathCode,healthHttpPathText
          }
        } else if (this.ruleForm.health[index].networkProtocol === 'TCP') {
          if (index !== -1) {
            this.ruleForm.health[index].healthHttpCheckBoxCode = false
            this.ruleForm.health[index].healthHttpPathCode = false
            this.ruleForm.health[index].healthHttpPathText = false
            this.ruleForm.health[index].healthIsIgnoreHttpCode = false
            /*
             // 关闭端口号只保留端口组索引
             this.ruleForm.health[index].portType = '1'// 更改select的类型为端口组索引
             this.ruleForm.health[index].portNum = '' // 清空之前填写的端口号
             this.ruleForm.health[index].protNumCode = false // “端口号”的input元素隐藏
             this.ruleForm.health[index].portNumOrPortIndexText = '端口组索引'// 文字显示为端口组索引
             this.ruleForm.health[index].portIndexCode = true // “端口组索引”的input元素显示
             this.ruleForm.health[index].portIndex = ''//  清空之前填写的“端口组索引”
             */
          }
        }
      },
      healthPortTypeChange (item) {
        let index = this.ruleForm.health.indexOf(item)
        // 如果选中了端口类型为“端口组索引”
        if (this.ruleForm.health[index].portType === '1') {
          if (index !== -1) {
            this.ruleForm.health[index].portNum = '' // 清空之前填写的端口号
            this.ruleForm.health[index].protNumCode = false // “端口号”的input元素隐藏
            this.ruleForm.health[index].portNumOrPortIndexText = '端口组索引'// 文字显示为端口组索引
            this.ruleForm.health[index].portIndexCode = true // “端口组索引”的input元素显示
            this.ruleForm.health[index].portIndex = ''//  清空之前填写的“端口组索引”
          }
        } else {
          if (index !== -1) {
            this.ruleForm.health[index].portNum = '' // 清空之前填写的端口号
            this.ruleForm.health[index].protNumCode = true // “端口号”的input元素显示
            this.ruleForm.health[index].portNumOrPortIndexText = '端口号'// 文字显示为端口组索引
            this.ruleForm.health[index].portIndexCode = false // “端口组索引”的input元素隐藏
            this.ruleForm.health[index].portIndex = ''//  清空之前填写的“端口组索引”
          }
        }
      },
      cscFormSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 提交文件上传
            this.$refs.upload.submit()
          }
        })
      },
      // 更改文件时触发，添加文件、上传成功和上传失败时都会被调用
      uploadChange (file, fileList) {
        if (file.status === 'ready') {
        } else if (file.status === 'success') {
          if (file.response.resultCode !== '00') {
            this.$message.error('上传失败')
            // 取消上传请求
            this.$refs.upload.abort()
            // 清空已上传的文件列表
            this.$refs.upload.clearFiles()
          } else {
              // 上传成功
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
            console.log(appModel)
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
                }
              })
          }
        } else if (file.status === 'fail') {
          this.$message.error('上传失败')
          // 取消上传请求
          this.$refs.upload.abort()
          // 清空已上传的文件列表
          this.$refs.upload.clearFiles()
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
              console.log(appModel)
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
      submitForm (formName) { // 更新模版
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.updateOrCreate === '立即更新') {
              // 更新操作
              let modelInfo = {
                'name': this.ruleForm.name,
                'desc': this.ruleForm.desc,
                'json': this.getObjModelJSON,
                'id': this.ruleForm.id
              }
              this.$store.dispatch(modelType.FETCH_UPDATA_MODEL, {
                modelInfo: modelInfo
              }).then((data) => {
                if (data.resultCode === '00') {
                  // 更新成功
                  this.$router.push({path: '/app/list/appsModel'})
                } else {
                  Notification.error({
                    title: '更新模版出錯',
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
                    // 跳转回列表
                    this.$router.push({path: '/app/list/appsModel'})
                  } else {
                    Notification.error({
                      title: '创建应用模版出错',
                      message: JSON.stringify(data.message)
                    })
                  }
                })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 程序包发布表单控制
      cscFormController () {
        if (this.catalogStackCreateForm === false) {
          this.catalogStackCreateForm = true
        } else if (this.catalogStackCreateForm === true) {
          this.catalogStackCreateForm = false
        }
      },
      // 控制上传文件类型
      beforeAvatarUpload (file) {
        let result = true
        // 获取后缀名
        const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        // 获取应上传的后缀名
        switch (this.cscForm.packageType) {
          case 0:
            if (fileType !== 'jar') {
              this.$message.error('必须上传jar文件')
              result = false
            }
            break
          case 1:
            if (fileType !== 'jar') {
              this.$message.error('上传头像图片只能是 JPG 格式!')
              result = false
            }
            break
          case 2:
            if (fileType !== 'zip') {
              this.$message.error('必须上传zip文件')
              result = false
            }
            break
          case 3:
            if (fileType !== 'war') {
              this.$message.error('必须上传war文件')
              result = false
            }
            break
          case 4:
            if (fileType !== 'war') {
              this.$message.error('必须上传war文件')
              result = false
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
        // 获取该模版id并查询该id的模版信息
        this.$store.dispatch(modelType.FETCH_SELECT_MODELID, {modelID: this.$route.query.id})
          .then((data) => {
            if (data.resultCode === '00') {
              // 判断是否有权限
              this.checkModelRole
              // 显示到页面
              this.setObjModelJSON
            } else {
              Notification.error({
                title: '查询模版信息出错',
                message: JSON.stringify(data.message)
              })
            }
          })
        this.updateOrCreate = '立即更新'
      } else if (this.$route.path === '/app/list/catalogStackCreate') { // 如果为程序包发布页面的话
        // 获取该模版id并查询该id的模版信息
        this.$store.dispatch(modelType.FETCH_SELECT_MODELID, {modelID: this.$route.query.id})
          .then((data) => {
            if (data.resultCode === '00') {
              // 显示到页面
              this.setObjModelJSON
            } else {
              Notification.error({
                title: '查询模版信息出错',
                message: JSON.stringify(data.message)
              })
            }
          })
        // 禁用名称和描述，并显示模版创建时间
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

<style scoped>
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
