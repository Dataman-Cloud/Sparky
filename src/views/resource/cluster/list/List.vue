<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="集群名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="filterClusters" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="clusterLabel" label="名称" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="desc" label="描述" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="groupName" label="组名称" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" min-width="100" sortable>
        <template scope="cluster">
          {{cluster.row.updatedAt | moment("YYYY/MM/DD hh:mm:ss")}}
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
  import * as type from '../../../../store/resource/mutations_types'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        page: 1,
        listLoading: false
      }
    },
    computed: {
      ...mapState({
        clusters (state) {
          return state.resource.cluster.clusters.clusters
        },
        total (state) {
          return state.resource.cluster.clusters.total
        }
      }),
      filterClusters: function () {
        return this.clusters.slice((this.page - 1) * 20, this.page * 20)
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
      },
      //  获取集群列表
      listCluster () {
        return this.$store.dispatch(type.FETCH_CLUSTERS).then(() => {
          this.listLoading = false
        })
      }
    },
    mounted () {
      this.listLoading = true
      this.listCluster()
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
