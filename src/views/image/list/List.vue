<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="镜像名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="filterImages" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column label="名称" min-width="150" sortable>
        <template scope="image">
          {{image.row.Namespace}}/{{image.row.Image}}
        </template>
      </el-table-column>
      <el-table-column prop="CreatedAt" label="创建时间" min-width="150" sortable>
        <template scope="app">
          {{app.row.CreatedAt | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button type="danger" size="small">删除</el-button>
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
  import * as type from '../../../store/image/mutations_types'

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
    watch: {
      // 当使用路由参数时，例如从 /user/foo 导航到 user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。
      $route (to) {
        this.listLoading = true
        this.listImage()
          .then(data => {
            this.listLoading = false
          })
      }
    },
    computed: {
      ...mapState({
        images (state) {
          return state.image.images.images
        },
        total (state) {
          return state.image.images.total
        }
      }),
      filterImages: function () {
        return this.images.slice((this.page - 1) * 20, this.page * 20)
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
      },
      //  获取镜像
      listImage () {
        return this.$store.dispatch(type.FETCH_TABLE_IMAGES, {
          actionType: this.$route.meta.type
        })
      }
    },
    mounted () {
      this.listLoading = true
      this.listImage()
        .then(() => {
          this.listLoading = false
        })
    }
  }
</script>

<style scoped>
</style>
