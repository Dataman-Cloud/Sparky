<template>
  <el-dialog title="添加集群" v-model="dialog_addCluster" size="tiny" style="text-align: left" ref="dialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="集群名称" prop="vClusterLabel">
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
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialog_addCluster = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit(form)">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
import * as type from '@/store/user/mutations_types'

export default {
  data () {
    let checkGroupId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选用户组'))
      } else {
        callback()
      }
    }
    return {
      dialog_addCluster: false,
      form: {
        vClusterLabel: '',
        groupId: '',
        desc: ''
      },
      rules: {
        vClusterLabel: [
          {required: true, message: '集群名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        groupId: [
          {validator: checkGroupId, trigger: 'change'}
        ]
/*        desc: [
          {required: true, message: '请填写活动形式', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ] */
      }
    }
  },
  computed: {
    ...mapState({
      grouplist ({ user }) {
        return user.groups.groups
      }
    })
  },
  methods: {
    open (data = {}) {
      this.form = {
        vClusterLabel: '',
        groupId: data.groupId || '',
        desc: ''
      }
      this.$refs.dialog.open()
    },
    onSubmit (form) {
      console.log(form)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('ok', this.form)
          this.dialog_addCluster = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    listGroup () {
      return this.$store.dispatch(type.FETCH_GROUPS)
    }
  },
  mounted () {
    this.listGroup()
  }
}
</script>

<style lang="css">
</style>
