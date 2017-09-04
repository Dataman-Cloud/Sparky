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
      <span>集群： {{graphInfo.platformResource.clusterNum}}</span><span class="platNum">主机数： {{graphInfo.platformResource.hostNum}}</span>
      <span class="platNum">应用组： {{graphInfo.platformResource.appGroupNum}}</span>
      <span class="platNum">应用： {{graphInfo.platformResource.appNum}}</span><span class="platNum">容器： {{graphInfo.platformResource.containerNum}}</span>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <div id="cpuUsage" class="monitorDiv"></div>
      </el-col>
      <el-col :span="12">
        <div id="memUsage" class="monitorDiv"></div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <div id="hostRec" class="monitorDiv"></div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <div id="appRec" class="monitorDiv"></div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <div id="cpuRec" class="monitorDiv"></div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="18">
        <div id="memRec" class="monitorDiv"></div>
      </el-col>
    </el-row>

<!--

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="平台概览" name="first" id="platformResource" style="margin-top: 20px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <div id="cpuUsage" class="monitorDiv"></div>
          </el-col>
          <el-col :span="12">
            <div id="memUsage" class="monitorDiv"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="主机资源" name="second" id="hostResources">
        <el-row :gutter="20">
          <el-col :span="18">
            <div id="hostRec" class="monitorDiv"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="应用组资源" name="third" id="appGroupResources">
        <el-row :gutter="20">
          <el-col :span="24">
            <div id="appRec" class="monitorDiv"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="CPU使用TOP10" name="fourth" id="appResourcesCpuTopTen">
        <el-row :gutter="20">
          <el-col :span="18">
            <div id="cpuRec" class="monitorDiv"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="内存使用TOP10" name="fifth" id="appResourcesMemTopTen">
        <el-row :gutter="20">
          <el-col :span="18">
            <div id="memRec" class="monitorDiv"></div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
-->


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
        appGroupChart: null,
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
  /*    handleClick (tab) {
//        this.closeSse()
        switch (tab.$el.id) {
          case 'platformResource' :
            this.showPlat()
            break
          case 'hostResources' :
            this.showHost()
            break
          case 'appGroupResources' :
            this.showAppGroup()
            break
          case 'appResourcesCpuTopTen' :
            this.showCpuTopTen()
            break
          case 'appResourcesMemTopTen' :
            this.showMemTopTen()
            break
        }
      }, */
      showPlat () {
        let cpuUsage = document.getElementById('cpuUsage')
        this.cpuChart = echarts.init(cpuUsage, null, {width: 500, height: 300})
        let option = {
          title: {text: 'CPU 使用率', x: 'center'},
          tooltip: {},
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['已使用量', '未使用量']
          },
          series: [{
            name: 'cpu使用',
            type: 'pie',
            data: [
              {value: 25, name: '已使用量'},
              {value: 75, name: '未使用量'}
            ]
          }]
        }
        if (this.graphInfo && this.graphInfo.platformResource) {
          option.series[0].data = [
            {value: this.graphInfo.platformResource.cpuUtilizationRate, name: '已使用量'},
            {value: (1 - this.graphInfo.platformResource.cpuUtilizationRate).toFixed(2), name: '未使用量'}
          ]
        }
        this.cpuChart.setOption(option)
        let memUsage = document.getElementById('memUsage')
        this.memoryChart = echarts.init(memUsage, null, {width: 500, height: 300})
        let memOption = {
          title: {text: '内存使用率(GB)', x: 'center'},
          tooltip: {},
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['已使用量', '未使用量']
          },
          series: [{
            name: '内存使用',
            type: 'pie',
            data: [
              {value: 25, name: '已使用量'},
              {value: 75, name: '未使用量'}
            ]
          }]
        }
        if (this.graphInfo && this.graphInfo.platformResource) {
          memOption.series[0].data = [
            {value: (this.graphInfo.platformResource.memUtilizationRate).toFixed(2), name: '已使用量'},
            {value: (this.graphInfo.platformResource.memTotal - this.graphInfo.platformResource.memUtilizationRate).toFixed(2), name: '未使用量'}
          ]
        }
        this.memoryChart.setOption(memOption)
      },
      showHost () {
        let hostRec = document.getElementById('hostRec')
        this.hostChart = echarts.init(hostRec, null, {width: 600, height: 400})
        let hostOption = {
          title: {text: '主机资源使用情况'},
          tooltip: {},
          legend: {
            data: ['CPU', '内存']
          },
          xAxis: [
            {
              type: 'category',
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
          }, {
            name: '内存',
            type: 'bar',
            data: [2.6, 7.0, 9.5, 28.2]
          }]
        }
        if (this.graphInfo && this.graphInfo.hostResources && Array.isArray(this.graphInfo.hostResources) && this.graphInfo.hostResources.length > 0) {
          let host = this.graphInfo.hostResources
          let hostIp = hostOption.xAxis[0].data = []
          let cpuData = hostOption.series[0].data = []
          let memData = hostOption.series[1].data = []
          for (let h of host) {
            hostIp.push(h.ip)
            cpuData.push(h.cpuUtilizationRate)
            memData.push(h.memUtilizationRate)
          }
        }
        this.hostChart.setOption(hostOption)
      },
      showAppGroup () {
        let appRec = document.getElementById('appRec')
        this.appGroupChart = echarts.init(appRec, null, {width: 900, height: 400})
        let appOption = {
          title: {text: '应用组资源使用占比'},
          tooltip: {},
          legend: {
            x: 'center',
            y: 'bottom',
            data: ['app1', 'app2', 'app3', 'app4', 'app5']
          },
          series: [{
            name: 'CPU使用率',
            type: 'pie',
            radius: [20, 110],
            center: ['25%', 200],
            roseType: 'radius',
            width: '50%',
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
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
          }, {
            name: '内存使用率',
            type: 'pie',
            radius: [30, 110],
            center: ['75%', 200],
            roseType: 'area',
            x: '60%',               // for funnel
            sort: 'ascending',     // for funnel
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
          let legend = appOption.legend.data = []
          let cpuData = appOption.series[0].data = []
          let memData = appOption.series[1].data = []
          for (let app of appGroup) {
            legend.push(app.appGroupId)
            cpuData.push({value: app.cpuUtilizationRate.toFixed(2), name: app.appGroupId})
            memData.push({value: app.memUtilizationRate, name: app.appGroupId})
          }
        }
        this.appGroupChart.setOption(appOption)
      },
      showCpuTopTen () {
        let cpuRec = document.getElementById('cpuRec')
        this.cpuTopTenChart = echarts.init(cpuRec, null, {width: 600, height: 400})
        let cpuTopTenOption = {
          title: {text: 'CPU使用率TOP10应用'},
          tooltip: {},
          legend: {
            data: ['CPU', '内存']
          },
          xAxis: [
            {
              type: 'category',
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
          }, {
            name: '内存',
            type: 'bar',
            data: [2.6, 7.0, 9.5, 28.2]
          }]
        }
        if (this.graphInfo && this.graphInfo.appResourcesCpuTopTen && Array.isArray(this.graphInfo.appResourcesCpuTopTen) && this.graphInfo.appResourcesCpuTopTen.length > 0) {
          let cpuTopTen = this.graphInfo.appResourcesCpuTopTen
          let xAxis = cpuTopTenOption.xAxis[0].data = []
          let cpuData = cpuTopTenOption.series[0].data = []
          let memData = cpuTopTenOption.series[1].data = []
          for (let app of cpuTopTen) {
            xAxis.push(app.appId)
            cpuData.push(app.cpuUtilizationRate)
            memData.push(app.memUtilizationRate)
          }
        }
        this.cpuTopTenChart.setOption(cpuTopTenOption)
      },
      showMemTopTen () {
        let memRec = document.getElementById('memRec')
        this.memTopTenChart = echarts.init(memRec, null, {width: 600, height: 400})
        let memTopTenOption = {
          title: {text: '内存使用率TOP10应用'},
          tooltip: {},
          legend: {
            data: ['CPU', '内存']
          },
          xAxis: [
            {
              type: 'category',
              data: ['192.168.11.11', '192.168.11.12', '192.168.11.13', '192.168.11.14']
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [ {
            name: 'CPU',
            type: 'bar',
            data: [2.0, 4.9, 7.0, 23.2]
          }, {
            name: '内存',
            type: 'bar',
            data: [2.6, 7.0, 9.5, 28.2]
          }]
        }
        if (this.graphInfo && this.graphInfo.appResourcesMemTopTen && Array.isArray(this.graphInfo.appResourcesMemTopTen) && this.graphInfo.appResourcesMemTopTen.length > 0) {
          let memTopTen = this.graphInfo.appResourcesMemTopTen
          let xAxis = memTopTenOption.xAxis[0].data = []
          let cpuData = memTopTenOption.series[0].data = []
          let memData = memTopTenOption.series[1].data = []
          for (let app of memTopTen) {
            xAxis.push(app.appId)
            cpuData.push(app.cpuUtilizationRate)
            memData.push(app.memUtilizationRate)
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
  .monitorDiv {
    width: 700px;
    height: 450px;
  }
  .platNum {
    margin-left: 10px;
  }
</style>
