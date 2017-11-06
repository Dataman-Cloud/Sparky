<template>
  <section>
    <el-row :gutter="22" style="margin-top:20px">
      <el-col :span="16">
        <strong class="title">资源</strong>
        <el-table :data="resouceArr" style="width: 100%;margin-top:20px;margin-bottom:20px;">
          <el-table-column prop="type" label="类型" width="180">
          </el-table-column>
          <el-table-column prop="cpu" label="cpu" width="180">
          </el-table-column>
          <el-table-column prop="mem" label="内存" width="180">
            <template scope="scope">
              {{formatFileSize(scope.row.mem * 1024 * 1024) }}
            </template>
          </el-table-column>
          <el-table-column prop="disk" label="磁盘">
            <template scope="scope">
              {{formatFileSize(scope.row.disk * 1024 * 1024) }}
            </template>
          </el-table-column>
        </el-table>
        <strong class="title">Slave 节点</strong>
        <el-table :data="nodeArr" style="width: 100%;margin-top:20px">
          <el-table-column prop="key" width="180">
          </el-table-column>
          <el-table-column prop="value">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        <strong class="title">任务</strong>
        <el-table :data="taskArr" style="width: 100%;margin-top:20px">
          <el-table-column prop="key" width="180">
          </el-table-column>
          <el-table-column prop="value">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </section>
</template>

<script>
  import { mapState } from 'vuex'
  import * as type from '../../../store/node/mutations_types'
  import * as util from '../../../common/js/util'

  export default {
    data () {
      return {
      }
    },
    computed: {
      ...mapState({
        snapshot (state) {
          return state.node.nodes.metricsSnapshot
        },
        resouceArr (state) {
          let arr = []
          let snapshot = state.node.nodes.metricsSnapshot
          if (!snapshot) {
            return arr
          }
          arr.push({ type: '总数', cpu: parseFloat(snapshot['masterCpusTotal']).toFixed(2), mem: snapshot['masterMemTotal'], disk: snapshot['masterDiskTotal'] })
          arr.push({ type: '使用', cpu: parseFloat(snapshot['masterCpusUsed']).toFixed(2), mem: snapshot['masterMemUsed'], disk: snapshot['masterDiskUsed'] })
          arr.push({ type: '空闲', cpu: parseFloat(snapshot['masterCpusTotal'] - snapshot['masterCpusUsed']).toFixed(2), mem: parseFloat(snapshot['masterMemTotal'] - snapshot['masterMemUsed']).toFixed(2), disk: parseFloat(snapshot['masterDiskTotal'] - snapshot['masterDiskUsed']).toFixed(2) })
          return arr
        },
        nodeArr (state) {
          let arr = []
          let snapshot = state.node.nodes.metricsSnapshot
          if (!snapshot) {
            return arr
          }
          arr.push({ key: 'Activated', value: snapshot['masterSlavesActive'] })
          arr.push({ key: 'Deactivated', value: snapshot['masterSlavesInactive'] })
          return arr
        },
        taskArr (state) {
          let arr = []
          let snapshot = state.node.nodes.metricsSnapshot
          if (!snapshot) {
            return arr
          }
          arr.push({ key: 'Staging', value: snapshot['masterTasksStaging'] })
          arr.push({ key: 'Starting', value: snapshot['masterTasksStarting'] })
          arr.push({ key: 'Running', value: snapshot['masterTasksRunning'] })
          arr.push({ key: 'Killing', value: snapshot['masterTasksKilling'] })
          arr.push({ key: 'Finished', value: snapshot['masterTasksFinished'] })
          arr.push({ key: 'Killed', value: snapshot['masterTasksKilled'] })
          arr.push({ key: 'Failed', value: snapshot['masterTasksFailed'] })
          arr.push({ key: 'Lost', value: snapshot['masterTasksLost'] })
          arr.push({ key: 'Error', value: snapshot['masterTasksError'] })
          return arr
        }
      })
    },
    methods: {
      getSnapshot () {
        return this.$store.dispatch(type.METRICS_SNAPSHOT)
      },
      formatFileSize (size) {
        size = parseFloat(size)
        if (size === 0) {
          return size.toFixed(2) + 'MB'
        }
        return util.renderSize(size)
      }
    },
    mounted () {
      this.getSnapshot()
    }
  }
</script>


<style scoped>
  .title {
    display: block;
    /* margin-top: 10px; */
  }
</style>
