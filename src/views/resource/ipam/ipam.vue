<template>
  <section>
    <!-- ipam -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-row>
          <el-col :span="12"><div id="echart"></div></el-col>
          <el-col :span="12">
            <div id="ipamInfo">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="IP总数:"> <span>{{ip_total }}</span> </el-form-item>
                <el-form-item label="IP未用量:"> <span>{{ip_total - aip_total }}</span> </el-form-item>
                <el-form-item label="IP总使用量:"> <span>{{aip_total }}</span> </el-form-item>
                <template v-for="pool in ipPoolInfo" >
                  <el-form-item :label="pool.subnet">
                  </el-form-item>
                  <el-progress :text-inside="true" :stroke-width="18"
                               :percentage="Math.round(pool.assignedNum*100/pool.ipTotal)" status="exception"></el-progress>
                </template>
              </el-form>
              <div id="refreshbtndiv">
                <el-button type="success" @click="details">使用详情</el-button>
                <el-button type="success" @click="releaseIp">刷新IP</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-tabs type="card">
              <template v-for="pool in ipPoolInfo">
                <el-tab-pane >
                  <span slot="label">{{pool.subnet}}</span>
                  <section>
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="IP起点:" >
                        <span>{{pool.ipStart }}</span>
                      </el-form-item>
                      <el-form-item label="IP终点:" >
                        <span>{{pool.ipEnd }}</span>
                      </el-form-item>
                      <el-form-item label="IP使用:" >
                        <span>{{pool.assignedNum }}</span>
                      </el-form-item>
                      <el-form-item label="IP未使用:" >
                        <span>{{pool.ipTotal - pool.assignedNum }}</span>
                      </el-form-item>
                      <el-form-item label="IP总数:" >
                        <span>{{pool.ipTotal }}</span>
                      </el-form-item>

                    </el-form>
                    <section>
                      <template v-for="ip in pool.ips" >
                        <template v-if='ip.used'>
                          <div class="iptag ipused">{{ip.ip }}</div>
                        </template>
                        <template v-else>
                          <div class="iptag ipnuse">{{ip.ip }}</div>
                        </template>
                      </template>
                    </section>
                  </section>

                </el-tab-pane>
              </template>
            </el-tabs>
          </el-col>
        </el-row>


      </el-col>
    </el-row>
    <!-- ipam  end-->
  </section>
</template>

<script>
  import { mapState } from 'vuex'
  import * as type from '../../../store/ipam/mutations_types'

  const echarts = require('echarts/lib/echarts')

  export default {
    data () {
      return {
        ip_total: 0,
        aip_total: 0
      }
    },
    computed: {
      ...mapState({
        ipPoolInfo (state) {
          return state.ipam.ipam.ipPoolInfo
        }
      })
    },
    methods: {
      getIpPoolInfo () {
        var self = this
        this.$store.dispatch(type.FETCH_IPPOOL).then(data => {
          self.ip_total = 0
          self.aip_total = 0
          for (var i in data.data) {
            var pool = data.data[i]
            self.ip_total += pool.ipTotal
            self.aip_total += pool.assignedNum
          }
          self.echart()
        })
      },
      echart () {
        var self = this
        var myChart = echarts.init(document.getElementById('echart'))
        var usedNUM = self.aip_total
        var nusedNUM = self.ip_total - self.aip_total
        var option = {
          tooltip: { trigger: 'item', formatter: '{a} <br/>{b} ({d}%)' },
          color: ['#f74343', '#ccc'],
          legend: { orient: 'vertical', left: 'left', data: ['已使用', '未使用'] },
          series: [ { type: 'pie', name: 'IP使用率', radius: '55%', center: ['50%', '60%'], data: [ {value: usedNUM, name: '已使用'}, {value: nusedNUM, name: '未使用'} ] } ]
        }
        myChart.setOption(option)
      },
      releaseIp () {
        var self = this
        self.$confirm(`是否刷新`, '提示', {
          confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.RELEASE_IPPOOL).then((data) => {
            if (data.resultCode && data.resultCode === '00') {
              self.$message({ message: '刷新成功', type: 'success', onClose: self.getIpPoolInfo })
            } else {
              self.$notify.error({title: '刷新异常'})
            }
          })
        })
      },
      details () {
        this.$router.push({ name: '网络使用详情' })
      }
    },
    mounted () {
      this.getIpPoolInfo()
    }
  }
</script>

<style scoped>
  .iptag {
    margin: 2px;
    display: inline-block;
    box-sizing: border-box;
    font-size:12px;
    width: 100px;
    text-align: center;
  }

  .ipused {
    background-color: #f74343;
  }

  .ipnuse {
    background-color: #ccc;
  }

  #echart {
    width:100%;
    height:300px;
  }

  #ipamInfo .el-form-item{
    display: block;
    margin-bottom: 0px;
  }

  #ipamInfo .el-form-item .el-form-item__label{
    padding: 11px 11px 5px 0;
  }
  #refreshbtndiv {
    float: right;
    padding: 10px 0px;
  }
</style>
