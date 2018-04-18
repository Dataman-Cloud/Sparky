<template>
  <section>
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="应用名称" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="searchFun">查询</el-button>
          </el-form-item>
          <el-form-item>
            <router-link :to="{name: '添加策略'}">
              <el-button v-showBtn="addPolicies" type="primary">添加策略</el-button>
            </router-link>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
    <el-table :data="filterPolicies" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="id" label="id" min-width="1" sortable v-if="false">
      </el-table-column>
      <el-table-column prop="app_id" label="名称" min-width="150"  sortable>
        <template scope="rule">
          <p><span>{{rule.row.app_id.replace('/','')}}</span></p>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="告警规则" width="150" sortable show-overflow-tooltip>
        <template scope="rule">
          <p><span>{{rule.row.type}}{{rule.row.operator}}{{rule.row.setValue}}</span></p>
        </template>
      </el-table-column>
      <el-table-column prop="monitor_cycle" label="监控周期(秒)" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="threshold" label="阈值" min-width="80" sortable>
      </el-table-column>
      <el-table-column prop="max_instance" label="最大实例个数" min-width="100" sortable>
        <template scope="scope">
          {{scope.row.max_instance === 0 ? '-' : scope.row.max_instance}}
        </template>
      </el-table-column>
      <el-table-column prop="min_instance" label="最小实例个数" min-width="100" sortable>
        <template scope="scope">
          {{scope.row.min_instance === 0 ? '-' : scope.row.min_instance}}
        </template>
      </el-table-column>
      <el-table-column prop="step" label="步长" width="80" sortable>
      </el-table-column>
      <el-table-column prop="created" label="创建时间" min-width="1" sortable v-if="false">
      </el-table-column>
      <el-table-column prop="updated" label="更新时间" min-width="150">
        <template scope="rule">
          {{rule.row.updated | moment("YYYY-MM-DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
      <template scope="rule">
        <span v-if="rule.row.status === 'disable'">禁用</span>
        <span v-else-if="rule.row.status === 'start'">开启</span>
      </template>
      </el-table-column>
      <el-table-column prop="action" label="扩缩" min-width="100" sortable>
        <template scope="rule">
          <span v-if="rule.row.action === 1">扩</span>
          <span v-else>缩</span>
        </template>
      </el-table-column>
      <el-table-column prop="poolname" label="poolname" min-width="50" sortable v-if="false">
      </el-table-column>
      <el-table-column prop="user_name" label="用户名" min-width="50" sortable v-if="false">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <router-link :to="{name:'更新策略',query:{id:scope.row.id}}">
            <el-button type="primary" v-showBtn="updatePolicies"  size="small">更新</el-button>
          </router-link>
          <el-button type="danger" v-showBtn="delPolicies"   size="small" @click="removePolicy(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next"  @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
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
        search: false,
        pageSize: 10,
        listLoading: false
      }
    },
    watch: {
      // 当使用路由参数时，例如从 /user/foo 导航到 user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。
      $route (to) {
        this.listLoading = true
        this.listPolicy()
          .then(data => {
            this.listLoading = false
          })
      }
    },
    computed: {
      ...mapState({
        policies (state) {
          return state.elastic.policies.policies
        },
        total (state) {
          return state.elastic.policies.policies.total
        }
      }),
      filterPolicies: function () {
        let allData = this.policies.policies
        let name = this.filters.name
        if (name !== null && name !== '') {
          let list = []
          // 循环比对
          for (let u of allData) {
            if (u.app_id.indexOf(name) > -1) {
              list.push(u)
            }
          }
          return list
        }
        return this.policies.policies
      }
    },
    methods: {
      searchFun () {
        this.search = true
      },
      handleCurrentChange (val) {
        this.page = val
        this.search = true
        let param = {pageSize: this.pageSize, page: this.page}
        return this.$store.dispatch(type.FETCH_SELECT_POLICIES, param)
      },
      //  获取策略列表
      listPolicy () {
        let param = {pageSize: this.pageSize, page: this.page}
        return this.$store.dispatch(type.FETCH_SELECT_POLICIES, param)
      },
      //   删除策略
      removePolicy (index) {
        this.$confirm('是否删除该策略', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return this.$store.dispatch(type.DELETE_POLICY, index).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.listPolicy()
          })
        })
      }
    },
    mounted () {
      this.listLoading = true
      this.listPolicy()
        .then(() => {
          this.listLoading = false
        })
    }
  }
</script>

<style scoped></style>
