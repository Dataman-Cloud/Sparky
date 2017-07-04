<template>
  <section>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left"  label-width="120px" class="demo-ruleForm">
        <el-form-item label="应用名称" prop="app_id">
          <el-select v-model="ruleForm.app_id" placeholder="请选择应用名称" :disabled="updateOrCreate === '立即更新'"
                     @visible-change="appSelectOp(ruleForm.app_id)">
              <el-option v-for="item in appsInfo" :label="item.appId" :key="item.appId"
                         :value="item.appId"></el-option>
          </el-select>
        </el-form-item>
      <el-form-item label="告警规则" required>
          <el-col :span="6">
            <el-form-item  prop="type">
              <el-select v-model="ruleForm.type">
                <el-option label="响应时间" value="响应时间"></el-option>
                <el-option label="F5连接数" value="F5连接数"></el-option>
                <el-option label="CPU使用量" value="CPU使用量"></el-option>
                <el-option label="容器已用内存" value="容器已用内存"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        <el-col class="line" :span="1"></el-col>
          <el-col :span="6">
            <el-form-item prop="operator">
              <el-select v-model="ruleForm.operator" >
                <el-option label="大于" value="大于"></el-option>
                <el-option label="小于" value="小于"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        <el-col class="line" :span="1"></el-col>
          <el-col :span="6">
            <el-form-item  prop="setValue">
              <el-input v-model="ruleForm.setValue" placeholder="设置值" ></el-input>
            </el-form-item>
          </el-col>
      </el-form-item>
      <el-form-item  label="请求路径" prop="requesturi" v-if="ruleForm.type === '响应时间'">
        <el-input v-model="ruleForm.requesturi" placeholder="请求路径http://"></el-input>
      </el-form-item>
      <el-form-item  label="监控周期" prop="monitor_cycle">
        <el-input v-model="ruleForm.monitor_cycle" placeholder="监控周期（秒）"></el-input>
      </el-form-item>
      <el-form-item label="阈值"  prop="threshold">
          <el-input v-model="ruleForm.threshold" placeholder="0"></el-input>
      </el-form-item>
      <el-form-item label="激活"  prop="status">
        <el-switch on-text="" off-text="" v-model="ruleForm.status"></el-switch>
      </el-form-item>
      <el-form-item label="扩缩" prop="action">
        <el-radio-group v-model="ruleForm.action" :disabled="updateOrCreate === '立即更新'">
          <el-radio :label="1">扩</el-radio>
          <el-radio :label="2">缩</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item  label="最小实例个数" v-if="ruleForm.action === 2" prop="min_instance" >
        <el-input v-model="ruleForm.min_instance"></el-input>
      </el-form-item>
      <el-form-item  label="最大实例个数" v-if="ruleForm.action === 1" prop="max_instance" >
        <el-input v-model="ruleForm.max_instance"></el-input>
      </el-form-item>
      <el-form-item  label="步长" prop="step" >
        <el-input v-model="ruleForm.step"></el-input>
      </el-form-item>
      <el-form-item  label="创建时间" prop="created" v-if="false">
        <el-input v-model="ruleForm.created"></el-input>
      </el-form-item>
      <el-form-item  label="更新时间" prop="updated" v-if="false">
        <el-input v-model="ruleForm.updated"></el-input>
      </el-form-item>
      <el-form-item  label="poolname" prop="poolname">
        <el-input v-model="ruleForm.poolname"></el-input>
      </el-form-item>
      <el-form-item  label="用户名" prop="user_name" v-if="false">
        <el-input v-model="ruleForm.user_name"></el-input>
      </el-form-item>
      <el-form-item  label="id" prop="id" v-if="false">
        <el-input v-model="ruleForm.id"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{this.updateOrCreate}}</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import * as policyType from '../../../store/elastic/mutations_types'
  import * as appType from '../../../store/app/mutations_types'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        updateOrCreate: '立即创建',
        ruleForm: {
          id: '',
          app_id: '',
          type: '',
          operator: '',
          setValue: '',
          requesturi: '',
          monitor_cycle: '',
          threshold: '',
          status: false,
          action: '',
          min_instance: 1,
          max_instance: 1,
          step: 1,
          created: '',
          updated: '',
          poolname: '',
          user_name: ''
        },
        rules: {
          app_id: [
            { required: true, message: '请选择应用名称' }
          ],
          type: [
            { required: true, message: '请选择策略类型' }
          ],
          operator: [
            { required: true, message: '请选择逻辑符' }
          ],
          setValue: [
            { required: true, message: '请设置值' }
          ],
          action: [
            { required: true, message: '请选择扩缩状态' }
          ],
          requesturi: [
            { required: true, message: '请求地址必填' }
          ],
          monitor_cycle: [
            { required: true, message: '请填写监控周期' }
          ],
          threshold: [
            { required: true, message: '阈值必填' }
          ],
          min_instance: [
            { required: true, message: '最小实例个数必填' },
            {pattern: /^[0-9]*[1-9][0-9]*$/, message: '最小实例个数只能是正整数', trigger: 'blur'}
          ],
          max_instance: [
            { required: true, message: '最大实例个数必填' },
            {pattern: /^[0-9]*[1-9][0-9]*$/, message: '最大实例个数只能是正整数', trigger: 'blur'}
          ],
          step: [
            { required: true, message: '步长必填' },
            {pattern: /^[0-9]*[1-9][0-9]*$/, message: '步长只能是正整数', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState({
        appsInfo (state) {
          return state.app.apps.appsInfo
        }
      })
    },
    // 页面加载完回调
    mounted () {
      if (this.$route.path === '/elastic/list/editPolicy') {
        this.updateOrCreate = '立即更新'
        // 获取该策略id并查询该id的模版信息
        this.$store.dispatch(policyType.GET_POLICY_INFO, this.$route.query.id)
          .then((data) => {
            if (data.resultCode === '00') {
              // 显示到页面
              this.ruleForm = data.policy
              data.policy.status === 'start' ? this.ruleForm.status = true : this.ruleForm.status = false
            } else {
              Notification.error({
                title: '查询模版信息出错',
                message: JSON.stringify(data.message)
              })
            }
          })
      }
    },
    methods: {
      appSelectOp (appId) {
        // 获取应用部分信息
        this.$store.dispatch(appType.GET_FILTER_APPS)
        this.appsInfo.forEach(function (app) {
          if (app.appId === appId) {
            this.ruleForm.poolname = app.poolName
          }
        }.bind(this))
      },
      onSubmit () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            if (this.updateOrCreate === '立即更新') {
              if (this.ruleForm.status === true) {
                this.ruleForm.status = 'start'
              } else {
                this.ruleForm.status = 'disable'
              }
              // 更新操作
              this.$store.dispatch(policyType.UPDATE_POLICY, this.ruleForm).then(() => {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.$router.push({path: '/elastic/list/policies'})
              })
            } else if (this.updateOrCreate === '立即创建') {
              //  创建操作
              if (this.ruleForm.max_instance > 0 && this.ruleForm.action === 1) {
                this.ruleForm.min_instance = 0
                if (this.ruleForm.status === true) {
                  this.ruleForm.status = 'start'
                } else {
                  this.ruleForm.status = 'disable'
                }
                this.$store.dispatch(policyType.ADD_POLICY, this.ruleForm).then(() => {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/elastic/list/policies'})
                })
              } else if (this.ruleForm.min_instance > 0 && this.ruleForm.action === 2) {
                this.ruleForm.max_instance = 0
                this.$store.dispatch(policyType.ADD_POLICY, this.ruleForm).then(() => {
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                  this.$router.push({path: '/elastic/list/policies'})
                })
              }
            } else {
              console.log('error submit!!')
              return false
            }
          }
        })
      },
      onCancel () {
        this.$router.push({path: '/elastic/list/policies'})
      }
    }
  }
</script>

<style></style>
