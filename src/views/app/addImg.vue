<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="表单模式" name="formModel">
        <base-form :isEdit='false' :ruleForm="ruleForm">
          <el-form-item label="应用名称" prop="name" style="width: 400px;" slot="appId">
            <el-input v-model="ruleForm.name" :disabled="false"></el-input>
          </el-form-item>
          <el-form-item label="应用组" prop="group" slot="appGroup">
            <el-select v-model="ruleForm.group" :disabled="false" placeholder="请选择应用组">
              <el-option v-for="item in appgroups" :label="item.id | replaceSprit"
                         :value="item.id | replaceSprit" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </base-form>
<!--        <el-form-item>
          <el-button type="primary" @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">添加应用</el-button>
          &lt;!&ndash;<el-button @click="resetForm('ruleForm')">重置</el-button>&ndash;&gt;
        </el-form-item>  -->
      </el-tab-pane>
      <el-tab-pane label="json模式" name="jsonModel">
        <div class="" v-if="showCodeMirror">
          <codemirror
            v-model="showForm">
          </codemirror>
        </div>
        <br/><br/>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <el-button type="primary" @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">添加应用</el-button>
      <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>
import baseForm from './baseForm.vue'
import * as nodeType from '@/store/node/mutations_types'
import * as mutationsType from '@/store/clusters/mutations_types'
import * as userTypes from '../../store/user/mutations_types'
import * as appgroupTypes from '@/store/appgroups/mutations_types'
import * as appTypes from '@/store/app/mutations_types'
import * as ipamType from '@/store/ipam/mutations_types'
import appConf from '@/common/app'
import { Notification } from 'element-ui'
import appUtil from 'utils/app'

export default {
  extends: baseForm,
  components: {
    baseForm
  },
  data () {
    return {
      ruleForm: appConf.ruleForm(),
      rules: appConf.baseFormRule(),
      resultForm: appConf.resultForm()
    }
  },
  methods: {
    cancelForm: function () {
//      this.$router.push({path: '/app/list/apps'})
      this.$router.go(-1)
    },
    transForm () {
      console.log(this.ruleForm)
      console.log(this.resultForm)
      return appUtil.transformFormToJson(this.ruleForm, this.resultForm)
    },
    resetForm () {
      this.$refs['ruleForm'].resetFields()
    },
    submitForm (formName) {
//      console.log('111----2')
//      this.transForm()
//      console.log(JSON.stringify(this.resultForm))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let router = this.$router
          this.transForm()
          if (this.resultForm.container.docker.network === 'BRIDGE') {
            delete this.resultForm.ipAddress
          }
          console.log(JSON.stringify(this.resultForm))
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
    }
  },
  mounted () { // 页面加载完成后回调
    let { dispatch } = this.$store
    // 查询镜像仓库
    dispatch(userTypes.FETCH_REPOS, {})
    // 查询集群
    dispatch(nodeType.FETCH_ALL_NODE, {})
    // 查询主机
    dispatch(mutationsType.FETCH_CLUSTERS, {})
    dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
    dispatch(ipamType.FETCH_NODE_NETWORK)
  }
}
</script>

<style lang="css">
</style>
