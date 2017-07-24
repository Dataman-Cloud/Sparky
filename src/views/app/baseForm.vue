<template>
  <div>
    <!-- <el-form-item label="应用id" prop="name" style="width: 400px;">
      <el-input v-model="ruleForm.name" :disabled="isEdit"></el-input>
    </el-form-item> -->
    <slot name="appId"></slot>
    <slot name="modelName"></slot>
    <slot name="createdTime"></slot>
    <slot name="modelDescription"></slot>
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
      <el-select v-model="ruleForm.vcluster" @change="vclusterChanger" :disabled="isEdit" placeholder="请选择集群">
        <el-option v-for="item in this.mutation.clusters" :label="item.vClusterLabel"
                   :value="item.vClusterLabel" :key="item.vClusterLabel"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择主机" prop="master">
      <el-select v-model="ruleForm.master" placeholder="请选择主机">
        <el-option v-for="item in this.node" :label="item.hostName" :value="item.hostName"
                   :key="item.hostName"></el-option>
      </el-select>
    </el-form-item>
    <slot name="appGroup"></slot>
    <el-form-item label="网络模式">
      <el-radio-group v-model="ruleForm.network" @change="networkChange">
        <el-radio label="BRIDGE">网桥模式</el-radio>
        <el-radio label="HOST">HOST模式</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="容器规格" prop="norms">
      <el-col :span="6" class="height-30 min-width">
        <label for="">CPUs</label>
        <el-input-number v-model="ruleForm.cpus" size="small" :min="0.01" :step="0.01" :max="1"></el-input-number>
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

    <el-form-item label="F5 Pool名称" style="width: 400px;">
      <el-input v-model="ruleForm.f5Pool"></el-input>
    </el-form-item>
    <slot name="mount"></slot>
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
          <el-form-item v-for="(port, index) in ruleForm.ports" class="margin-left-100" :key="index">
            <el-row>
              <el-col :span="3" :key="index"
                      v-show="ruleForm.network==='BRIDGE'">
                <el-form-item :prop="'ports.' + index + '.containerPort'"
                              :key="port.index"
                              :rules="[
                                  { required: true, message: '端口号不能为空' }
                              ]">
                  <el-input v-model.number="port.containerPort" type="number" placeholder="端口号" size="small"
                            style="width: 120px; padding-bottom: 16px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-select v-model="port.protocol" placeholder="" size="small" style="width:100px;">
                  <el-option label="tcp" value="tcp"></el-option>
                  <el-option label="udp" value="udp"></el-option>
                </el-select>
              </el-col>
              <el-col :span="2">
                <el-button @click.prevent="removePorts(port)" size="small">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
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
                  <el-input id="protNum" v-if="h.protNumCode" v-model="h.port" property="端口号" size="small"
                            style="width:120px"></el-input>
                  <el-input id="protIndex" v-if="h.portIndexCode" v-model="h.portIndex" property="端口组索引" size="small"
                            style="width:120px"></el-input>
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
            <el-row :gutter="12">
              <el-col :span="7">
                <el-form-item :prop="'environmentVariables.' + index + '.key'"
                              :key="ev.index"
                              :rules="[
                                { required: true, message: '环境变量的 KEY 个数不能为空' },
                                { pattern: /^[^\u4e00-\u9fa5]*$/, message: '环境变量的 KEY 不能包含中文' }
                            ]">
                  <el-input v-model="ev.key" placeholder="key" size="small" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :prop="'environmentVariables.' + index + '.value'"
                              :key="ev.index"
                              :rules="[
                                { required: true, message: '环境变量的 VALUE 个数不能为空' },
                                { pattern: /^[^\u4e00-\u9fa5]*$/, message: '环境变量的 VALUE 不能包含中文' }
                            ]">
                  <el-input v-model="ev.value" placeholder="value" size="small" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button @click.prevent="removeEnvironmentVariable(ev)" size="small">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-row>
            <a @click="addDockerPar" class="cursor-pointer">自定义Docker参数<i class="el-icon-plus"></i></a>
          </el-row>
          <el-form-item
            v-for="(dp, index) in ruleForm.dockerPar" class="margin-left-100" :key="index">
            <el-row :gutter="12">
              <el-col :span="7">
                <el-form-item :prop="'dockerPar.' + index + '.key'"
                              :key="dp.index"
                              :rules="[
                                { required: true, message: 'Docker 参数的 KEY 值不能为空' },
                                { pattern: /^[^\u4e00-\u9fa5]*$/, message: 'Docker 参数的 KEY 值不能包含中文' }
                            ]">
                  <el-input v-model="dp.key" placeholder="key" size="small" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item :prop="'dockerPar.' + index + '.value'"
                              :key="dp.index"
                              :rules="[
                                { required: true, message: 'Docker 参数的 VALUE 值不能为空' },
                                { pattern: /^[^\u4e00-\u9fa5]*$/, message: 'Docker 参数的 VALUE 值不能包含中文' }
                            ]">
                  <el-input v-model="dp.value" placeholder="value" size="small" style="width: 300px;"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button @click.prevent="removeDockerPar(dp)" size="small">删除</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="CMD" style="width: 400px;">
            <el-input v-model="ruleForm.cmd" placeholder="输入需要运行的命令"></el-input>
          </el-form-item>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <br/><br/>
  </div>
</template>
<script>
  // import * as appTypes from '@/store/app/mutations_types'
  import {mapState} from 'vuex'
  import Codemirror from '@/components/jsonEditor/index'
  // import { Notification } from 'element-ui'
  import appConf from '@/common/app'

  export default {
    components: {
      Codemirror
    },
    props: {
      isEdit: {
        type: Boolean,
        default: true
      },
      ruleForm: {
        type: Object
      }
    },
    data () {
      return {
        activeName: 'formModel',
        showCodeMirror: false,
        showForm: ''
      }
    },
    computed: {
      ...mapState({
        node ({node}) {
          // 已选择集群的话，根据集群筛选主机数据
          if (this.ruleForm.vcluster !== null && this.ruleForm.vcluster !== '' && this.ruleForm.vcluster !== undefined) {
            // 循环对比主机的集群信息
            let list = []
            for (let v of node.nodes.nodes) {
              if (v.clusterLable === this.ruleForm.vcluster) {
                list.push(v)
              }
            }
            return list
          }
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
      }
    },
    methods: {
      _removeFormItem (form, item) {
        let index = form.indexOf(item)
        if (index > -1) form.splice(index, 1)
      },
      _addFormItem (form, item) {
        form.push(item)
      },
      handleClick (tab, event) {
        if (tab.name === 'jsonModel') {
          try {
            this.showForm = JSON.stringify(this.transForm(), null, 2)
          } catch (e) {
            throw new Error(`has something wrong with the form`)
          } finally {
            this.showCodeMirror = true
          }
        } else {
          this.showCodeMirror = false
        }
      },
      networkChange () {
        this.removeAllPorts()
        let isBridge = this.ruleForm.network === 'BRIDGE'
        this.ruleForm.dockerProportion = !isBridge
      },
      addPorts () {
        this._addFormItem(this.ruleForm.ports, appConf.formAppend().ports)
      },
      removePorts (item) {
        this._removeFormItem(this.ruleForm.ports, item)
      },
      removeAllPorts () {
        this.ruleForm.ports = []
      },
      addMount () {
        this._addFormItem(this.ruleForm.mounts, appConf.formAppend().mounts)
      },
      removeMount (item) {
        this._removeFormItem(this.ruleForm.mounts, item)
      },
      addEnvironmentVariable () {
        this._addFormItem(this.ruleForm.environmentVariables, appConf.formAppend().environmentVariables)
      },
      removeEnvironmentVariable (item) {
        this._removeFormItem(this.ruleForm.environmentVariables, item)
      },
      addHealth () {
        this._addFormItem(this.ruleForm.health, appConf.formAppend().health)
      },
      removeHealth (item) {
        this._removeFormItem(this.ruleForm.health, item)
      },
      addDockerPar () {
        this._addFormItem(this.ruleForm.dockerPar, appConf.formAppend().dockerPar)
      },
      removeDockerPar (item) {
        this._removeFormItem(this.ruleForm.dockerPar, item)
      },
      healthProtocolChange (healthItem) {
        let isHttp = healthItem.protocol === 'HTTP'
        healthItem.healthHttpCheckBoxCode = isHttp
        healthItem.healthHttpPathCode = isHttp
        healthItem.healthHttpPathText = isHttp
        // healthHttpCheckBoxCode,healthHttpPathCode,healthHttpPathText
        healthItem.ignoreHttp1xx = false
      },
      healthPortTypeChange (healthItem) {
        // 如果选中了端口类型为“端口组索引”
        let isSelFirst = healthItem.portType === '1'
        healthItem.port = undefined // 清空之前填写的端口号
        healthItem.protNumCode = !isSelFirst // “端口号”的input元素隐藏
        healthItem.portNumOrPortIndexText = isSelFirst ? '端口组索引' : '端口号' // 文字显示为端口组索引
        healthItem.portIndexCode = isSelFirst // “端口组索引”的input元素显示
        healthItem.portIndex = undefined//  清空之前填写的“端口组索引”
      },
      // resetForm (formName) {
      //   this.$refs[formName].resetFields()
      // },
      resetForm (formName) {
        return
      },
      vclusterChanger () {
        // 切换集群后清空已选的master
        this.ruleForm.master = undefined
      }
    },
    filters: {
      replaceSprit (value) {
        return value.replace('/', '')
      }
    },
    beforeDestroy () {
      this.resetForm()
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
