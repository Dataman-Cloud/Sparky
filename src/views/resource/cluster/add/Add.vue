<template>
  <section>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
          <el-form-item label="集群名称" :rules="[
            {required: true, message: '集群名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'},
            {pattern: /^[a-z0-9-]+$/, message: '名称只能包含小写字母、数字及中划线', trigger: 'blur'}]" prop="vClusterLabel">
            <el-input v-model="form.vClusterLabel"></el-input>
          </el-form-item>
          <el-form-item label="所属用户组" prop="groupId" :rules="[{ required: true, message: '请选择组' } ]">
            <el-select v-model="form.groupId" placeholder="请选用户组">
              <el-option
                v-for="group in grouplist"
                :key="group.name"
                :label="group.name"
                :value="group.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" :rules="[{max: 15, message: '长度小于15', trigger: 'blur'}]" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="onCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>
<script>
  import {mapState} from 'vuex'
  import * as userType from '../../../../store/user/mutations_types'
  import * as clustersType from '../../../../store/clusters/mutations_types'

  export default {
    data () {
      return {
        form: {
          vClusterLabel: '',
          groupId: '',
          description: ''
        },
        rules: {
        }
      }
    },
    computed: {
      ...mapState({
        grouplist (state) {
          return state.user.groups.groups
        }
      })
    },
    methods: {
      onSubmit () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            console.log(this.form)
            this.$store.dispatch(clustersType.ADD_CLUSTERS, this.form).then((data) => {
              if (data.resultCode === '00') {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  onClose: this.goList
                })
              } else {
                this.$message({
                  message: data.message,
                  type: 'error'
                })
              }
            })
          } else {
            // console.log('error submit!!')
            return false
          }
        })
      },
      onCancel () {
        // console.log('取消')
        this.$router.push({name: '集群'})
      },
      listGroup () {
        return this.$store.dispatch(userType.FETCH_GROUPS)
      },
      goList () {
        this.$router.push('/resource/cluster/list')
      }
    },
    mounted () {
      this.listGroup()
    }
  }

</script>

<style scoped>

</style>
