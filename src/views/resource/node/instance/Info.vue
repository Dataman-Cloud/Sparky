<template>
  <section>
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="容器名称">
        <span>{{instance.Name }} <el-tag type="primary" v-if="instance.State !== undefined">{{instance.State.Status }} </el-tag></span>
      </el-form-item>
      <el-form-item label="创建时间">
        <span>{{instance.Created | moment("YYYY/MM/DD hh:mm:ss") }}</span>
      </el-form-item>
      <el-form-item label="驱动">
        <span>{{instance.Driver }}</span>
      </el-form-item>
      <el-form-item label="主机名称">
        <span v-if="instance.Config !== undefined">{{instance.Config.Hostname }}</span>
      </el-form-item>
      <el-form-item label="网络模式">
        <span v-if="instance.HostConfig !== undefined">{{instance.HostConfig.NetworkMode }}</span>
      </el-form-item>
    </el-form>


    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基础信息" name="tab1">
        <el-form label-position="right" inline class="demo-table-expand">
          <el-form-item label="镜像名称" v-bind:style="bigLable">
            <span v-if="instance.Config !== undefined"  class="contest">{{instance.Config.Image }}</span>
          </el-form-item>
          <el-form-item label="摘要" v-bind:style="bigLable">
            <span  class="contest">{{instance.Image }}</span>
          </el-form-item>
          <el-form-item label="容器主机名" v-bind:style="bigLable">
            <span  class="contest">{{instance.Config.Hostname }}</span>
          </el-form-item>
          <el-form-item label="网络模式" v-bind:style="bigLable">
            <span  class="contest">{{instance.HostConfig.NetworkMode }}</span>
          </el-form-item>
          <el-form-item label="hostname 文件" v-bind:style="bigLable">
            <span  class="contest">{{instance.HostnamePath }}</span>
          </el-form-item>
          <el-form-item label="hosts 文件" v-bind:style="bigLable">
            <span  class="contest">{{instance.HostsPath }}</span>
          </el-form-item>
          <el-form-item label="log 文件" v-bind:style="bigLable">
            <span  class="contest">{{instance.LogPath }}</span>
          </el-form-item>
          <el-form-item label="resolv.conf 文件" v-bind:style="bigLable">
            <span  class="contest">{{instance.ResolvConfPath }}</span>
          </el-form-item>
        </el-form>


        <!--        <el-col :span="24" class="breadcrumb-container">
                  <strong class="title">环境变量</strong>
                </el-col>
                <el-table :data="envarr" highlight-current-row style="width: 100%;">
                  <el-table-column label="key" prop="key" sortable>
                  </el-table-column>
                  <el-table-column prop="value" label="value" sortable>
                  </el-table-column>
                </el-table> -->
      </el-tab-pane>
      <el-tab-pane label="容器日志" name="tab2" id="logTab">
        <div id="logdiv">
        </div>
      </el-tab-pane>
      <el-tab-pane label="容器监控" name="tab3" id="stateTab">
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="cpuMonitor" class="monitorDiv"></div>
          </el-col>
          <el-col :span="12">
            <div id="memoryMonitor" class="monitorDiv"></div>
          </el-col>
          <el-col :span="12">
            <div id="netMonitor" class="monitorDiv"></div>
          </el-col>
          <el-col :span="12">
            <div id="diskMonitor" class="monitorDiv"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="终端" name="tab4" id="terminalTab">
        <terminal :instanceId="instanceId" :nodeIp="nodeIp" v-if="showTerminalTab"></terminal>
      </el-tab-pane>

    </el-tabs>


  </section>
</template>


<script>
  /* eslint-disable quotes */
  import {mapState} from 'vuex'
  import * as type from '../../../../store/node/mutations_types'
  import * as util from '../../../../common/js/util'
  import * as api from '../../../../api/nodes'
  import Terminal from '@/components/terminal/terminal'

  // var echarts = require('echarts')
  const echarts = require('echarts/lib/echarts')

  require('echarts/lib/chart/line')
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/toolbox')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')

  export default {
    components: {
      Terminal
    },
    data () {
      return {
        showTerminalTab: false,
        instanceId: this.$route.query.instanceId,
        nodeIp: this.$route.query.nodeIp,
        smallLable: { width: '20%' },
        bigLable: { width: '80%' },
        activeName: 'tab1',
        currsse: null,
        cpuChart: null,
        memoryChart: null,
        netChart: null,
        diskChart: null,
        date: [],
        cpuData: [],
        memoryData: [],
        netReceivesData: [],
        netSendsData: [],
        diskReadsData: [],
        diskWritesData: [],
        preState: null,
        maxSize: 60
      }
    },
    computed: {
      ...mapState({
        instance (state) {
          return state.node.nodes.currInstance
        },
        envarr (state) {
          let arr = []
          if (state.node.nodes.currInstance.Config !== undefined) {
            for (var env of state.node.nodes.currInstance.Config.Env) {
              var temp = env.split('=')
              arr.push({key: temp[0], value: temp[1]})
            }
          }
          return arr
        }
      })
    },
    methods: {
      getInstance () {
        let param = {nodeIp: this.$route.query.nodeIp, instanceId: this.$route.query.instanceId}
        // console.log(param)
        return this.$store.dispatch(type.FETCH_NODE_INSTANCE_INFO, param)
      },
      formatFileSize (size) {
        return util.renderSize(size)
      },
      handleClick (tab) {
        this.closeSse()
        switch (tab.$el.id) {
          case 'logTab' :
            this.showLog(tab)
            break
          case 'stateTab' :
            this.showState(tab)
            break
          case 'terminalTab' :
            this.showTerminal(tab)
            break
        }
      },
      showLog (tab) {
        let param = {nodeIp: this.$route.query.nodeIp, instanceId: this.$route.query.instanceId}
        this.currsse = api.nodeInstanceLogs(param)
        // this.currsse = api.nodeInstanceLogsWS(param)
        this.currsse.onopen = function (event) {
          console.log('连接成功')
        }
        this.currsse.addEventListener('container-logs', function (event) {
          let logdiv = document.getElementById("logdiv")
          let p = document.createElement("p")
          p.innerHTML = event.data
          logdiv.appendChild(p)
          logdiv.scrollTop = logdiv.scrollHeight - 350
        }, false)
//        this.currsse.onmessage = function (event) {
//          let logdiv = document.getElementById("logdiv")
//          let p = document.createElement("p")
//          p.innerHTML = event.data
//          logdiv.appendChild(p)
//          logdiv.scrollTop = logdiv.scrollHeight - 350
//        }
        this.currsse.onerror = function (event) {
          console.log('连接失败')
        }
      },
      showState (tab) {
        let self = this
        let param = {nodeIp: this.$route.query.nodeIp, instanceId: this.$route.query.instanceId}
        self.initMonitor()
        this.currsse = api.nodeInstanceStats(param)
        this.currsse.onopen = function (event) {
          console.log('连接成功')
        }
        this.currsse.onerror = function (event) {
          console.log('连接失败')
        }
        this.currsse.addEventListener('container-states', function (event) {
          let data = JSON.parse(event.data)
          data.read = new Date().getTime()
          // console.log(event.data)
          if (!this.preState) {
            this.preState = data
            return // 第一次数据不处理
          }
          self.pushData(data, this.preState)
          this.preState = data // 保存上一次数据
        })
      },
      showTerminal (tab) {
        this.showTerminalTab = true
        console.log('terminal')
      },
      closeSse () {
        if (this.currsse) {
          this.currsse.close()
          console.log('sse close')
          this.currsse = null
        }
      },
      getNowTime () {
        let nowTime = new Date()
        let s = nowTime.getSeconds()
        let m = nowTime.getMinutes()
        let h = nowTime.getHours()
        return `${h}:${m}:${s}`
      },
      initMonitor () {
        if (this.cpuChart) {
          this.date = []
          this.cpuData = []
          this.memoryData = []
          this.netSendsData = []
          this.netReceivesData = []
          this.diskReadsData = []
          this.diskWritesData = []
          return
        }
        let cpuMonitor = document.getElementById('cpuMonitor')
        this.cpuChart = echarts.init(cpuMonitor, null, {width: 500, height: 300})
        this.cpuChart.setOption({
          title: { text: 'CPU 使用率' },
          // tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c}' },
          xAxis: {
            type: 'category', boundaryGap: false, name: '时间', data: []
          },
          yAxis: {
            boundaryGap: [0, '50%'], type: 'value', name: 'CPU 使用率%'
          },
          series: [ { name: 'cpu', type: 'line', data: [] } ]
        })
        let memoryMonitor = document.getElementById('memoryMonitor')
        this.memoryChart = echarts.init(memoryMonitor, null, {width: 500, height: 300})
        this.memoryChart.setOption({
          title: { text: '内存使用率' },
          xAxis: {
            type: 'category', boundaryGap: false, name: '时间', data: []
          },
          yAxis: {
            boundaryGap: [0, '50%'], type: 'value', name: '内存使用率%'
          },
          series: [ { name: 'memory', type: 'line', data: [] } ]
        })
        let netMonitor = document.getElementById('netMonitor')
        this.netChart = echarts.init(netMonitor, null, {width: 500, height: 300})
        this.netChart.setOption({
          title: { text: '网络接收/发送速率' },
          legend: { left: 'right', data: ['网络发送速率', '网络接收速率'] },
          xAxis: {
            type: 'category', boundaryGap: false, name: '时间', data: []
          },
          yAxis: {
            boundaryGap: [0, '50%'], type: 'value', name: '速率B/s'
          },
          series: [
            { name: '网络发送速率', type: 'line', data: [] },
            { name: '网络接收速率', type: 'line', data: [] }
          ]
        })
        let diskMonitor = document.getElementById('diskMonitor')
        this.diskChart = echarts.init(diskMonitor, null, {width: 500, height: 300})
        this.diskChart.setOption({
          title: { text: '磁盘读/写速率' },
          legend: { left: 'right', data: ['磁盘读速率', '磁盘写速率'] },
          xAxis: {
            type: 'category', boundaryGap: false, name: '时间', data: []
          },
          yAxis: {
            boundaryGap: [0, '50%'], type: 'value', name: '速率B/s'
          },
          series: [
            { name: '磁盘读速率', type: 'line', data: [] },
            { name: '磁盘写速率', type: 'line', data: [] }
          ]
        })
      },
      pushData (data, predata) {
        // let stats = data.Stats
        let stats = data
        if (this.date.length >= this.maxSize) {
          this.date.shift()
          this.cpuData.shift()
          this.memoryData.shift()
          this.netSendsData.shift()
          this.netReceivesData.shift()
          this.diskReadsData.shift()
          this.diskWritesData.shift()
        }
        this.calcData(stats, predata)
        this.date.push(this.getNowTime())
        this.cpuData.push(this.getCpuUsageRate(stats, predata))
        this.memoryData.push(this.getMemoryRate(stats))
        this.netSendsData.push(data.SendRate)
        this.netReceivesData.push(data.ReceiveRate)
        this.diskReadsData.push(data.BlkIOReadRate)
        this.diskWritesData.push(data.BlkIOWriteRate)
        this.cpuChart.setOption({
          xAxis: { data: this.date },
          series: [{ name: 'cpu', data: this.cpuData }]
        })
        this.memoryChart.setOption({
          xAxis: { data: this.date },
          series: [{ name: 'memory', data: this.memoryData }]
        })
        this.netChart.setOption({
          xAxis: { data: this.date },
          series: [
            { name: '网络发送速率', type: 'line', data: this.netSendsData },
            { name: '网络接收速率', type: 'line', data: this.netReceivesData }
          ]
        })
        this.diskChart.setOption({
          xAxis: { data: this.date },
          series: [
            { name: '磁盘读速率', type: 'line', data: this.diskReadsData },
            { name: '磁盘写速率', type: 'line', data: this.diskWritesData }
          ]
        })
      },
      // cpu使用计算
      getCpuUsageRate (data, predata) {
        var cpuPercent = 0
        var cpuDelta = data.cpuStats.cpu_usage.total_usage - predata.cpuStats.cpu_usage.total_usage
        var systemDelta = data.cpuStats.system_cpu_usage - predata.cpuStats.system_cpu_usage
        if (systemDelta > 0 && cpuDelta > 0) {
          cpuPercent = (cpuDelta / systemDelta) * data.cpuStats.cpu_usage.percpu_usage.length * 100
        }
        return cpuPercent
      },
      // 内存使用计算
      getMemoryRate (data) {
        return data.memoryStats.usage / data.memoryStats.limit * 100
      },
      // 计算 网络收发 和磁盘读写
      calcData (data, predata) {
        var lReadTotal = 0
        var lWriteTotal = 0
        var readTotal = 0
        var writeTotal = 0
        var rLastTotal = 0
        var sLastTotal = 0
        var rCurentTotal = 0
        var sCurentTotal = 0
        var intervaltime = data.read - predata.read
        for (let i in data.blkioStats.io_service_bytes_recursive) {
          let ob = data.blkioStats.io_service_bytes_recursive[i]
          if (ob.op === 'Read') {
            lReadTotal += ob.value
          }
          if (ob.op === 'Write') {
            lWriteTotal += ob.value
          }
        }
        for (let i in predata.blkioStats.io_service_bytes_recursive) {
          let ob = predata.blkioStats.io_service_bytes_recursive[i]
          if (ob.op === 'Read') {
            readTotal += ob.value
          }
          if (ob.op === 'Write') {
            writeTotal += ob.value
          }
        }
        data.BlkIOReadRate = (lReadTotal - readTotal) / intervaltime
        data.BlkIOWriteRate = (lWriteTotal - writeTotal) / intervaltime

        for (let i in data.networks) {
          let ob = data.networks[i]
          rCurentTotal += ob.RxBytes
          sCurentTotal += ob.TxBytes
        }
        for (let i in predata.networks) {
          let ob = data.networks[i]
          rLastTotal += ob.RxBytes
          sLastTotal += ob.TxBytes
        }
        data.ReceiveRate = (rCurentTotal - rLastTotal) / intervaltime
        data.SendRate = (sCurentTotal - sLastTotal) / intervaltime
        // console.log(data.BlkIOReadRate, data.BlkIOWriteRate)
      }
    },
    mounted () {
      this.getInstance()
    },
    destroyed () {
      this.closeSse()
    }
  }
</script>


<style scoped>
  .contest {
    margin-left: 40px;
  }
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

  .breadcrumb-container {
    height: 34px;
  }

  #logdiv {
    width: 100%;
    height: 350px;
    background-color: black;
    color: white;
    padding: 5px 10px;
    overflow-y: scroll;
  }
  #terminaldiv{
    width: 100%;
    height: 350px;
    background-color: black;
    color: white;
    padding: 5px 10px;
    overflow-y: scroll;
  }

  .monitorDiv {
    width: 500px;
    height: 300px;
  }

</style>
