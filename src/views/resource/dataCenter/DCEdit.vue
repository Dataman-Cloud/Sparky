<template>
  <section>

    <el-form :label-position="labelPosition" :model="formName" label-width="85px" ref="formName"
             class="bodybar">
      <el-form-item label="名称" prop="name" :rules="[
          { required: true, message: '请输入数据中心名称', trigger: 'blur' },
          {max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' }]">
        <el-input v-model="formName.name"></el-input>
      </el-form-item>

      <el-form-item label="url" prop="url" :rules="[
          { required: true, message: '请输入url', trigger: 'blur' }]">
        <!--{pattern: /^[http|https]+:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/, message: 'url格式错误', trigger: 'blur'}-->
        <el-input v-model="formName.url"></el-input>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="formName.description" autosize>
        </el-input>
      </el-form-item>

      <div class="btn">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm(formName)" v-bind:disabled="formName.beDisabled" class="btn">更新</el-button>
      </div>

    </el-form>

  </section>
</template>

<script>
  // , mapActions
  import {mapState} from 'vuex'
  import * as type from '../../../store/datacenter/mutations_types'
  import { Notification } from 'element-ui'

  export default {
    data () {
      return {
        formName: {
          name: this.$route.query.datacenter.name,
          url: this.$route.query.datacenter.url,
          description: this.$route.query.datacenter.description,
          updateBy: '',
          createBy: this.$route.query.datacenter.createBy,
          createTime: this.$route.query.datacenter.createTime,
          updateTime: '',
          id: this.$route.query.datacenter.id
        },
        beDisabled: true,
        labelPosition: 'left'
      }
    },
    computed: {
      ...mapState({
      })
    },
    methods: {
      cancelForm: function () {
        this.$router.push({name: '数据中心'})
      },
      submitForm: function (dc) {
        this.$refs.formName.validate((valid) => {
          if (valid) {
            this.$store.dispatch(type.DATACENTER_UPDATE, dc).then(() => {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.$router.push({name: '数据中心'})
            })
          } else {
            return false
          }
        })
      },
      showResult (data, success, errorTitle, callback) {
        success = success || '操作成功'
        errorTitle = errorTitle || '操作失败'
        if (data.resultCode === '00') {
          // 删除成功后重新请求数据
          // 删除成功提示
          this.$message({
            type: 'success',
            message: success
          })
          if (callback) {
            callback()
          }
        } else {
          Notification({
            title: errorTitle,
            message: JSON.stringify(data.message),
            type: 'error'
          })
        }
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
  .addGroup {
    display: inline-block;
    width: 30%;
  }
</style>
