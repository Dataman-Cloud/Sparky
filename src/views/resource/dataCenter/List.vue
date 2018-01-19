<template>
  <section>
    <div class="top"><!-- v-showBtn="dcAdd" -->
      <el-button icon="plus" v-showBtn="dcAdd" type="primary" @click="dcAdd">添加数据中心</el-button>
    </div>

    <el-table :data="filterDC" highlight-current-row v-loading="listLoading" class="bodybar">
      <el-table-column prop="id" label="ID" min-width="40" sortable>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="url" label="url" min-width="150">
        <template scope="scope">
          <!--<a :href="dcLink(scope.row)">{{scope.row.url}}</a> -->
          {{scope.row.url}} &nbsp;
          <el-button size="mini"  @click="dcLink(scope.row)">进入</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="120" sortable>
        <template scope="scope">
          {{scope.row.createTime | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="120" sortable>
        <template scope="scope">
          {{scope.row.updateTime | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" min-width="200">
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template scope="scope">
          <router-link :to="{name: '编辑数据中心', query: { datacenter: scope.row }}">
            <el-button v-showBtn="DCEdit" size="mini">编辑</el-button>
          </router-link>
         <!-- <el-button size="mini"  @click="DCEdit(scope.row)">更新</el-button> -->
          <el-button size="mini" v-showBtn="DCDel" @click="DCDel(scope.row)">删除</el-button>
        </template> <!-- v-showBtn="DCDel"    v-showBtn="DCEdit" -->
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize" :total="dataCentersTotal"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../store/datacenter/mutations_types'
  import * as userType from 'store/user/mutations_types'

  export default {
    data () {
      return {
        labelPosition: 'left',
        page: 1,
        pageSize: 15,
        currentPage: 1, // 从第一页开始
        listLoading: false,
        dialog_roleEdit: false
      }
    },
    computed: {
      ...mapState({
        dataCenters (state) {
          return state.dataCenter.dataCenter.dataCenters
        },
        dataCentersTotal (state) {
          return state.dataCenter.dataCenter.total
        }
      }),
      filterDC: function () {
        return this.dataCenters.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
      }
    },
    methods: {
      dcLink (parm) {
        this.$store.dispatch(userType.LOG_OUT).then(data => {
          console.log(JSON.stringify(data))
//          location.reload()
        })
      },
      handleCurrentChange (val) {
        this.page = val
      },
      dcAdd () {
        this.$router.push({name: '添加数据中心'})
      },
      listDataCenters () {
        return this.$store.dispatch(type.FETCH_DATACENTERS)
      },
      DCEdit (dc) {},
      DCDel (dc) {
        this.$confirm('此操作将永久删除该数据中心, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.DATACENTER_DEL, dc.id).then((data) => {
            if (data.resultCode === '00') {
              this.$message({
                message: '删除成功',
                type: 'success',
                onClose: this.listDataCenters
              })
            } else {
              this.$message({
                message: data.message,
                type: 'error'
              })
            }
          })
        })
      }
    },
    mounted () {
      this.listLoading = false
      this.listDataCenters()
        .then(() => {
          this.listLoading = false
        })
    }
  }
</script>

<style scoped>
  .top {
    margin: 20px 0 5px 0 ;
    text-align: left;
  }
  .bodybar {
    width: 100%;
  }
</style>
