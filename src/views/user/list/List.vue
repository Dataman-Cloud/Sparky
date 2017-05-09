<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="用户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="filterUsers" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="userName" label="用户名" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="name" label="姓名" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="150">
        <template scope="user">
          {{user.row.status ? '正常': '禁用'}}
        </template>
      </el-table-column>
      <el-table-column prop="createAt" label="更新时间" min-width="150">
        <template scope="user">
          {{user.row.createAt | moment("YYYY/MM/DD hh:mm:ss")}}
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../store/user/mutations_types'

  export default {
    data () {
      return {
        filters: {
          name: ''
        },
        page: 1,
        listLoading: false
      }
    },
    computed: {
      ...mapState({
        users (state) {
          return state.user.users.users
        },
        total (state) {
          return state.user.users.total
        }
      }),
      filterUsers: function () {
        return this.users.slice((this.page - 1) * 20, this.page * 20)
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
      },
      //  获取镜像
      listUser () {
        return this.$store.dispatch(type.FETCH_USERS)
      }
    },
    mounted () {
      this.listLoading = true
      this.listUser()
        .then(() => {
          this.listLoading = false
        })
    }
  }
</script>

<style scoped>
</style>
