<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="表单模式" name="formModel">
        <base-form :isEdit='true' :ruleForm="ruleForm">
          <el-form-item label="应用id" prop="name" style="width: 400px;" slot="appId">
            <el-input v-model="ruleForm.name" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="应用组" prop="group" slot="appGroup">
            <el-select v-model="ruleForm.group" :disabled="isEdit" placeholder="请选择应用组">
              <el-option v-for="item in this.appgroups" :label="item.id | replaceSprit"
                         :value="item.id | replaceSprit" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item slot="action">
            <el-button type="primary" @click="submitForm('ruleForm')">更新应用</el-button>
            <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
          </el-form-item>
        </base-form>
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
      <el-button type="primary" @click="submitForm('ruleForm')">更新应用</el-button>
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
import appConf from '@/common/app'
import appUtil from 'utils/app'

// import { Notification } from 'element-ui'

export default {
  extends: baseForm,
  components: {
    baseForm
  },
  data () {
    return {
      rules: appConf.baseFormRule(),
      ruleForm: appConf.ruleForm(),
      resultForm: appConf.resultForm()
    }
  },
  methods: {
    mainRender (appModel) {
      // 封装应用模版信息进行显示
      appUtil.transformJsonToForm(appModel, this.ruleForm)
      console.log(this.ruleForm)
    },
    transForm () {
      appUtil.transformFormToJson(this.ruleForm, this.resultForm)
    },
    resetForm () {
      this.$refs['ruleForm'].resetFields()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.transForm()
          let router = this.$router
          this.$store.dispatch(appTypes.UPDATE_APP, {
            'aid': window.btoa(this.$route.query.aid),
            'params': this.resultForm
          }).then(data => {
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
          return false
        }
      })
    }
  },
  mounted () { // 页面加载完成后回调
    // 查询镜像仓库
    let { dispatch } = this.$store
    dispatch(userTypes.FETCH_REPOS, {})
    // 查询集群
    dispatch(nodeType.FETCH_ALL_NODE, {})
    // 查询主机
    dispatch(mutationsType.FETCH_CLUSTERS, {})
    dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
    if (this.$route.path === '/app/versionAppUpdate') {
      // 查询该版本的应用信息
      dispatch(appTypes.FETCH_APP_VERSION_INFO, {'aid': window.btoa(this.$route.query.aid), 'vid': window.btoa(this.$route.query.vid)})
        .then((data) => {
          if (data.resultCode === '00') {
            this.mainRender(data.data)
          }
        })
    } else {
      dispatch(appTypes.GET_APP, window.btoa(this.$route.query.aid)).then((data) => {
        if (data.resultCode === '00') {
          this.mainRender(data.data.app)
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
