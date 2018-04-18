<template>
	<section>
		<div class="top">
      <el-button icon="plus" type="primary" v-showBtn="repAdd" @click="repAdd">镜像仓库添加</el-button>
    </div>

    <el-table :data="filterRepos" highlight-current-row v-loading="listLoading" class="bodybar">
      <el-table-column prop="name" label="名称" min-width="100" sortable>
      </el-table-column>
      <el-table-column prop="addr" label="镜像地址" min-width="150" sortable>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" min-width="100">
      </el-table-column>
      <el-table-column prop="createAt" label="创建时间" min-width="150">
        <template scope="repos">
          {{repos.row.createAt | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template scope="repos">
          <el-button size="mini" v-showBtn="repUpdate"  @click="repoEdit(repos.row)">更新</el-button>
          <el-button size="mini" v-showBtn="repDel"  @click="repoDel(repos.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="第三方镜像仓库" :visible.sync="dialog_repoEdit" size="tiny">
      <el-form :model="form" ref="form">
        <el-form-item label="名称" prop="name" :rules="[
          {required: true, message: '请输入名称', trigger: 'blur'},
          {pattern: /^[A-Za-z0-9]+$/, message: '名称只能包含字母和数字', trigger: 'blur'},
          {max: 50, message: '长度不能超过50个字符', trigger: 'blur' }]">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="镜像地址" prop="addr" :rules="[
          {max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
          {pattern: /^\S+$/, message: '地址不能包含空格', trigger: 'blur'},
          {required: true, message: '请输入镜像地址', trigger: 'blur' }]">
          <el-input v-model="form.addr" placeholder="请输入镜像地址"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="userName" :rules="[
          {max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
          {pattern: /^[A-Za-z0-9]+$/, message: '用户名只能包含字母和数字', trigger: 'blur'},
          {required: true, message: '请输入用户名', trigger: 'blur' }]">
          <el-input type="text" v-model="form.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password" :rules="[
          {max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
          {pattern: /^\S+$/, message: '密码不能包含空格', trigger: 'blur'},
          {required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialog_repoEdit = false">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </div>

    </el-dialog>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../store/user/mutations_types'

  export default {
    data () {
      return {
        labelPosition: 'left',
        page: 1,
        listLoading: false,
        dialog_repoEdit: false,
        form: {
          name: '',
          addr: '',
          userName: '',
          password: ''
        }
      }
    },
    computed: {
      ...mapState({
        repos (state) {
          return state.user.repos.repos
        },
        total (state) {
          return state.user.repos.total
        }
      }),
      filterRepos: function () {
        return this.repos.slice((this.page - 1) * 20, this.page * 20)
      }
    },
    methods: {
      repAdd () {
        this.$router.push({name: '镜像仓库添加'})
      },
      listRepo () {
        return this.$store.dispatch(type.FETCH_REPOS)
      },
      repoEdit (repo) {
        console.log(JSON.stringify(repo))
        this.form = {
          name: repo.name,
          userName: repo.userName,
          password: repo.password,
          addr: repo.addr,
          id: repo.id
        }
        this.dialog_repoEdit = true
      },
      update () {
        let param = { id: this.form.id, repo: this.form }
        console.log(JSON.stringify(this.form))
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$store.dispatch(type.FETCH_REPO_EDIT, param).then((data) => {
              if (data.resultCode && data.resultCode === '00') {
                this.$message({
                  message: '更新成功',
                  type: 'success',
                  onClose: this.listRepo
                })
                this.dialog_repoEdit = false
              } else {
                this.$message({
                  message: data.message || '更新失败',
                  type: 'error'
                })
              }
            })
          } else {
            return false
          }
        })
      },
      repoDel (repo) {
        this.$confirm('此操作将永久删除该镜像仓库信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.info(JSON.stringify(repo))
          this.$store.dispatch(type.FETCH_REPO_DEL, repo.id).then((data) => {
            if (data.resultCode && data.resultCode === '00') {
              this.$message({
                message: '删除成功',
                type: 'success',
                onClose: this.listRepo
              })
            } else {
              this.$message({
                message: data.message || '删除失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    mounted () {
      this.listLoading = true
      this.listRepo()
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
