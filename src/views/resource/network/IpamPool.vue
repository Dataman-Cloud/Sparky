<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="网络名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="openAddNet">创建网络</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="openIpamPool">IP池信息</el-button>
        </el-form-item>

      </el-form>
    </el-col>

    <!--列表-->
    <el-col :span="24">
      <el-table :data="filterNets" highlight-current-row v-loading="listLoading">
        <el-table-column prop="Name" label="网络名称" min-width="100" sortable>
        </el-table-column>
        <el-table-column prop="Gateway" label="网关" min-width="100" sortable>
          <template scope="scope">
            {{scope.row.IPAM.Config[0].Gateway }}
          </template>
        </el-table-column>
        <el-table-column prop="parent" label="网卡" min-width="100" sortable>
          <template scope="scope">
            {{scope.row.Options.parent }}
          </template>
        </el-table-column>
        <!--<el-table-column prop="Subnet" label="网段" min-width="100" sortable>-->
          <!--<template scope="scope">-->
            <!--{{scope.row.IPAM.Config[0].Subnet }}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="IPStart" label="IP起点" min-width="100" sortable>
          <template scope="scope">
            {{getIPStart(scope.row.IPAM.Config[0].Subnet)}}
          </template>
        </el-table-column>
        <el-table-column prop="IPEnd" label="IP终点" min-width="100" sortable>
          <template scope="scope">
            {{getIPEnd(scope.row.IPAM.Config[0].Subnet)}}
          </template>
        </el-table-column>
        <el-table-column prop="IPUse" label="使用情况" min-width="100" sortable>
          <template scope="scope">
            {{getIPUse(scope.row.IPAM.Config[0].Subnet)}}
          </template>
        </el-table-column>
        <el-table-column prop="op" label="操作" min-width="200" sortable>
          <template scope="scope">
            <el-button type="info" size="small"  @click="showinfo(scope.row)">查看详情</el-button>
            <!--<el-button type="info" size="small"  @click="showpool(scope.row)">查看分布</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-col>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--<el-dialog title="IP分布" :visible.sync="poolVisible" size="small">-->
      <!--<section>-->
        <!--<el-form label-position="left" inline class="demo-table-expand">-->
          <!--<el-form-item label="IP起点:" >-->
            <!--<span>{{currPool ? currPool.ipStart : '' }}</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="IP终点:" >-->
            <!--<span>{{currPool ? currPool.ipEnd : '' }}</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="IP总数:" >-->
            <!--<span>{{currPool ? currPool.ipTotal : '' }}</span>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="IP使用:" >-->
            <!--<span>{{currPool ? currPool.assignedNum : '' }}</span>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
        <!--<section>-->
          <!--<template v-if='currPool' v-for="ip in currPool.ips" >-->
            <!--<template v-if='ip.used'>-->
              <!--<div v-bind:title='ip.ip' class="iptag ipused"></div>-->
            <!--</template>-->
            <!--<template v-else>-->
              <!--<div v-bind:title='ip.ip' class="iptag ipnuse"></div>-->
            <!--</template>-->
          <!--</template>-->
        <!--</section>-->
      <!--</section>-->
    <!--</el-dialog>-->

    <el-dialog title="NET详情" :visible.sync="netInfoVisible" size="large" top="6%">
      <section>
        <el-table :data="ipPage.data" highlight-current-row v-loading="netlistLoading">
          <el-table-column prop="ip" label="IP" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="mac" label="MAC" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="hostIp" label="宿主机" min-width="100" sortable>
          </el-table-column>
          <el-table-column prop="appId" label="应用" min-width="100" sortable>
            <template scope="scope">
              <router-link :to="{name: '应用实例信息', query:{id : scope.row.appId}}">{{scope.row.appId}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="containerName" label="容器名称" min-width="100" sortable>
            <template scope="scope">
              <router-link :to="{name: '容器信息', query:{instanceId: scope.row.containerId, nodeIp : scope.row.hostIp }}">
                {{scope.row.containerName }}
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
          <el-pagination layout="prev, pager, next" @current-change="handleNetInfoChange" :page-size="ipPage.pageSize" :total="ipPage.total" style="float:right;">
          </el-pagination>
        </el-col>
      </section>
    </el-dialog>

    <el-dialog title="创建网络" :visible.sync="createNetVisible" size="tiny">
      <section>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
          <el-form-item label="网络名称" :rules="[{required: true, message: '网络名称', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}]" prop="name">
            <el-input v-model="form.name" placeholder="macvlan001"></el-input>
          </el-form-item>
          <el-form-item label="网段" :rules="[{required: true, message: '网段', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}]" prop="subnet">
            <el-input v-model="form.subnet" placeholder="10.10.10.0/24"></el-input>
          </el-form-item>
          <el-form-item label="网关" :rules="[{required: true, message: '网关', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}]" prop="gateway">
            <el-input v-model="form.gateway" placeholder="10.10.10.1"></el-input>
          </el-form-item>
          <el-form-item label="网卡" :rules="[{required: true, message: '网卡', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}]" prop="parent">
            <el-input v-model="form.parent" placeholder="bond1.100"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">创建</el-button>
            <el-button @click="createNetVisible=false">取消</el-button>
          </el-form-item>

        </el-form>
      </section>
    </el-dialog>

    <el-dialog title="IP池" :visible.sync="ipamPoolVisible">
      <section>
        <template>
          <el-tabs value="0">
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
                    <el-form-item label="IP总数:" >
                      <span>{{pool.ipTotal }}</span>
                    </el-form-item>
                    <el-form-item label="IP使用:" >
                      <span>{{pool.assignedNum }}</span>
                      <div class="leftdiv">
                        <div class="iptag ipused nomargin"></div> 已用
                        <div class="iptag ipnuse nomargin"></div> 未用
                      </div>
                    </el-form-item>
                  </el-form>
                  <section>
                    <template v-for="ip in pool.ips" >
                      <template v-if='ip.used'>
                        <div v-bind:title='ip.ip' class="iptag ipused"></div>
                      </template>
                      <template v-else>
                        <div v-bind:title='ip.ip' class="iptag ipnuse"></div>
                      </template>
                    </template>
                  </section>
                </section>

              </el-tab-pane>
            </template>
          </el-tabs>
        </template>
      </section>
    </el-dialog>


  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../store/ipam/mutations_types'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        currpage: 1,
        currNet: null,
        currPool: {
          ips: []
        },
        listLoading: false,
        poolVisible: false,
        netInfoVisible: false,
        netlistLoading: false,
        createNetVisible: false,
        createnetLoading: false,
        ipamPoolVisible: false,
        page: 1,
        form: {
          name: '',
          subnet: '',
          gateway: '',
          parent: ''
        },
        rules: {
        }
      }
    },
    computed: {
      ...mapState({
        nets (state) {
          return state.ipam.ipam.nets
        },
        ipPoolInfo (state) {
          return state.ipam.ipam.ipPoolInfo
        },
        ipPage (state) {
          return state.ipam.ipam.ipPage
        },
        total (state) {
          return state.ipam.ipam.nets.length
        },
        filterNets () {
          if (this.nets) {
            // 先写了一个filter， TODO 异步，后端分页
            if (this.filters && this.filters.name) {
              return this.nets.filter((net) => {
                let reg = new RegExp(this.filters.name)
                return reg.test(net.Name)
              })
            }
            return this.nets.slice((this.currpage - 1) * 20, this.currpage * 20)
          }
          return null
        }
      })
    },
    methods: {
      handleCurrentChange (val) {
        this.currpage = val
      },
      handleNetInfoChange (val) {
        this.page = val
        this.netlistLoading = true
        this.getIppage().then(() => {
          this.netlistLoading = false
        })
      },
      getNets () {
        return this.$store.dispatch(type.FETCH_NETS)
      },
      getIpPoolInfo () {
        return this.$store.dispatch(type.FETCH_IPAM_POOL)
      },
      getIppage () {
        let params = {netName: this.currNet.Name, pageNum: this.page}
        return this.$store.dispatch(type.FETCH_NET_IPS, params)
      },
      getIPStart (subnet) {
        // console.log(subnet)
        for (let pool of this.ipPoolInfo) {
          if (subnet === (pool.subnet + '/' + pool.mark)) {
            return pool.ipStart
          }
        }
        return ''
      },
      getIPEnd (subnet) {
        // console.log(subnet)
        for (let pool of this.ipPoolInfo) {
          if (subnet === (pool.subnet + '/' + pool.mark)) {
            return pool.ipEnd
          }
        }
        return ''
      },
      getIPUse (subnet) {
        // console.log(subnet)
        for (let pool of this.ipPoolInfo) {
          if (subnet === (pool.subnet + '/' + pool.mark)) {
            return pool.assignedNum + '/' + pool.ipTotal
          }
        }
        return ''
      },
      openAddNet () {
        this.createNetVisible = true
        this.form = {
          name: '',
          subnet: '',
          gateway: '',
          parent: ''
        }
      },
      showpool (net) {
        let subnet = net.IPAM.Config[0].Subnet
        this.currPool = null
        for (let pool of this.ipPoolInfo) {
          if (subnet === (pool.subnet + '/' + pool.mark)) {
            this.currPool = pool
            break
          }
        }
        if (this.currPool === null) {
          this.$message.error('没有对应的ip池')
          return false
        }
        console.dir(this.currPool.ips)
        this.poolVisible = true
      },
      showinfo (net) {
        this.page = 1
        this.currNet = net
        this.listLoading = true
        this.getIppage().then(() => {
          this.listLoading = false
          this.netInfoVisible = true
        })
      },
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log(this.form)
            this.createnetLoading = true
            this.$store.dispatch(type.CREATE_NET, this.form).then((data) => {
              this.createnetLoading = false
              if (data.resultCode === '00') {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  onClose: this.closeCreateNet
                })
              } else {
                this.$message({
                  message: data.message,
                  type: 'error'
                })
              }
            })
          } else {
            return false
          }
        })
      },
      closeCreateNet () {
        this.createNetVisible = false
      },
      openIpamPool () {
        this.ipamPoolVisible = true
      }
    },
    mounted () {
      this.getIpPoolInfo().then(() => {
        this.getNets()
      })
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
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

  .iptag {
    width: 13px;
    height: 13px;
    margin: 2px;
    display: inline-block;
    box-sizing:border-box;
  }
  .ipused {
    background-color: #f74343;
  }
  .ipnuse {
    background-color: rgb(199, 199, 199);
  }
  .leftdiv{
    display: inline-block;
    padding-left: 80px;
  }
  .nomargin {
    margin: 0;
  }
</style>
