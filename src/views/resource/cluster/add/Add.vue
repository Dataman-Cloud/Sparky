<template>
  <section>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="集群名称" prop="clusterLabel">
            <el-input v-model="form.vClusterLabel"></el-input>
          </el-form-item>
          <el-form-item label="所属用户组" prop="groupId">
            <el-select v-model="form.groupId" placeholder="请选用户组">
              <el-option
                v-for="group in grouplist"
                :key="group.name"
                :label="group.name"
                :value="group.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="desc">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button @click="onCancel">取消</el-button>
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
      var checkGroupId = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请选用户组'))
        } else {
          callback()
        }
      }
      return {
        form: {
          vClusterLabel: '',
          groupId: '',
          description: ''
        },
        rules: {
          vClusterLabel: [
            {required: true, message: '集群名称', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          groupId: [
            {validator: checkGroupId, trigger: 'change'}
          ],
          description: [
            {required: true, message: '请填写活动形式', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ]
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
            this.$store.dispatch(clustersType.ADD_CLUSTERS, this.form).then(() => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onCancel () {
        console.log('取消')
        this.$router.push({path: '/resouces/cluster/list'})
      },
      listGroup () {
        return this.$store.dispatch(userType.FETCH_GROUPS)
      }
    },
    mounted () {
      this.listGroup()
    }
  }

</script>

<style scoped>

</style>
