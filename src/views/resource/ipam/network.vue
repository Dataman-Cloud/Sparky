<template>
  <section>
    <!-- network -->
    <el-row :gutter="20">
      <el-col :span="24" >
        <el-button type="primary" icon="plus" style='margin-bottom:10px;' @click="createNetVisible=true">创建网络</el-button>
        <el-table :data="nets" highlight-current-row>
          <el-table-column type="expand">
            <template scope="scope">
              <h4>IPAM设置</h4>
              <el-table :data="scope.row.IPAM.Config" highlight-current-row >
                <el-table-column prop="Subnet" label="网段" min-width="100">
                </el-table-column>
                <el-table-column prop="Gateway" label="网关" min-width="100">
                </el-table-column>
                <el-table-column prop="IPstart" label="IP起点" min-width="100">
                  <template scope="scope">
                    {{getIPStart(scope.row)}}
                  </template>
                </el-table-column>
                <el-table-column prop="IPend" label="IP终点" min-width="100">
                  <template scope="scope">
                    {{getIPEnd(scope.row)}}
                  </template>
                </el-table-column>
                <el-table-column prop="IPused" label="使用情况" min-width="100">
                  <template scope="scope">
                    {{getIPUsed(scope.row)}}
                  </template>
                </el-table-column>
              </el-table>
              <h4>主机详情</h4>
              <el-tabs >
                <template v-for="node in nodes">
                  <el-tab-pane >
                    <span slot="label">{{node.Address}}</span>
                    <section>
                      <Networkpage :Address="node.Address" :Network="scope.row.Name"></Networkpage>
                    </section>
                  </el-tab-pane>
                </template>
              </el-tabs>

            </template>

          </el-table-column>
          <el-table-column prop="Name" label="网络名称" min-width="100">
          </el-table-column>
          <el-table-column prop="Scope" label="范围" min-width="100">
          </el-table-column>
          <el-table-column prop="Driver" label="网络驱动" min-width="100">
          </el-table-column>
          <el-table-column prop="Parent" label="网卡" min-width="100">
            <template scope="scope">
              {{scope.row.Options.parent }}
            </template>
          </el-table-column>
          <el-table-column prop="ipam-Driver" label="ipam驱动" min-width="100">
            <template scope="scope">
              {{scope.row.IPAM.Driver }}
            </template>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>



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
            <el-button @click="closeCreateNet">取消</el-button>
          </el-form-item>
        </el-form>
      </section>
    </el-dialog>

  </section>
</template>

<script>
  import { mapState } from 'vuex'
  import * as type from '../../../store/ipam/mutations_types'
  import Networkpage from '@/components/networkpage/networkpage'

  export default {
    components: {
      Networkpage
    },
    data () {
      return {
        createNetVisible: false,
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
        ipPoolInfo (state) {
          return state.ipam.ipam.ipPoolInfo
        },
        nets (state) {
          return state.ipam.ipam.nets
        },
        nodes (state) {
          return state.ipam.ipam.nodes
        }
      })
    },
    methods: {
      getIpPoolInfo () {
        return this.$store.dispatch(type.FETCH_IPPOOL)
      },
      getNets () {
        return this.$store.dispatch(type.FETCH_NODE_NETWORK)
      },
      getNodes () {
        return this.$store.dispatch(type.FETCH_NODE)
      },
      getIPStart (config) {
        var subnet = config.Subnet
        for (let pool of this.ipPoolInfo) {
          if (subnet === (pool.subnet + '/' + pool.mark)) {
            return pool.ipStart
          }
        }
        return ''
      },
      getIPEnd (config) {
        var subnet = config.Subnet
        for (let pool of this.ipPoolInfo) {
          if (subnet === (pool.subnet + '/' + pool.mark)) {
            return pool.ipEnd
          }
        }
        return ''
      },
      getIPUsed (config) {
        var subnet = config.Subnet
        for (let pool of this.ipPoolInfo) {
          if (subnet === (pool.subnet + '/' + pool.mark)) {
            return pool.assignedNum + '/' + pool.ipTotal
          }
        }
        return ''
      },
      onSubmit () {
        var self = this
        self.$refs.form.validate((valid) => {
          if (valid) {
            // console.log(self.form)
            this.$store.dispatch(type.ADD_NETWORK, self.form)
              .then(() => {
                self.$message({ message: '添加network成功', type: 'success', onClose: self.init })
              })
              .catch(error => {
                self.$notify.error({ title: '添加network异常', message: error })
              })
          } else {
            return false
          }
        })
      },
      closeCreateNet () {
        this.$refs.form.resetFields()
        this.createNetVisible = false
      },
      init () {
        this.getIpPoolInfo().then(() => {
          this.getNets()
          this.getNodes()
        })
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style scoped>
</style>
