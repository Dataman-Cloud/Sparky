<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :label-position="labelPosition">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="表单模式" name="formModel">
        <base-form :isEdit='false' :ruleForm="ruleForm">
          <el-form-item label="应用名称" prop="name" style="width: 400px;" slot="appId">
            <el-input v-model="ruleForm.name" :disabled="false"></el-input>
          </el-form-item>
          <el-form-item label="应用组" prop="group" slot="appGroup">
            <el-select v-model="ruleForm.group" :disabled="false" placeholder="请选择应用组">
              <el-option v-for="item in selfAppGroups" :label="item.id | replaceSprit"
                         :value="item.id | replaceSprit" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </base-form>
        <el-form-item>
          <el-button type="primary" @click="cancelForm">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
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
      <el-button type="primary" @click="submitForm('ruleForm')">添加应用</el-button>
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
// import * as appgroups from '../../store/appgroups/mutations_types'
import * as appTypes from '@/store/app/mutations_types'
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
      labelPosition: 'left',
      ruleForm: appConf.ruleForm(),
      rules: appConf.baseFormRule(),
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
//      this.$router.push({path: '/app/list/apps'})
      this.$router.go(-1)
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
          let router = this.$router
          this.transForm()
          let portLength = 1
          let portIndex = 0
          if (this.resultForm.healthChecks[0] !== undefined) {
            portIndex = this.resultForm.healthChecks[0].portIndex
            portLength = this.resultForm.container.docker.portMappings.length === 0 ? 1 : this.resultForm.container.docker.portMappings.length
          }
          if (portIndex >= portLength || portIndex < 0) {
            this.$message.error('健康检查配置错误：无效的端口组索引号')
          } else {
            this.$store.dispatch(appTypes.ADD_APP, this.resultForm).then((data) => {
              if (data.resultCode === '00') {
                this.$message({
                  type: 'success',
                  message: '发布应用中'
                })
                router.push({name: '我的应用'})
              } else {
                Notification({
                  title: '创建应用出错',
                  message: JSON.stringify(data.message),
                  type: 'error'
                })
              }
            })
          }
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
    // 根据用户名查询应用组
    this.fetchSelfAppGroups()
//    dispatch(appgroups.FATCH_APPGROUP_BY_USERNAME)
  }
}
</script>

<style lang="css">
</style>
