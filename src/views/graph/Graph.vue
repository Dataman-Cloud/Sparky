<template>
  <section>
<!--
    <el-row class="margin-bottom-20" style="margin-top: 20px;">
      <el-button type="primary" icon="plus" @click="" size="big">陆家嘴DC</el-button>
      <el-button type="primary" icon="plus" @click="" size="big">外高桥DC</el-button>
      <el-button type="primary" icon="plus" @click="" size="big">异地DC</el-button>
    </el-row>
-->

    <el-row class="margin-bottom-20" style="margin-top: 20px;">
      <span class="platNum">集群： {{graphInfo.platformResource.clusterNum}}</span><span class="platNum">主机数： {{graphInfo.platformResource.hostNum}}</span>
      <span class="platNum">应用组： {{graphInfo.platformResource.appGroupNum}}</span>
      <span class="platNum">应用： {{graphInfo.platformResource.appNum}}</span><span class="platNum">容器： {{graphInfo.platformResource.containerNum}}</span>
    </el-row>

    <el-row :gutter="20">
      <div>
        <el-col :span="12">
          <div id="cpuUsage" style="height: 350px"></div>
        </el-col>
        <el-col :span="12">
          <div id="memUsage" style="height: 350px"></div>
        </el-col>
      </div>
    </el-row>

    <el-row :gutter="20" style="background: #E5E9F2; ; border-radius: 15px;">
      <div style="background: #D3DCE6"><span class="fontStyle"><strong>主机</strong></span></div>
      <div>
        <el-col :span="12">
          <div id="hostRec" class="monitorDiv"></div>
        </el-col>
        <el-col :span="12">
          <div id="hostMemRec" class="monitorDiv"></div>
        </el-col>
      </div>
    </el-row>

    <el-row :gutter="20">
      <span class="fontStyle"><strong>应用组</strong></span>
      <div>
        <el-col :span="12">
          <div id="appRec" class="monitorDiv" style="left: 100px;"></div>
        </el-col>
        <el-col :span="12">
          <div id="appMemRec" class="monitorDiv" style="left: 100px;"></div>
        </el-col>
      </div>
    </el-row>

    <el-row :gutter="20" style="background: #E5E9F2; ; border-radius: 15px;">
      <div style="background: #D3DCE6"><span class="fontStyle"><strong>应用</strong></span></div>
      <div>
        <el-col :span="12">
          <div id="cpuRec" class="monitorDiv"></div>
        </el-col>
        <el-col :span="12">
          <div id="memRec" class="monitorDiv"></div>
        </el-col>
      </div>
    </el-row>

  </section>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import * as type from '../../store/graph/mutations_types'

  const echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/chart/bar')
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/toolbox')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')

  export default {
    data () {
      return {
        cpuChart: null,
        memoryChart: null,
        hostChart: null,
        hostMemChart: null,
        appGroupChart: null,
        appGroupMemChart: null,
        cpuTopTenChart: null,
        memTopTenChart: null,
        activeName: 'first'
      }
    },
    watch: {
      graphInfo () {
        this.showPlat()
        this.showHost()
        this.showAppGroup()
        this.showCpuTopTen()
        this.showMemTopTen()
      }
    },
    computed: {
      ...mapState({
        graphInfo (state) {
          return state.graph.graphInfo
        }
      })
    },
    methods: {
      ...mapActions({
        fetchGraph: type.FETCH_GRAPH
      }),
      showPlat () {
        let cpuUsage = document.getElementById('cpuUsage')
        this.cpuChart = echarts.init(cpuUsage, null, {width: 500, height: 300})
        let option = {
          title: {text: 'CPU 使用率', x: 'center'},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {d}%'
          },
          legend: {},
          series: [{
            name: 'cpu使用',
            type: 'pie',
            data: [
              {value: 25, name: '已使用量'},
              {value: 75, name: '未使用量'}
            ]
          }],
          color: ['#61a0a8', '#d48265']
        }
        if (this.graphInfo && this.graphInfo.platformResource) {
          option.series[0].data = [
            {value: (this.graphInfo.platformResource.cpuUtilizationRate) * 100, name: '已使用量'},
            {value: (1 - this.graphInfo.platformResource.cpuUtilizationRate) * 100, name: '未使用量'}
          ]
        }
        this.cpuChart.setOption(option)
        let memUsage = document.getElementById('memUsage')
        this.memoryChart = echarts.init(memUsage, null, {width: 500, height: 300})
        let memOption = {
          title: {text: '内存使用率', x: 'center'},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {},
          series: [{
            name: '内存使用',
            type: 'pie',
            data: [
              {value: 25, name: '已使用量'},
              {value: 75, name: '未使用量'}
            ]
          }],
          color: ['#61a0a8', '#d48265']
        }
        if (this.graphInfo && this.graphInfo.platformResource) {
          memOption.series[0].data = [
            {value: this.graphInfo.platformResource.memUsed, name: '已使用量'},
            {value: this.graphInfo.platformResource.memTotal - this.graphInfo.platformResource.memUsed, name: '未使用量'}
          ]
        }
        this.memoryChart.setOption(memOption)
      },
      showHost () {
        let hostRec = document.getElementById('hostRec')
        this.hostChart = echarts.init(hostRec, null, {width: 500, height: 400})
        let hostOption = {
          title: {text: 'CPU使用情况(核)', x: 'center'},
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                interval: 0,
                rotate: 40
              },
              data: ['192.168.11.11', '192.168.11.12', '192.168.11.13', '192.168.11.14']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [{
            name: 'CPU',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2]
          }],
          color: ['#d48265']
        }
        if (this.graphInfo && this.graphInfo.hostResources && Array.isArray(this.graphInfo.hostResources) && this.graphInfo.hostResources.length > 0) {
          let host = this.graphInfo.hostResources
          let hostIp = hostOption.xAxis[0].data = []
          let cpuData = hostOption.series[0].data = []
          for (let h of host) {
            hostIp.push(h.ip)
            cpuData.push(h.cpuUsed)
          }
        }
        this.hostChart.setOption(hostOption)
        let hostMemRec = document.getElementById('hostMemRec')
        this.hostMemChart = echarts.init(hostMemRec, null, {width: 500, height: 400})
        let hostMemOption = {
          title: {text: ' 内存使用情况(GB)', x: 'center'},
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                interval: 0,
                rotate: 40
              },
              data: ['192.168.11.11', '192.168.11.12', '192.168.11.13', '192.168.11.14']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [{
            name: '内存',
            type: 'bar',
            data: [2.6, 7.0, 9.5, 28.2]
          }],
          color: ['#61a0a8']
        }
        if (this.graphInfo && this.graphInfo.hostResources && Array.isArray(this.graphInfo.hostResources) && this.graphInfo.hostResources.length > 0) {
          let host = this.graphInfo.hostResources
          let hostIp = hostMemOption.xAxis[0].data = []
          let memData = hostMemOption.series[0].data = []
          for (let h of host) {
            hostIp.push(h.ip)
            memData.push(h.memUsed)
          }
        }
        this.hostMemChart.setOption(hostMemOption)
      },
      showAppGroup () {
        let appRec = document.getElementById('appRec')
        this.appGroupChart = echarts.init(appRec, null, {width: 500, height: 400})
        let appOption = {
          title: {text: 'CPU使用情况', x: 'center'},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {},
          series: [{
            name: 'CPU使用',
            type: 'pie',
            radius: [20, 110],
            center: ['25%', 200],
            roseType: 'radius',
            width: '50%',
            itemStyle: {
              normal: {
                label: {
                  show: true
                },
                labelLine: {
                  show: true
                }
              },
              emphasis: {
                label: {
                  show: true
                },
                labelLine: {
                  show: true
                }
              }
            },
            data: [
              {value: 2.0, name: 'app1'},
              {value: 4.9, name: 'app2'},
              {value: 7.0, name: 'app3'},
              {value: 23.2, name: 'app4'},
              {value: 20, name: 'app5'}
            ]
          }]
        }
        if (this.graphInfo && this.graphInfo.appGroupResources && Array.isArray(this.graphInfo.appGroupResources) && this.graphInfo.appGroupResources.length > 0) {
          let appGroup = this.graphInfo.appGroupResources
 //         let legend = appOption.legend.data = []
          let cpuData = appOption.series[0].data = []
  //        let memData = appOption.series[1].data = []
          for (let app of appGroup) {
       //     legend.push(app.appGroupId)
            cpuData.push({value: app.cpuAllocation, name: app.appGroupId})
       //     memData.push({value: app.memAllocation, name: app.appGroupId})
          }
        }
        this.appGroupChart.setOption(appOption)
        let appMemRec = document.getElementById('appMemRec')
        this.appGroupMemChart = echarts.init(appMemRec, null, {width: 500, height: 400})
        let appMemOption = {
          title: {text: '内存使用情况', x: 'center'},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {},
          series: [{
            name: '内存使用',
            type: 'pie',
            radius: [20, 110],
            center: ['25%', 200],
            roseType: 'radius',
            width: '50%',
            itemStyle: {
              normal: {
                label: {
                  show: true
                },
                labelLine: {
                  show: true
                }
              },
              emphasis: {
                label: {
                  show: true
                },
                labelLine: {
                  show: true
                }
              }
            },
            data: [
              {value: 2.6, name: 'app1'},
              {value: 9.5, name: 'app2'},
              {value: 7.0, name: 'app3'},
              {value: 28.2, name: 'app4'},
              {value: 30, name: 'app5'}
            ]
          }]
        }
        if (this.graphInfo && this.graphInfo.appGroupResources && Array.isArray(this.graphInfo.appGroupResources) && this.graphInfo.appGroupResources.length > 0) {
          let appGroup = this.graphInfo.appGroupResources
          let memData = appMemOption.series[0].data = []
          for (let app of appGroup) {
            memData.push({value: app.memAllocation, name: app.appGroupId})
          }
        }
        this.appGroupMemChart.setOption(appMemOption)
      },
      showCpuTopTen () {
        let cpuRec = document.getElementById('cpuRec')
        this.cpuTopTenChart = echarts.init(cpuRec, null, {width: 500, height: 400})
        let cpuTopTenOption = {
          title: {text: ' CPU使用情况', x: 'center'},
          tooltip: {},
          legend: {},
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                interval: 0,
                rotate: 40
              },
              data: ['192.168.11.11', '192.168.11.12', '192.168.11.13', '192.168.11.14']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [{
            name: 'CPU',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2]
          }],
          color: ['#d48265']
        }
        if (this.graphInfo && this.graphInfo.appResourcesCpuTopTen && Array.isArray(this.graphInfo.appResourcesCpuTopTen) && this.graphInfo.appResourcesCpuTopTen.length > 0) {
          let cpuTopTen = this.graphInfo.appResourcesCpuTopTen
          let xAxis = cpuTopTenOption.xAxis[0].data = []
          let cpuData = cpuTopTenOption.series[0].data = []
          for (let app of cpuTopTen) {
            xAxis.push(app.appId)
            cpuData.push(app.cpuAllocation)
          }
        }
        this.cpuTopTenChart.setOption(cpuTopTenOption)
      },
      showMemTopTen () {
        let memRec = document.getElementById('memRec')
        this.memTopTenChart = echarts.init(memRec, null, {width: 500, height: 400})
        let memTopTenOption = {
          title: {text: ' 内存使用情况(GB)', x: 'center'},
          tooltip: {},
          legend: {},
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                interval: 0,
                rotate: 40
              },
              data: ['192.168.11.11', '192.168.11.12', '192.168.11.13', '192.168.11.14']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [{
            name: '内存',
            type: 'bar',
            data: [2.6, 7.0, 9.5, 28.2]
          }],
          color: ['#61a0a8']
        }
        if (this.graphInfo && this.graphInfo.appResourcesMemTopTen && Array.isArray(this.graphInfo.appResourcesMemTopTen) && this.graphInfo.appResourcesMemTopTen.length > 0) {
          let memTopTen = this.graphInfo.appResourcesMemTopTen
          let xAxis = memTopTenOption.xAxis[0].data = []
          let memData = memTopTenOption.series[0].data = []
          for (let app of memTopTen) {
            xAxis.push(app.appId)
            memData.push(app.memAllocation)
          }
        }
        this.memTopTenChart.setOption(memTopTenOption)
      }
    },
    mounted () {
      this.fetchGraph()
      this.showPlat()
      this.showHost()
      this.showAppGroup()
      this.showCpuTopTen()
      this.showMemTopTen()
    }
  }
</script>

<style scoped>
  .fontStyle {
    width: 200px;
    margin: 0 0 10px 10px;
    color: #475669;
  }
  .monitorDiv {
    width: 600px;
    height: 450px;
  }
  .platNum {
    margin-left: 10px;
    font-weight: bold;
  }
</style>
