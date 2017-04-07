<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="应用名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="listApp">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="apps" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="id" label="名称" min-width="200" sortable>
      </el-table-column>
      <el-table-column prop="mode" label="类型" width="100" sortable>
      </el-table-column>
      <el-table-column prop="" label="创建人" width="100" sortable v-if="false">
      </el-table-column>
      <el-table-column prop="" label="所属" width="100" sortable v-if="false">
      </el-table-column>
      <el-table-column prop="labels" label="集群" min-width="150" sortable>
        <template scope="scope">
          {{scope.row.labels[`${LABEL_PREFIX}_VCLUSTER`]}}
        </template>
      </el-table-column>
      <el-table-column prop="instances" label="实例" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="" label="健康状态" min-width="180" sortable>
      </el-table-column>
      <el-table-column prop="updated" label="更新时间" min-width="150" sortable>
        <template scope="scope">
          {{scope.row.updated | moment("YYYY/MM/DD hh:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template scope="scope">
          <el-button type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import { listMyApps } from '../../../api/app'
  import { LABEL_PREFIX } from '../../../config'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        apps: [],
        total: 0,
        page: 1,
        listLoading: false,
        LABEL_PREFIX: LABEL_PREFIX
      }
    },
    computed: {
      ...mapState({
        accountName (state) {
          return state.user.aboutme.userName
        },
        accountId (state) {
          return state.user.aboutme.id
        }
      })
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
        this.listApp()
      },
      //  获取用户列表
      listApp () {
        return listMyApps(this.accountName, this.accountId)
          .then(data => {
            this.apps = data.data
            this.total = this.apps.length
          })
      }
    },
    mounted () {
      this.listLoading = true
      this.listApp()
        .then(() => {
          this.listLoading = false
        })
        .catch(() => {})
    }
  }
</script>

<style scoped>
</style>
