<template>
  <section>
    <el-form :label-position="labelPosition" :model="formName" label-width="120px" ref="formName"  class="bodybar">
      <el-form-item label="名称" prop="name" :rules="[{required: true, message: '请输入名称', trigger: 'blur'},
          {max: 50, message: '长度不能超过50个字符', trigger: 'blur' }]">
        <el-col :span="4">
        <el-input v-model="formName.name" placeholder="请输入名称"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="镜像仓库地址" prop="addr" :rules="[
          {max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
          { required: true, message: '请输入镜像仓库地址', trigger: 'blur' }]">
        <el-col :span="8">
        <el-input v-model="formName.addr" placeholder="请输入镜像仓库地址"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="用户名" prop="userName" :rules="[
          {max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
          { required: true, message: '请输入用户名', trigger: 'blur' }]">
        <el-col :span="4">
        <el-input type="text" v-model="formName.userName" placeholder="请输入用户名"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="密码" prop="password" :rules="[
          {max: 100, message: '长度不能超过100个字符', trigger: 'blur' },
          { required: true, message: '请输入密码', trigger: 'blur' }]">
        <el-col :span="4">
        <el-input type="password" v-model="formName.password" placeholder="请输入密码"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm" class="btn">创建</el-button>
      </el-form-item>

    </el-form>

  </section>
</template>

<script>
  import * as type from '../../../store/user/mutations_types'

  export default {
    data () {
      return {
        formName: {
          name: '',
          userName: '',
          addr: '',
          password: ''
        },
        labelPosition: 'left'
      }
    },
    computed: {
    },
    methods: {
      cancelForm: function () {
        this.$router.push({path: '/center/user/repoCertify'})
      },
      submitForm: function () {
        this.$refs.formName.validate((valid) => {
          if (valid) {
            console.info(JSON.stringify(this.formName))
            this.$store.dispatch(type.FETCH_REPO_ADD, this.formName).then(() => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$router.push({path: '/center/user/repoCertify'})
            })
          } else {
            return false
          }
        })
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>
  .errMsg {
    color: red;
  }
  .btn {
    text-align: center;
    margin: 15px;
  }
  .breadcrumb {
    margin: 15px 0;
  }
  .bodybar {
    margin: 25px 0 0 0;
  }
</style>
