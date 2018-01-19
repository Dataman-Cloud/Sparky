<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :label-position="labelPosition">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="表单模式" name="formModel">
        <base-form :isEdit='true' :ruleForm="ruleForm">
          <el-form-item label="应用名称" prop="name" style="width: 400px;" slot="appId">
            <el-input v-model="ruleForm.name" :disabled="isEdit"></el-input>
          </el-form-item>
          <el-form-item label="应用组" prop="group" slot="appGroup">
            <el-select v-model="ruleForm.group" :disabled="isEdit" placeholder="请选择应用组">
              <el-option v-for="item in this.selfAppGroups" :label="item.id | replaceSprit"
                         :value="item.id | replaceSprit" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </base-form>
        <el-form-item> <!-- slot="action" -->
          <el-button type="primary" @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">更新应用</el-button>
          <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
        </el-form-item>
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
<!--    <el-form-item>
      <el-button type="primary" @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">更新应用</el-button>
      &lt;!&ndash;<el-button @click="resetForm('ruleForm')">重置</el-button>&ndash;&gt;
    </el-form-item> -->
  </el-form>
</template>

<script>
import {mapState, mapActions} from 'vuex'
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
      labelPosition: 'left',
      rules: appConf.baseFormRule(),
      ruleForm: appConf.ruleForm(),
      resultForm: appConf.resultForm()
    }
  },
  computed: {
    ...mapState({
      selfAppGroups (state) {
        return state.appgroups.selfGroups
      }
    })
  },
  methods: {
    ...mapActions({
      fetchSelfAppGroups: appgroupTypes.FATCH_SELF_APPGROUP
    }),
    cancelForm: function () {
      // this.$router.push({path: '/app/list/apps'})
      this.$router.go(-1)
    },
    mainRender (appModel) {
      // 封装应用模版信息进行显示
      appUtil.transformJsonToForm(appModel, this.ruleForm)
    },
    transForm () {
      return appUtil.transformFormToJson(this.ruleForm, this.resultForm)
    },
    resetForm () {
      this.$refs['ruleForm'].resetFields()
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.transForm()
//          console.log(JSON.stringify(this.resultForm))
//          console.log(JSON.stringify(this.resultForm.healthChecks))
//          console.log(JSON.stringify(this.resultForm.healthChecks[0].port))
//          console.log(this.resultForm.healthChecks[0].portIndex)
//          console.log(111)
//          console.log(this.resultForm.container.docker.portMappings.length)
          let portLength = 1
          let portIndex = 0
          if (this.resultForm.healthChecks[0] !== undefined) {
            portIndex = this.resultForm.healthChecks[0].portIndex
            portLength = this.resultForm.container.docker.portMappings.length === 0 ? 1 : this.resultForm.container.docker.portMappings.length
          }
//          console.log('portLength: ' + portLength)
//          console.log('portIndex: ' + portIndex)
          if (portIndex >= portLength || portIndex < 0) {
            this.$message.error('健康检查配置错误：无效的端口组索引号')
          } else {
            let router = this.$router
            this.$store.dispatch(appTypes.UPDATE_APP, {
              'aid': window.btoa(this.$route.query.aid),
              'params': this.resultForm
            }).then(data => {
              if (data.resultCode === '00') {
                this.$message({
                  type: 'success',
                  message: '更新应用中'
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
          }
        } else {
          return false
        }
      })
    }
  },
  mounted () { // 页面加载完成后回调
    // 根据用户名查询应用组
    this.fetchSelfAppGroups()
//    dispatch(appgroupTypes.FATCH_APPGROUP_BY_USERNAME)
    // 查询镜像仓库
    let { dispatch } = this.$store
    dispatch(userTypes.FETCH_REPOS, {})
    // 查询集群
    dispatch(nodeType.FETCH_ALL_NODE, {})
    // 查询主机
    dispatch(mutationsType.FETCH_CLUSTERS, {})
    dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
    if (this.$route.path === '/app/versionAppUpdate') {
//      console.log(1)
      // 查询该版本的应用信息
      dispatch(appTypes.FETCH_APP_VERSION_INFO, {'aid': window.btoa(this.$route.query.aid), 'vid': window.btoa(this.$route.query.vid)})
        .then((data) => {
          if (data.resultCode === '00') {
            this.mainRender(data.data)
          }
        })
    } else {
//      console.log(2)
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
