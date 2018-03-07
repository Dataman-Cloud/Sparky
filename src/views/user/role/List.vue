<template>
  <section>
    <div class="top">
      <el-button icon="plus" type="primary" v-showBtn="roleAdd" @click="roleAdd">添加角色</el-button>
    </div>

    <el-table :data="filterRoles" highlight-current-row v-loading="listLoading" class="bodybar">
      <el-table-column prop="id" label="ID" min-width="40" sortable>
      </el-table-column>
      <el-table-column prop="remarks" label="角色名称" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="name" label="描述" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="150">
        <template scope="role">
          {{role.row.createTime | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" min-width="150">
        <template scope="role">
          {{role.row.updateTime | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template scope="role">
        <!--  <el-button size="mini" v-showBtn="roleEdit"  @click="roleEdit(role.row)">更新</el-button> -->
          <router-link :to="{name: '编辑角色', query: { role: role.row }}">
            <el-button size="mini"  v-showBtn="roleEdit">编  辑</el-button>
          </router-link>
          <el-button size="mini" v-showBtn="roleDel"  @click="roleDel(role.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="prev, pager, next" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize" :total="UserRolesTotal"
                     style="float:right;">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../store/roles/mutations_types'

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
        UserRoles (state) {
          return state.roles.roles.roles
        },
        UserRolesTotal (state) {
          return state.roles.roles.total
        }
      }),
      filterRoles: function () {
        return this.UserRoles.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
      }
    },
    methods: {
      handleCurrentChange (val) {
        this.page = val
      },
      roleAdd () {
        this.$router.push({name: '添加角色'})
      },
      listRoles () {
        return this.$store.dispatch(type.FETCH_ROLES)
      },
      roleEdit (role) {},
      roleDel (role) {
        this.$confirm('此操作将永久删除该角色信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch(type.FETCH_SYS_ROLE_DEL, role.id).then((data) => {
            if (data.resultCode === '00') {
              this.$message({
                message: '删除成功',
                type: 'success',
                onClose: this.listRoles
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
      this.listRoles()
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
