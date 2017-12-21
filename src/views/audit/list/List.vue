<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;background:#fff;box-shadow:0 0 20px rgba(0,0,0,.06)">
      <el-form ref="selectForm" :model="selectForm" label-width="80px">
      <el-form-item prop="" style="margin-left: -85px;padding-left:10px" >
        <el-select @change="targettypesGetOptions" v-model="selectForm.targettypes" placeholder="对象类型" style="width: 110px" >
          <el-option v-for="item in getTargettypes" :label="item.key"  :value="item.value" :key="item.value"></el-option>
        </el-select>
        <!-- getOperations -->
        <el-select v-model="selectForm.operations" ref="selects" @change="selectChange" multiple   placeholder="操作类型" style="width: 350px" >
          <el-option v-for="item in getOperations" :label="item.key" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <br/>
        <el-input placeholder="操作人" v-model="selectForm.operateUser" style="width: 110px;margin-top: 5px;"></el-input>
        <!-- style="width: 200px" -->
        <el-date-picker
          v-model="selectForm.timeExtent"
          type="datetimerange"
          :picker-options="pickerOptions2"
          placeholder="选择时间范围"
          :editable="editable"
          align="right" >
        </el-date-picker>
        <el-input placeholder="请求信息（关键字）" v-model="selectForm.rquest" style="width: 150px"></el-input>
        <el-input placeholder="请求结果（关键字）" v-model="selectForm.response" style="width: 150px"></el-input>
        <el-button type="primary" @click="selectFormSubmit('selectForm')">查询</el-button>
      </el-form-item>
    </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="filterAudits" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="expand">
        <template scope="props">
          <el-row>
            <el-col :span="12">
              <h4>请求信息</h4>
              <template v-if="props.row.requestMessage">
              <el-row  v-for="(msg, index) in props.row.requestMessage" :key="index">
                <el-col :span="4">
                  {{index}}
                </el-col>
                <el-col :span="15">
                  <span style="word-break: break-all; word-wrap: break-word">{{msg}}</span>
                </el-col>
              </el-row>
              </template>
            </el-col>
            <el-col :span="12">
              <h4>返回信息</h4>
              <template v-if="props.row.resultMessage">
              <el-row v-for="(msg, index) in props.row.resultMessage" :key="index">
                <el-col :span="5">
                {{ index }}
                </el-col>
                <el-col :span="14">
                  <span style="word-break: break-all; word-wrap: break-word">{{msg}}</span>
                </el-col>
              </el-row>
              </template>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="操作时间"  min-width="65" sortable>
        <template scope="props">
          {{props.row.createdAt | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="对象类型"  min-width="55" sortable :formatter="getOperationChinese" >
      </el-table-column>
      <el-table-column prop="objectType" label="操作类型" sortable :formatter="getobjectTypeChinese" min-width="85" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="65" sortable>
      </el-table-column>
      <el-table-column prop="resultMessage.message" label="请求结果" min-width="85" show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="success" v-showBtn="exportAudits" @click="download('')">导出当页数据</el-button>&nbsp;
      <el-button type="success" v-showBtn="exportAudits" @click="download('all')">导出全部数据</el-button>
      <el-pagination :current-page.sync="currentPage" layout="prev, pager, next" @size-change="sizeChange" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import {LABEL_PREFIX} from '@/config'
  import * as auditType from '../../../store/audit/mutations_types'
  import { Notification } from 'element-ui'
  export default {
    data () {
      return {
        pickerOptions2: {
          shortcuts: [{
            text: '最近一小时',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近30天',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        selectForm: {
          targettypes: '', // 对象类型
          operations: [], // 操作类型
          operationsAll: [], // 全部操作类型
          operateUser: '', // 操作用户
          timeExtent: [], // 时间范围
          starTime: '', // 开始时间
          endTime: '', // 结束时间
          rquest: '', // 请求关键字
          response: '', // 返回关键字
          page: 1, // 当前第几页数据
          size: 10// 每页多少条
        },
        editable: false,
        page: 1, // 默认当前第1页
        pageSize: 10, // 一页显示几条数据
        currentPage: 1, // 每次点击查询按钮都从此页数开始查，默认从第1页开始
        listLoading: false,
        dialogVisible: false,
        prefix: LABEL_PREFIX,
        interval: null
      }
    },
    computed: {
      ...mapState({
        getTargettypes ({ audit }) {
          let targetTypes = []
          for (let v of audit.audit.targettypes) {
            let tem = {}
            switch (v) {
              case 'AccountsController':
                tem['value'] = v
                tem['key'] = '用户'
                targetTypes.push(tem)
                break
              case 'AppController':
                tem['value'] = v
                tem['key'] = '应用'
                targetTypes.push(tem)
                break
              case 'AppGroupController':
                tem['value'] = v
                tem['key'] = '应用组'
                targetTypes.push(tem)
                break
              case 'CatalogsController':
                tem['value'] = v
                tem['key'] = '应用模板'
                targetTypes.push(tem)
                break
              case 'ClusterController':
                tem['value'] = v
                tem['key'] = '集群'
                targetTypes.push(tem)
                break
              case 'DeploymentController':
                tem['value'] = v
                tem['key'] = '部署'
                targetTypes.push(tem)
                break
              case 'ExternalRegistriesController':
                tem['value'] = v
                tem['key'] = '仓库'
                targetTypes.push(tem)
                break
              case 'GroupsController':
                tem['value'] = v
                tem['key'] = '用户组'
                targetTypes.push(tem)
                break
              case 'NodeController':
                tem['value'] = v
                tem['key'] = '主机'
                targetTypes.push(tem)
                break
              case 'QueueController':
                tem['value'] = v
                tem['key'] = '队列'
                targetTypes.push(tem)
                break
              case 'TaskController':
                tem['value'] = v
                tem['key'] = '任务'
                targetTypes.push(tem)
                break
              case 'PolicyController':
                tem['value'] = v
                tem['key'] = '策略'
                targetTypes.push(tem)
                break
              case 'CapabilityController':
                tem['value'] = v
                tem['key'] = '扩缩事件'
                targetTypes.push(tem)
                break
            }
          }
          return targetTypes
        },
        getOperations ({ audit }) {
          return audit.audit.operations
        },
        getAudit ({ audit }) {
          return audit.audit.audit.audits
        },
        total ({ audit }) {
          return audit.audit.audit.total
        }
      }),
      filterAudits: function () {
        // console.log(this.apps.slice((this.page - 1) * this.pageSize, this.page * this.pageSize))
        // 从已有数组中返回元素
/*        console.log('------------------------------------------llllllllllllllllllllllll')
        console.log(this.total)
        console.log(this.getAudit) */
        /*
        if (this.getAudit.length !== 0) {
          return this.getAudit.audits.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
        }
        */
        return this.getAudit
      }
    },
    methods: {
      selectChange (val) {
        this.$refs.selects.visible = false
      },
      // 获取对象类型的汉译
      getOperationChinese (row, clo) {
        let op = this.getTargettypes
        let result = ''

        for (let v of op) {
          if (v.value === row.operation) {
            result = v.key
          }
        }
        return result
      },
      // 获取操作类型的汉译
      getobjectTypeChinese (row, clo) {
        let objType = this.selectForm.operationsAll
        let result = ''
        for (let v of objType) {
          if (v.value === row.objectType) {
            result = v.key
          }
        }
        return result
      },
      handleCurrentChange (val) {
        this.page = val
        // 提交查询
        this.$store.dispatch(auditType.FETCH_AUDIT_SELECT, {param: this.submitPar()})
          .then((data) => { this.queryErrorMsg(data, '查询审计日志失败') })
      },
      sizeChange (val) {
        alert(val)
      },
      submitPar (parm) {
        let par = ``
        // 当前页数和每页数量
        this.selectForm.size = this.pageSize
        this.selectForm.page = this.page
        if (parm === 'all') {
          par += `size=${this.total}&page=${this.selectForm.page}`
        } else {
          par += `size=${this.selectForm.size}&page=${this.selectForm.page}`
        }

        // 时间范围转换
        if (this.selectForm.timeExtent.length !== 0) {
          this.selectForm.starTime = Date.parse(this.selectForm.timeExtent[0]) / 1000
          this.selectForm.endTime = Date.parse(this.selectForm.timeExtent[1]) / 1000
          par += `&beginDate=${this.selectForm.starTime}&endDate=${this.selectForm.endTime}`
        }
        if (this.selectForm.operateUser !== '') { // 操作人
          par += `&operator=${this.selectForm.operateUser}`
        }
        if (this.selectForm.rquest !== '') { // 请求关键字
          par += `&request=${this.selectForm.rquest}`
        }
        if (this.selectForm.response !== '') { // 相应关键字
          par += `&result=${this.selectForm.response}`
        }
        if (this.selectForm.targettypes !== '') { // 对象类型
          par += `&targetTypes=${this.selectForm.targettypes}`
        }
        for (let v of this.selectForm.operations) { // 操作对象
          par += `&operations=${v}`
        }
        return par
      },
      targettypesGetOptions () {
        // 清空操作已选类型重新获取
//        this.selectForm.operations.length = 0
        this.selectForm.operations = []
        // 获取操作类型列表
        this.$store.dispatch(auditType.FETCH_AUDIT_OPERATIONS, {param: 'objType=' + this.selectForm.targettypes})
          .then((data) => { this.queryErrorMsg(data, '获取操作类型列表失败') })
      },
      selectFormSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.currentPage = 1
            // 提交查询
            this.$store.dispatch(auditType.FETCH_AUDIT_SELECT, {param: this.submitPar()})
              .then((data) => { this.queryErrorMsg(data, '查询审计日志失败') })
          }
        })
      },
      download (parm) {
        if (this.getAudit.length < 1) {
          this.$message.error('无数据')
          return false
        }
        //  设置默认时间范围为前一周
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        this.selectForm.timeExtent = [start, end]
        // 发起请求
        let url = window.location.protocol
        if (parm === 'all') {
          url += `/jborg/audits/exportExcel?${this.submitPar('all')}`
        } else {
          url += `/jborg/audits/exportExcel?${this.submitPar('')}`
        }
        let $a = document.createElement('a')
        $a.target = '_blank'
        $a.href = url
        let evt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: false
        })
        $a.dispatchEvent(evt)
//        this.$store.dispatch(auditType.FETCH_AUDIT_DOWNLOAD, {param: this.submitPar()})
//          .then(data => {
//            this.downloadFile('112', data)
//         })
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
    mounted () {
      // 获取对象类型列表
      this.$store.dispatch(auditType.FETCH_AUDIT_TARGETTYPES)
        .then((data) => {
          if (data.resultCode === '00') {
            // 获取操作类型列表
            this.$store.dispatch(auditType.FETCH_AUDIT_OPERATIONS)
              .then((data) => {
                if (data.resultCode === '00') {
                  // 赋值全部操作类型
                  this.selectForm.operationsAll = this.getOperations
                  // 设置查询默认时间范围为前一周
                  const end = new Date()
                  const start = new Date()
                  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                  this.selectForm.timeExtent = [start, end]
                  // 发起查询
                  this.$store.dispatch(auditType.FETCH_AUDIT_SELECT, {param: this.submitPar()})
                    .then((data) => { this.queryErrorMsg(data, '查询审计日志失败') })
                } else {
                  Notification.error({
                    title: '获取操作类型列表失败',
                    message: JSON.stringify(data.message)
                  })
                }
              })
          } else {
            Notification.error({
              title: '获取对象类型列表失败',
              message: JSON.stringify(data.message)
            })
          }
        })
    }
  }
</script>

<style scoped>
</style>
