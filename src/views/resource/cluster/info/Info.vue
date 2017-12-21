<template>
  <section>

    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-button type="primary" v-showBtn="delCluster" @click="delCluster">删除集群</el-button>
          <el-button type="primary" v-showBtn="delCluster" @click="getAvailableNodes">添加主机</el-button>
        </el-form-item>

      </el-form>
    </el-col>

    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="集群名称">
        <span>{{cluster.vClusterLabel }}</span>
      </el-form-item>
      <el-form-item label="创建时间">
        <span>{{cluster.createdAt | moment("YYYY/MM/DD hh:mm:ss")}}</span>
      </el-form-item>
      <el-form-item label="创建者">
        <span>{{cluster.createBy }}</span>
      </el-form-item>
      <el-form-item label="所属组">
        <span>{{cluster.groupName }}</span>
      </el-form-item>
      <el-form-item label="更新时间">
        <span>{{cluster.updatedAt | moment("YYYY/MM/DD hh:mm:ss")}}</span>
      </el-form-item>
      <el-form-item label="集群描述">
        <span>{{cluster.description }}</span>
      </el-form-item>
    </el-form>


    <!--列表-->
    <el-table :data="nodes" highlight-current-row style="width: 100%;">
      <el-table-column prop="hostname" label="ip" min-width="150" sortable>
        <template scope="node">
          <router-link :to="{name: '主机信息', query:{nodeIp:node.row.hostName}}">{{node.row.hostName }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="" label="CPU(使用量/总量)" min-width="150" sortable>
        <template scope="node">
          {{node.row.cpuUsed}}/{{node.row.cpuTotal}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="内存(使用量/总量)" min-width="150" sortable>
        <template scope="node">
          {{node.row.memUsed}}M/{{node.row.memTotal}}M
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="注册时间" min-width="150" sortable>
        <template scope="node">
          {{node.row.registeredTime | moment("YYYY/MM/DD hh:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="主机状态" min-width="150" sortable>
        <template scope="node">
          {{node.row.nodeStatus ? '正常' : '异常'}}
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" min-width="100" sortable>
        <template scope="node">
          <el-button type="danger" size="small" v-showBtn="delCluster" @click="delNode(node.$index, node.row)" v-loading.fullscreen.lock="fullscreenLoading">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog
      title="添加主机"
      :visible.sync="dialogVisible"
      size="mini">
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
  import * as type from '../../../../store/clusters/mutations_types'
  import * as nodeType from '../../../../store/node/mutations_types'

  export default {
    data () {
      return {
        interval: null,
        dialogVisible: false,
        checkNodeIps: [],
        availableNodes: [],
        titles: ['可选主机', '已选择主机'],
        fullscreenLoading: false
      }
    },
    computed: {
      ...mapState({
        cluster (state) {
          return state.clusters.clusters.currClusters
        },
        nodes (state) {
          return state.clusters.clusters.currClusters.nodes
        }
      })
    },
    methods: {
      getInfo () {
        console.log(this.$route.query.clusterId)
        this.$store.dispatch(type.CLUSTER_INFO, this.$route.query.clusterId)
      },
      delNode (index, node) {
        let params = {method: 'del', nodeIps: [node.hostName], vClusterId: this.cluster.id}
        console.log(params)
        this.$confirm(`是否删除${node.hostName}`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          // 确定后请求删除接口
      //    this.fullscreenLoading = true
          this.$store.dispatch(type.CHANGE_CLUSTER_NODE, params).then((data) => {
            this.fullscreenLoading = false
            if (data.resultCode === '00') {
              this.$message({
                message: '删除成功',
                type: 'success',
                onClose: this.getInfo()
              })
            } else {
              this.$message({
                message: data.message,
                type: 'error',
                onClose: this.getInfo()
              })
            }
          })
        })
      },
      delCluster () {
        // console.log(this.cluster)
        this.$confirm(`是否删除集群`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          // 确定后请求删除接口
          this.$store.dispatch(type.DEL_CLUSTER, this.cluster.id).then((data) => {
            if (data.resultCode === '00') {
              this.$message({
                message: '删除成功',
                type: 'success',
                onClose: this.goList
              })
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              })
            }
          })
        })
      },
      getAvailableNodes () {
        this.$store.dispatch(nodeType.FETCH_ALL_NODE).then((data) => {
          let availableNodeIps = []
          for (let n of data.data) {
            if ((!n.clusterLable) && n.nodeRole === 'slave') {
              availableNodeIps.push({key: n.hostName, lable: n.hostName})
            }
          }
          // console.log(availableNodeIps)
          this.availableNodes = availableNodeIps
          this.dialogVisible = true
        })
      },
      addNode () {
        if (this.checkNodeIps.length === 0) {
          this.dialogVisible = false
          return
        }
        let params = {method: 'add', nodeIps: this.checkNodeIps, vClusterId: this.cluster.id}
  //      this.fullscreenLoading = true
        this.$store.dispatch(type.CHANGE_CLUSTER_NODE, params).then((data) => {
          this.fullscreenLoading = false
          this.dialogVisible = false
          if (data.resultCode === '00') {
            this.$message({
              message: '添加成功',
              type: 'success',
              onClose: this.getInfo()
            })
          } else {
            this.$message({
              message: data.message,
              type: 'error',
              onClose: this.getInfo()
            })
          }
        })
      },
      goList () {
        this.$router.push('/resource/cluster/list')
      }
    },
    mounted () {
  //    this.interval = setInterval(this.getInfo, 3000)
      this.getInfo()
    }
/*    beforeDestroy: function () {
      clearInterval(this.interval)
    } */
  }
</script>

<style scoped>

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-dialog__body {
    text-align: center;
  }
</style>
