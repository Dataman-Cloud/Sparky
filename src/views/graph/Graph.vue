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
          <div id="cpuUsage" style="height: 350px;padding:40px 120px 0;box-shadow:0 0 20px rgba(0,0,0,.06)"></div>
        </el-col>
        <el-col :span="12">
          <div id="memUsage" style="height: 350px;padding:40px 120px 0;box-shadow:0 0 20px rgba(0,0,0,.06)"></div>
        </el-col>
      </div>
    </el-row>

    <div style="margin-top:20px"><span class="fontStyle"><strong>主机</strong></span></div>
    <el-row style="border-radius: 15px;margin-top:20px;box-shadow:0 0 20px rgba(0,0,0,.06)">
      <div>
        <el-col :span="12">
          <div id="hostRec" class="monitorDiv"></div>
        </el-col>
        <el-col :span="12">
          <div id="hostMemRec" class="monitorDiv"></div>
        </el-col>
      </div>
    </el-row>

    <div style="margin-top:20px"><span class="fontStyle"><strong>应用组</strong></span></div>
    <el-row :gutter="20" style="margin-top:20px">
      <div>
        <el-col :span="12">
          <div id="appRec" class="monitorDiv" style="height: 350px;padding:40px 95px 20px;box-shadow:0 0 20px rgba(0,0,0,.06)"></div>
        </el-col>
        <el-col :span="12">
          <div id="appMemRec" class="monitorDiv" style="height: 350px;padding:40px 95px 20px;box-shadow:0 0 20px rgba(0,0,0,.06)"></div>
        </el-col>
      </div>
    </el-row>

    <div style="margin-top:20px"><span class="fontStyle"><strong>应用</strong></span></div>
    <el-row style="border-radius: 15px;margin-top:20px;box-shadow:0 0 20px rgba(0,0,0,.06)">
      <div>
        <el-col :span="12">
          <div id="cpuRec" class="appDiv"></div>
        </el-col>
        <el-col :span="12">
          <div id="memRec" class="appDiv"></div>
        </el-col>
      </div>
    </el-row>

    <div style="margin-top:20px"><span class="fontStyle"><strong>资源趋势</strong></span></div>
    <el-row style="margin-top:20px;">
      <div>
        <el-col :span="12">
          <div id="cpuRecMon" class="monitorDiv"></div>
        </el-col>
        <el-col :span="12">
          <div id="MemRecMon" class="monitorDiv"></div>
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
  require('echarts/lib/chart/line')
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
        appGroupCpuResMonChart: null,
        appGroupMemResMonChart: null,
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
        this.appGroupResMonthlyTrend()
      }
    },
    computed: {
      ...mapState({
        graphInfo (state) {
//          console.log(JSON.stringify(state.graph.graphInfo))
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
          backgroundColor: '#fff',
          title: {
            text: '平台CPU使用率',
            x: 'center',
            padding: [0, 0, 20, 0],
            left: 'center',
            top: 0
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {},
          label: {
            normal: {
              formatter: '{b}: ({d}%)'
            }
          },
          series: [{
            name: 'cpu使用',
            type: 'pie',
            data: [
              {value: 25, name: '已使用量'},
              {value: 75, name: '未使用量'}
            ]
          }],
          color: ['#4dced0', '#53a3da']
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
          backgroundColor: '#fff',
          title: {
            text: '平台内存使用率',
            x: 'center',
            padding: [0, 0, 20, 0],
            left: 'center',
            top: 0
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {},
          label: {
            normal: {
              formatter: '{b}: ({d}%)'
            }
          },
          series: [{
            name: '内存使用',
            type: 'pie',
            data: [
              {value: 25, name: '已使用量'},
              {value: 75, name: '未使用量'}
            ]
          }],
          color: ['#4dced0', '#53a3da']
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
          backgroundColor: '#fff',
          title: {text: 'CPU使用情况', x: 'center'},
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
              type: 'value',
              name: '(单位：核)'
            }
          ],
          series: [{
            name: 'CPU',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2]
          }],
          color: ['#4ac8ca']
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
          backgroundColor: '#fff',
          title: {text: ' 内存使用情况', x: 'center'},
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
              type: 'value',
              name: '(单位：GB)'
            }
          ],
          series: [{
            name: '内存',
            type: 'bar',
            data: [2.6, 7.0, 9.5, 28.2]
          }],
          color: ['#4ac8ca']
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
          backgroundColor: '#fff',
          title: {text: 'CPU使用情况', x: 'center'},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {},
          label: {
            normal: {
              formatter: '{b}: ({d}%)'
            }
          },
          color: ['#4dced0', '#53a3da', '#ff7f50', '#87cefa', '#6495ed',
            '#40e0d0', '#1e90ff', '#7b68ee', '#6b8e23', '#b8860b', '#30e0e0'],
          series: [{
            name: 'CPU使用',
            type: 'pie',
            radius: [20, 110],
            center: ['50%', 200],
            roseType: 'radius',
            width: '50%',
            itemStyle: {
              normal: {
//                color: '#53a3da',
                shadowBlur: 100,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
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
          backgroundColor: '#fff',
          title: {text: '内存使用情况', x: 'center'},
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {},
          label: {
            normal: {
              formatter: '{b}: ({d}%)'
            }
          },
          color: ['#4dced0', '#53a3da', '#ff7f50', '#87cefa', '#6495ed',
            '#40e0d0', '#1e90ff', '#7b68ee', '#6b8e23', '#b8860b', '#30e0e0'],
          series: [{
            name: '内存使用',
            type: 'pie',
            radius: [20, 110],
            center: ['50%', 200],
            roseType: 'radius',
            width: '50%',
            itemStyle: {
              normal: {
//                color: '#53a3da',
                shadowBlur: 100,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
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
        this.cpuTopTenChart = echarts.init(cpuRec, null, {width: 500, height: 450})
        let cpuTopTenOption = {
          backgroundColor: '#fff',
          title: {text: ' CPU分配使用TOP10', x: 'center'},
          tooltip: {},
          legend: {},
          grid: {y2: 120},
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
              type: 'value',
              name: '(单位：核)'
            }
          ],
          series: [{
            name: 'CPU',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2]
          }],
          color: ['#4ac8ca']
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
        this.memTopTenChart = echarts.init(memRec, null, {width: 500, height: 450})
        let memTopTenOption = {
          backgroundColor: '#fff',
          title: {text: ' 内存分配使用TOP10', x: 'center'},
          tooltip: {},
          legend: {},
          grid: {y2: 120},
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
              type: 'value',
              name: '(单位：GB)'
            }
          ],
          series: [{
            name: '内存',
            type: 'bar',
            data: [2.6, 7.0, 9.5, 28.2]
          }],
          color: ['#4ac8ca']
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
      },
      appGroupResMonthlyTrend () {
        let cpuRecMon = document.getElementById('cpuRecMon')
        this.appGroupCpuResMonChart = echarts.init(cpuRecMon, null, {width: 500, height: 400})
        let option = {
          backgroundColor: '#fff',
          title: {text: 'CPU使用趋势', x: 'center'},
          tooltip: {
            trigger: 'axis'
//            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            x: 'center',
            y: 'bottom',
            data: []
          },
          grid: {y2: 120},
          calculable: true,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                interval: 3,
                rotate: 40
              },
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} '
              }
            }
          ],
          series: [{
            name: 'CPU使用',
            type: 'line',
            data: []
          }]
        }
        if (this.graphInfo && this.graphInfo.appGroupResoucesWithMonthlyTrend && Array.isArray(this.graphInfo.appGroupResoucesWithMonthlyTrend) && this.graphInfo.appGroupResoucesWithMonthlyTrend.length > 0) {
          let appGroupsCpu = this.graphInfo.appGroupResoucesWithMonthlyTrend
          let time = option.xAxis[0].data = []
          let legend = option.legend.data = []
          let series = option.series = []
          for (let times of appGroupsCpu[0].createTimes.split(',')) {
            time.push(times.replace(/(\d{4}).(\d{1,2}).(\d{1,2}).+/mg, '$1-$2-$3'))
          }
          for (let app of appGroupsCpu) {
//            let format = new Date(parseInt(app.createTime)).toLocaleString().replace(/:\d{1,2}$/, ' ')
            legend.push(app.appGroupId)
            series.push({
              name: app.appGroupId,
              type: 'line',
              data: app.cpuAllocations.split(',')
            })
          }
        }
        this.appGroupCpuResMonChart.setOption(option)
        let MemRecMon = document.getElementById('MemRecMon')
        this.appGroupMemResMonChart = echarts.init(MemRecMon, null, {width: 500, height: 400})
        let memMonOption = {
          backgroundColor: '#fff',
          title: {text: '内存使用趋势', x: 'center'},
          tooltip: {
            trigger: 'axis'
//            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            x: 'center',
            y: 'bottom',
            data: []
          },
          grid: {y2: 120},
          calculable: true,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                interval: 3,
                rotate: 40
              },
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} '
              }
            }
          ],
          series: [{
            name: '内存使用',
            type: 'line',
            data: []
          }]
        }
        if (this.graphInfo && this.graphInfo.appGroupResoucesWithMonthlyTrend && Array.isArray(this.graphInfo.appGroupResoucesWithMonthlyTrend) && this.graphInfo.appGroupResoucesWithMonthlyTrend.length > 0) {
          let appGroupsMem = this.graphInfo.appGroupResoucesWithMonthlyTrend
          let memtime = memMonOption.xAxis[0].data = []
          let memlegend = memMonOption.legend.data = []
          let memSeries = memMonOption.series = []
          for (let times1 of appGroupsMem[0].createTimes.split(',')) {
            memtime.push(times1.replace(/(\d{4}).(\d{1,2}).(\d{1,2}).+/mg, '$1-$2-$3'))
          }
          for (let app of appGroupsMem) {
            memlegend.push(app.appGroupId)
            memSeries.push({
              name: app.appGroupId,
              type: 'line',
              data: app.memAllocations.split(',')
            })
          }
        }
        this.appGroupMemResMonChart.setOption(memMonOption)
      }
    },
    mounted () {
      this.fetchGraph()
      this.showPlat()
      this.showHost()
      this.showAppGroup()
      this.showCpuTopTen()
      this.showMemTopTen()
      this.appGroupResMonthlyTrend()
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
    padding: 40px 40px;
  }
  .platNum {
    margin-left: 10px;
    font-weight: bold;
  }
  .appDiv{
    padding: 40px 40px 0;
  }
</style>
