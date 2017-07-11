<template>
  <section>
    <el-select @change="changeGroups" v-model="appsGroup" placeholder="请选择应用组">
      <el-option v-for="item in this.appgroups" :label="item.id.replace('/','')" :value="item.id.replace('/','')"
                 :key="item.id"></el-option>
    </el-select>
    <el-button @click="updateAPPList">更新</el-button>
    <el-table
      highlight-current-row v-loading="loading"
      ref="multipleTable"
      v-bind:data="apps"
      @selection-change="selectApps"
      border
      tooltip-effect="dark"
      style="width: 100%; margin-top: 5px;">
      <el-table-column
        :selectable="checkSelectable"
        select="select"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="应用"
        width="120">
        <template scope="scope"><a href="javascript:void(0);" @click="appInfoDialog(scope.$index)">{{ scope.row.appInfo.app.id }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="packageType"
        label="应用类型"
        width="120">
      </el-table-column>
      <el-table-column
        label="版本号"
        show-overflow-tooltip>
        <template scope="scope"><!-- -->
          <el-input size="small" :disabled="scope.row.rowIsDisabled" v-model="scope.row.appInfo.app.labels.CURRENT_VERSION" placeholder="版本号"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        label="文件"
        show-overflow-tooltip
        width="200">
        <template scope="scope">
          <el-upload
            class="upload-demo"
            name="upload"
            v-bind:action="uploadFileBasePath"
            v-bind:auto-upload="autoUploadFile"
            v-bind:data="scope.row.param"
            v-bind:headers="headers"
            v-bind:ref="scope.row.uploadRef"
            v-bind:multiple="false"
            v-bind:disabled="scope.row.rowIsDisabled"
            :before-upload="beforeAvatarUpload"
            :on-change="uploadChange"
            :on-remove="uploadRemove"
            :on-progress="uploadProgress">
            <el-button size="small" :disabled="scope.row.rowIsDisabled"
                       @click="saveRowIndex(scope.$index)" type="primary">选择文件
            </el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip>
        <template scope="scope">
          <el-button type="primary" size="mini" :disabled="scope.row.rowIsDisabled"
                     @click="uploadFile(scope.$index)">上传
          </el-button>
          <el-button type="primary" size="mini" :disabled="scope.row.rowIsDisabled"
                     @click="uploadReset(scope.$index)">重置{{scope.rows}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹出层 -->
    <el-dialog
      :visible.sync="dialog.dialogVisible"
      size="small">
      <label>应用名称：{{dialog.dialogName}}</label><label style="float: right">CPU：{{dialog.dialogCPU}}</label><br/>
      <label>内存：{{dialog.dialogMem}}</label><label style="float: right">实例个数：{{dialog.dialogExample}}</label><br/>
      <label>CMD：{{dialog.dialogCMD}}</label><label style="float: right">版本：{{dialog.dialogVer}}</label><br/>
      <label>应用端口：<label v-for="item in dialog.dialogPortMappings">{{item.servicePort}}，</label></label><label style="float: right">协议：<label v-for="item in dialog.dialogPortMappings">{{item.protocol}}，</label></label><br/>
      <label>映射端口：<label v-for="item in dialog.dialogPortMappings">{{item.containerPort}}，</label></label><br/>
      <label>仓库认证：</label><br/>
      <label v-show="dialog.dialogEnvionVar !== '{}'">环境变量：
      <div class="codemirrorHeight">
        <codemirror v-model="dialog.dialogEnvionVar" :options="editorOptions" class="codemirror">
        </codemirror>
      </div></label><br/>
      <label v-show="dialog.dialogRestrict !== '[]'">限制条件：
        <div class="codemirrorHeight">
          <codemirror v-model="dialog.dialogRestrict" :options="editorOptions" class="codemirror">
          </codemirror>
        </div></label><br/>
      <label v-show="dialog.dialogHealthCheck !== '[]'">健康检查：
        <div class="codemirrorHeight">
          <codemirror v-model="dialog.dialogHealthCheck" :options="editorOptions" class="codemirror">
          </codemirror>
        </div></label><br/>
      <label v-show="dialog.dialogDocker !== '{}'">容器：
        <div class="codemirrorHeight">
          <codemirror v-model="dialog.dialogDocker" :options="editorOptions" class="codemirror">
          </codemirror>
        </div></label><br/>
    </el-dialog>
  </section>
</template>
<script>
  import * as appgroupTypes from '@/store/appgroups/mutations_types'
  import * as appTypes from '@/store/app/mutations_types'
  import {mapState} from 'vuex'
  import {Notification} from 'element-ui'
  import ElInput from '../../../node_modules/element-ui/packages/input/src/input'
  import ElButton from '../../../node_modules/element-ui/packages/button/src/button'
  import * as editorOptions from '@/common/defaultConfig'
  import {DEFAULT_BASE_URL} from '@/config'
  export default {
    components: {
      ElButton,
      ElInput
    },
    data () {
      return {
        editorOptions: editorOptions.editorOptions,
        uploadFileBasePath: DEFAULT_BASE_URL + '/jborg/catalogs/uploadCatalogsStack', // 上传的文件路径
        autoUploadFile: false, // 是否立即上传
        uploadRowIndex: -1, // 当前操作的upload行数索引，默认-1
        uploadRowIndexObj: {},
        uploadFileList: {}, // 上传文件的队列
        loading: false,
        headers: {'Authorization': localStorage.getItem('token')}, // headers信息
        appsGroup: '', // 当前应用组
        dialog: { // 弹出层信息
          dialogVisible: false, // 弹出层是否显示
          dialogName: undefined, // 应用名称
          dialogCPU: undefined, // CPU
          dialogMem: undefined, // 内存
          dialogExample: undefined, // 实力个数
          dialogCMD: undefined, // CMD
          dialogVer: undefined, // 版本
          dialogAPPNum: undefined, // 应用端口
          dialogProtocol: undefined, // 协议
          dialogPort: undefined, // 映射端口
          dialogDeport: undefined, // 仓库认证
          dialogEnvionVar: undefined, // 环境变量
          dialogRestrict: undefined, // 限制条件
          dialogHealthCheck: undefined, // 健康检查
          dialogDocker: undefined, // 容器
          dialogPortMappings: undefined // 应用端口,协议，映射端口
        },
        apps: [], // 应用列表
        uploadAPPS: [] // 需要更新的列表
      }
    },
    computed: {
      ...mapState({
        appgroups ({appgroups}) {
          return appgroups.arr
        },
        getAPP (state) {
          /*
          this.apps = state.app.apps.apps.map(app => {
            app.changeFile = false
            app.changeFileButton = false
            app.uploadButton = true
            app.reset = true
            return app
          })
          */
          this.apps = state.app.apps.apps
          console.log('1111-----------------------------')
          console.log(this.apps)
          for (let v = 0; v < this.apps.length; v++) {
            this.apps[v].appInfo = JSON.parse(this.apps[v].appInfo)
            // 设置包的中文名
            this.apps[v]['packageType'] = this.getPackageType(this.apps[v].appInfo.app.labels.PACKAGE_TYPE)
            // 设置整行禁用状态
            this.apps[v]['rowIsDisabled'] = false
            if (this.apps[v]['packageType'] === null || this.apps[v]['packageType'] === '') {
              this.apps[v]['rowIsDisabled'] = true
            }
            // 文件上传
            this.apps[v]['uploadRef'] = 'upload' + v
            // 文件上传参数
            this.apps[v].param = {
              'GroupName': this.appsGroup,
              'AppName': this.apps[v].appId.substring(this.apps[v].appId.lastIndexOf('/') + 1),
              'Version': this.apps[v].appInfo.app.labels.CURRENT_VERSION,
              'PackageType': this.apps[v].appInfo.app.labels.PACKAGE_TYPE
            }
            // 按钮默认状态
            /*
            this.apps[v].changeFile = false
            this.apps[v].changeFileButton = false
            this.apps[v].uploadButton = true
            this.apps[v].reset = true
            */
            console.log('for-----------------------')
            console.log(this.apps[v])
          }
          console.log('end-----------------------')
          console.log(this.apps)
        }
      })
    },
    methods: {
      checkSelectable (row) { // 获取该行是否禁用
        return false
      },
      // 获取包类型中文名
      getPackageType (pageType) {
        let result = ''
        switch (pageType) {
          case 'micro':
            result = '微服务'
            break
          case 'dubbo':
            result = 'Dubbo'
            break
          case 'nginx':
            result = 'Nginx'
            break
          case 'tomcat':
            result = 'Tomcat'
            break
          case 'weblogic':
            result = 'Weblogic'
            break
        }
        return result
      },
      getAPPInfo () {
        return this.getAPP
      },
      changeGroups () {
        // 开启加载动画
        this.loading = true
        // 查询该组下的应用
        this.$store.dispatch(appTypes.GET_APP_BYGROUPID, this.appsGroup)
          .then((data) => {
            if (data.resultCode !== '00') {
              Notification.error({
                title: '查询应用失败',
                message: JSON.stringify(data.message)
              })
            } else {
              /* ----- 清空值 ----- */
              for (let i = 0; i < this.apps.length; ++i) {
                console.log(this.$refs['upload' + i])
                if (this.$refs['upload' + i] !== undefined) {
                  // 取消上传请求
                  this.$refs['upload' + i].abort()
                  // 清空已上传的文件列表
                  this.$refs['upload' + i].clearFiles()
                }
              }
              // 列表赋值
              this.getAPP
              this.uploadRowIndex = -1 // 当前操作的upload行数索引，默认-1
              this.uploadRowIndexObj = {}
              this.uploadFileList = {} // 上传文件的队列
              this.uploadAPPS = [] // 需要更新的列表
              // 关闭加载动画
              this.loading = false
            }
          })
      },
      // 控制上传文件类型 this.uploadRowIndexObj[file.uid] = this.uploadRowIndex
      beforeAvatarUpload (file) {
        // 获取后缀名
        const fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        let result = true
        switch (this.apps[this.uploadRowIndexObj[file.uid]].appInfo.app.labels.PACKAGE_TYPE) {
          case 'micro':
            if (fileType !== 'jar') {
              this.$message.error('必须上传jar文件')
              result = false
            }
            break
          case 'dubbo':
            if (fileType !== 'jar') {
              result = false
              this.$message.error('必须上传jar文件')
            }
            break
          case 'nginx':
            if (fileType !== 'zip') {
              result = false
              this.$message.error('必须上传zip文件')
            }
            break
          case 'tomcat':
            if (fileType !== 'war') {
              result = false
              this.$message.error('必须上传war文件')
            }
            break
          case 'weblogic':
            if (fileType !== 'war') {
              result = true
              this.$message.error('必须上传war文件')
            }
            break
        }
        return result
      },
      // 勾选复选框时的触发事件
      selectApps (selection, row) {
        console.log(selection)
        this.uploadAPPS = selection
      },
      // 点击上传文件按钮触发，在这里会触发beforeAvatarUpload
      uploadFile (index) {
        // 保存当前行
        this.uploadRowIndex = index
        // 判断文件队列
        console.log(this.uploadFileList['list' + index])
        if (this.uploadFileList['list' + index] === undefined) {
          this.$message.error('请选择文件')
        } else if (this.uploadFileList['list' + index].length > 1) {
          this.$message.error('只能上传一个文件')
        } else {
          // 修改上传参数：版本号
          this.apps[index].param.Version = this.apps[index].appInfo.app.labels.CURRENT_VERSION
          // 触发上传操作
          this.$refs['upload' + index].submit()
        }
      },
      // 文件列表移除文件时的钩子
      uploadRemove (file, fileList) {
        console.log('移除')
        console.log(file)
        this.$refs.multipleTable.toggleRowSelection(this.apps[this.uploadRowIndexObj[file.uid]])
      },
      // 文件上传时会调用
      uploadProgress (event, file, fileList) {
      },
      // 更改文件时触发，添加文件、上传成功和上传失败时都会被调用
      uploadChange (file, fileList) {
        if (file.status === 'ready') { // 准备上传
          // 记录该文件对应的行
          this.uploadRowIndexObj[file.uid] = this.uploadRowIndex
          // 记录该行上传的文件个数
          this.uploadFileList['list' + this.uploadRowIndexObj[file.uid]] = fileList
          console.log('准备', file)
        } else if (file.status === 'success') { // 上传成功
          if (file.response.resultCode !== '00') {
            this.$message.error('上传失败')
          } else {
            // 上传成功
            /* ----------------------- 封装此行数据------------------------- */
            // 获取程序包地址
            let path = file.response.data
            let app = this.apps[this.uploadRowIndexObj[file.uid]].appInfo.app
            let appName = app.id.substring(app.id.lastIndexOf('/') + 1)
            // 找到挂载程序包的地址并修改为新地址
            for (let v of app.container.volumes) {
              if (v.hostPath.indexOf(`/data/apps/${this.appsGroup}/${appName}/${app.labels.CURRENT_VERSION}`) > -1) {
                v.hostPath = path // 替换为新地址
              }
            }
            // 更改包版本号
            app.labels.PACKAGE_VERSION = `${app.labels.PACKAGE_VERSION},${app.labels.CURRENT_VERSION}`
            app.labels.DEFAULT_PACKAGE_VERSION = new Date()
            console.log(app)
            // 选中此行
            this.$refs.multipleTable.toggleRowSelection(this.apps[this.uploadRowIndexObj[file.uid]])
          }
        } else if (file.status === 'fail') { // 上传失败
          this.$message.error('上传失败')
        }
      },
      // 点击重置按钮时触发
      uploadReset (index) {
        // 取消上传请求
        this.$refs['upload' + index].abort()
        // 清空已上传的文件列表
        this.$refs['upload' + index].clearFiles()
        // 取消选中
        this.$refs.multipleTable.toggleRowSelection(this.apps[index])
      },
      appInfoDialog (index) { // 显示弹出层
        this.dialog.dialogVisible = true
        this.dialog.dialogName = this.apps[index].appInfo.app.id // 应用名称
        this.dialog.dialogCPU = this.apps[index].appInfo.app.cpus // CPU
        this.dialog.dialogMem = this.apps[index].appInfo.app.mem // 内存
        this.dialog.dialogExample = this.apps[index].appInfo.app.instances // 实例个数
        this.dialog.dialogCMD = this.apps[index].appInfo.app.cmd // CMD
        this.dialog.dialogVer = this.apps[index].appInfo.app.version // 版本

        this.dialog.dialogPortMappings = this.apps[index].appInfo.app.container.docker.portMappings // 应用端口,协议，映射端口
         // this.dialog.dialogDeport = this.apps[index]., // 仓库认证
        this.dialog.dialogEnvionVar = JSON.stringify(this.apps[index].appInfo.app.env, null, 4) // 环境变量
        this.dialog.dialogRestrict = JSON.stringify(this.apps[index].appInfo.app.constraints, null, 4) // 限制条件
        this.dialog.dialogHealthCheck = JSON.stringify(this.apps[index].appInfo.app.healthChecks, null, 4)// 健康检查
        this.dialog.dialogDocker = JSON.stringify(this.apps[index].appInfo.app.container.docker, null, 4) // 容器
        console.log('弹出层内容---')
        console.log(this.dialog)
        console.log(this.apps[index].appInfo.app)
      },
      // 选择文件时保存当前行
      saveRowIndex (index) {
        this.uploadRowIndex = index
      },
      // 选中某一行时的触发
      select (selection, row) {
        console.log('select')
        console.log(selection)
        console.log('row', row)
        this.uploadAPPS = selection
        console.log(this.uploadAPPS)
      },
      // 批量更新应用
      updateAPPList () {
        if (this.uploadAPPS.length > 0) {
          let ua = []
          for (let v of this.uploadAPPS) {
            ua.push(v.appInfo)
          }
          let json = JSON.stringify(ua, null, 4)
          console.log('-----------------------------')
          console.log(ua)
          console.log(json)
          this.$store.dispatch(appTypes.UPDATE_APPLIST, json)
            .then((data) => {
              if (data.resultCode !== '00') {
                Notification.error({
                  title: '批量更新失败',
                  message: JSON.stringify(data.message)
                })
              } else {
                // 成功则跳转到应用列表页
                this.$router.push({path: '/app/list/apps'})
              }
            })
        }
      }
    },
    mounted () {
      // 开启加载动画
      this.loading = true
      // 查询应用组
      this.$store.dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
        .then((data) => {
          if (data.resultCode !== '00') {
            Notification.error({
              title: '查询应用组失败',
              message: JSON.stringify(data.message)
            })
          } else {
            // 赋默认值
            if (this.appgroups.length > 0) {
              this.appsGroup = this.appgroups[0].id.replace('/', '')
              // 查询当前应用组下的应用
              this.$store.dispatch(appTypes.GET_APP_BYGROUPID, this.appsGroup)
                .then((data) => {
                  if (data.resultCode !== '00') {
                    Notification.error({
                      title: '查询应用失败',
                      message: JSON.stringify(data.message)
                    })
                  } else {
                    // 列表赋值
                    this.getAPP
                  }
                })
            } else {
              // 关闭加载动画
              this.loading = false
            }
          }
          // 关闭加载动画
          this.loading = false
        })
    }
  }
</script>
<style>
  .CodeMirror{
    height: auto;
  }
</style>
