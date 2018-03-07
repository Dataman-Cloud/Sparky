<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px" class="demo-form-inline" :inline="true"  label-position="left">
        <el-form-item label="应用名" prop="appName" required>
          <el-select v-model="form.appName" placeholder="请选择应用" @change="appValChange">
            <el-option :key="app" v-for="app in apps" :label="app" :value="app"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实例名" prop="taskId">
          <el-select v-model="form.taskId" :disabled="!form.appName"   placeholder="请选择实例">
            <el-option value="" label="全部实例">全部实例</el-option>
            <el-option :key="task" v-for="task in tasks" :label="task.name" :value="task"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="key">
          <el-input v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item label="起始时间" prop="beginTime">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.beginTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间" prop="endTime">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>

        </el-form-item>
      </el-form>
    </el-col>


  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '@/store/log/mutations_types'
  import * as appgroupTypes from '../../../store/appgroups/mutations_types'
  import * as app from '../../../store/app/mutations_types'

  export default {
    data () {
      return {
        apps: [],
        tasks: [],
        form: {
          appName: null,
          taskId: null,
          key: null,
          beginTime: null,
          endTime: null,
          page: 1,
          size: 100
        },
        rules: {
          appName: [
            { required: true, message: '请选择应用' }
          ]
        },
        currPageNum: 1
      }
    },
    computed: {
      ...mapState({
        logs ({ eslogs }) {
          return eslogs.eslogs.logs
        }
      })
    },
    methods: {
      fetchApps () {
        this.$store.dispatch(appgroupTypes.FATCH_ALL_APPGROUP).then((data) => {
          if (data.resultCode === '00') {
            this.apps = []
            for (var app of data.data.apps) {
              this.apps.push(app.id)
            }
            for (var group of data.data.groups) {
              for (var groupApp of group.apps) {
                this.apps.push(groupApp.id)
              }
            }
          }
        })
      },
      fetchAppTasks (appid) {
        // console.log(appid)
        let appIdEncoded = window.btoa(appid)
        this.$store.dispatch(app.FETCH_APP_INFO, appIdEncoded).then((data) => {
          if (data.resultCode === '00') {
            for (var task of data.data.app.tasks) {
              this.tasks.push(task.id)
            }
          }
        })
      },
      appValChange () {
        // console.log(this.form.appName)
        this.form.taskId = ''
        this.tasks = []
        this.fetchAppTasks(this.form.appName)
      },
      onSubmit () {
        this.$store.dispatch(type.FETCH_ESLOG, this.form).then((data) => {
          console.log(data)
        })
      }
    },
    mounted () {
      this.fetchApps()
    }
  }
</script>

<style scoped>
</style>
