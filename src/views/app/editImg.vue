<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="表单模式" name="formModel">
        <base-form :isEdit='true'>
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
  </el-form>
</template>

<script>
import baseForm from './baseForm.vue'
import * as nodeType from '@/store/node/mutations_types'
import * as mutationsType from '@/store/clusters/mutations_types'
import * as userTypes from '../../store/user/mutations_types'
import * as appgroupTypes from '@/store/appgroups/mutations_types'
import * as appTypes from '@/store/app/mutations_types'

export default {
  extends: baseForm,
  components: {
    baseForm
  },
  mounted () { // 页面加载完成后回调
    console.log('13123123')
    let { dispatch } = this.$store
    // 查询镜像仓库
    dispatch(userTypes.FETCH_REPOS, {})
    // 查询集群
    dispatch(nodeType.FETCH_ALL_NODE, {})
    // 查询主机
    dispatch(mutationsType.FETCH_CLUSTERS, {})
    dispatch(appgroupTypes.FATCH_ALL_APPGROUP)
    dispatch(appTypes.GET_APP, window.btoa(this.$route.query.aid)).then((data) => {
      if (data.resultCode === '00') {
        this.mainRender(data.data.app)
      }
    })
  }
}
</script>

<style lang="css">
</style>
