<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="应用名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

  <el-table :data="filterCapabilities" highlight-current-row v-loading="listLoading" style="width: 100%;">
    <el-table-column prop="uid" label="uid" min-width="1" sortable v-if="false">
    </el-table-column>
    <el-table-column prop="app_id" label="名称" min-width="150" sortable>
      <template scope="rule">
        <p><span>{{rule.row.app_id.replace('/','')}}</span></p>
      </template>
    </el-table-column>
    <el-table-column prop="step" label="步长" width="100" sortable>
    </el-table-column>
    <el-table-column prop="operation_time" label="扩容时间" width="200" sortable>
      <template scope="rule">
        {{rule.row.updated | moment("YYYY-MM-DD hh:mm:ss")}}
      </template>
    </el-table-column>
    <el-table-column prop="before_inst_num" label="扩缩前实例数(个)" min-width="200" sortable>
    </el-table-column>
    <el-table-column prop="current_inst_num" label="扩缩后实例数(个)	" min-width="200" sortable>
    </el-table-column>
    <el-table-column prop="policy_type" label="策略类型" min-width="120" sortable>
    </el-table-column>
    <el-table-column prop="action" label="扩缩结果" min-width="120" sortable>
      <template scope="rule">
        <span v-if="rule.row.action === 1 || rule.row.action === 3">扩</span>
        <span v-else>缩</span>
      </template>
    </el-table-column>
    <el-table-column prop="remark" label="备注" min-width="300" sortable>
    </el-table-column>
  </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../store/elastic/mutations_types'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        page: 1,
        pageSize: 10,
        listLoading: false
      }
    },
    watch: {
      // 当使用路由参数时，例如从 /user/foo 导航到 user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。
      $route (to) {
        this.listLoading = true
        this.listCapability()
          .then(data => {
            this.listLoading = false
          })
      }
    },
    computed: {
      ...mapState({
        policies (state) {
          return state.elastic.policies.capabilities
        },
        total (state) {
          return state.elastic.policies.capabilities.total
        }
      }),
      filterCapabilities: function () {
        return this.policies.capabilities
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
        let param = {pageSize: this.pageSize, page: this.page}
        return this.$store.dispatch(type.FETCH_SELECT_CAPABILITIES, param)
      },
      //  获取扩缩历史
      listCapability () {
        let param = {pageSize: this.pageSize, page: this.page}
        return this.$store.dispatch(type.FETCH_SELECT_CAPABILITIES, param)
      }
    },
    mounted () {
      this.listLoading = true
      this.listCapability()
        .then(() => {
          this.listLoading = false
        })
    }
  }
</script>

<style scoped></style>
