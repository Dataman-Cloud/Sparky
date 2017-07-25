<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="集群名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-showBtn="addCluster" @click="openAddCluster">新增集群</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-col :span="24">
      <el-table :data="filterClusters" highlight-current-row v-loading="listLoading">
        <el-table-column prop="clusterLabel" label="名称" min-width="100" sortable>
          <template scope="cluster">
            <router-link :to="{name: '集群信息', query:{clusterId:cluster.row.id}}">
              {{cluster.row.vClusterLabel }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="100" sortable>
        </el-table-column>
        <el-table-column prop="groupName" label="组名称" min-width="100" sortable>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" min-width="100" sortable>
          <template scope="cluster">
            {{cluster.row.updatedAt | moment("YYYY/MM/DD hh:mm:ss")}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" min-width="200" sortable>
          <template scope="cluster">
            <el-button type="info" size="small" v-showBtn="addNode"  @click="openBox(cluster.row)">添加主机</el-button>
            <el-button type="danger" size="small" v-showBtn="delNode"  @click="delCluster(cluster.row)">删除集群</el-button>
          </template>

        </el-table-column>
      </el-table>
    </el-col>


    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>


    <el-dialog
      title="添加主机"
      :visible.sync="dialogVisible"
      size="small"
      :before-close="handleClose">
      <el-transfer v-model="checkNodeIps" :data="availableNodes" :titles="titles"></el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNode" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '@/store/clusters/mutations_types'
  import * as nodeType from '@/store/node/mutations_types'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        page: 1,
        listLoading: false,
        dialogVisible: false,
        checkNodeIps: [],
        availableNodes: [],
        titles: ['可选主机', '已选择主机'],
        vClusterId: null,
        fullscreenLoading: false
      }
    },
    computed: {
      ...mapState({
        clusters ({ clusters }) {
          return clusters.clusters.clusters
        },
        total ({ clusters }) {
          return clusters.clusters.total
        }
      }),
      filterClusters () {
        if (this.clusters) {
          // 先写了一个filter， TODO 异步，后端分页
          if (this.filters && this.filters.name) {
            return this.clusters.filter((cluster) => {
              let reg = new RegExp(this.filters.name)
              return reg.test(cluster.vClusterLabel)
            })
          }
          return this.clusters.slice((this.page - 1) * 20, this.page * 20)
        }
        return null
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
      },
      // 打开添加集群
      openAddCluster () {
        this.$router.push({name: '添加集群'})
      },
      // 删除集群
      delCluster (cluster) {
        this.$store.dispatch(type.DEL_CLUSTER, cluster.id).then((data) => {
          if (data.resultCode === '00') {
            this.$message({
              message: '添加成功',
              type: 'success',
              onClose: this.listCluster
            })
          } else {
            this.$message({
              message: data.message,
              type: 'error'
            })
          }
        })
      },
      // 打开添加主机
      openBox (cluster) {
        this.$store.dispatch(nodeType.FETCH_ALL_NODE).then((data) => {
          let availableNodeIps = []
          for (let n of data.data) {
            if ((!n.clusterLable) && n.nodeRole === 'slave') {
              availableNodeIps.push({key: n.hostName, lable: n.hostName})
            }
          }
          this.vClusterId = cluster.id
          this.availableNodes = availableNodeIps
          this.dialogVisible = true
        })
      },
      // 添加主机
      addNode () {
        if (this.checkNodeIps.length === 0) {
          this.dialogVisible = false
          return
        }
        let params = {method: 'add', nodeIps: this.checkNodeIps, vClusterId: this.vClusterId}
        this.fullscreenLoading = true
        this.$store.dispatch(type.CHANGE_CLUSTER_NODE, params).then((data) => {
          this.fullscreenLoading = false
          this.dialogVisible = false
          if (data.resultCode === '00') {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: data.message,
              type: 'error'
            })
          }
        })
      },
      handleClose () {
        this.dialogVisible = false
      }
    },
    mounted () {
      this.listLoading = true
      this.listCluster()
        .then(() => {
          this.listLoading = false
        })
     //  this.interval = setInterval(() => this.listCluster(), 5000)
    },
    beforeDestroy: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
</style>
