<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="主机名称" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="">查询</el-button>
        </el-form-item>

      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="filterNodes" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="ip" label="ip" min-width="100" sortable>
        <template scope="node">
          <router-link :to="{path: '/resource/node/info', query:{nodeIp: node.row.nodeIp }}">{{node.row.nodeIp }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="nodeRole" label="角色" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="nodeStatus" label="主机状态" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="clusterLable" label="所属集群" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="mesosVersion" label="mesos版本" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="registeredTime" label="创建时间" min-width="100" sortable>
        <template scope="node">
          {{node.row.registeredTime | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>

    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../../store/node/mutations_types'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        page: 1,
        listLoading: false,
        interval: null
      }
    },
    computed: {
      ...mapState({
        nodes (state) {
          return state.node.nodes.nodes
        },
        total (state) {
          return state.node.nodes.total
        }
      }),
      filterNodes: function () {
        if (this.nodes) {
          if (this.filters && this.filters.name) {
            return this.nodes.filter((node) => {
              let reg = new RegExp(this.filters.name)
              return reg.test(node.nodeIp)
            })
          }
          return this.nodes.slice((this.page - 1) * 20, this.page * 20)
        }
        return null
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
      },
      //  获取主机列表
      listNodes () {
        return this.$store.dispatch(type.FETCH_ALL_NODE).then(() => {
          this.listLoading = false
        })
      }
    },
    mounted () {
      this.listLoading = true
      this.listNodes()
        .then(() => {
          this.listLoading = false
        })
      this.interval = setInterval(() => this.listCluster(), 5000)
    },
    beforeDestroy: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
</style>
