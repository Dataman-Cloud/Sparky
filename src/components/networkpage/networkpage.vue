<template><div>
  <el-table :data='page.data' highlight-current-row v-loading='loading' >
    <el-table-column prop='appId' label='应用ID' min-width='200'></el-table-column>
    <el-table-column prop='ip' label='分配IP' min-width='100'></el-table-column>
    <el-table-column prop='mac' label='MAC地址' min-width='100'></el-table-column>
    <el-table-column prop='option' label='容器名称' min-width='100'>
      <template scope='scope'>
        <router-link :to="{name: '容器信息', query:{instanceId: scope.row.containerId, nodeIp : scope.row.hostIp }}">
          {{scope.row.containerId.substring(-1, 16) }}
        </router-link>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page.pageSize'
                 :total='page.total' style='float:right;'>
  </el-pagination>
</div></template>

<script>
  import * as type from '@/store/ipam/mutations_types'

  export default {
    props: {
      Address: [Number, String],
      Network: [Number, String]
    },
    data () {
      return {
        page: {
          pageSize: 0,
          total: 0,
          pageNum: 0,
          data: []
        },
        loading: false
      }
    },
    methods: {
      getpage (pageNum) {
        this.loading = true
        let param = {node: this.Address, netName: this.Network, pageNum: pageNum}
        var self = this
        this.$store.dispatch(type.FETCH_NODE_IPAMINFO, param).then((data) => {
          self.page = data.data
          self.loading = false
        })
      },
      handleCurrentChange (pageNum) {
        this.getpage(pageNum)
      }
    },
    mounted () {
      console.log(this.Address)
      console.log(this.Network)
      this.getpage(1)
    }
  }
</script>
