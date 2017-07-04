<template>
	<section>
		 <el-form :label-position="labelPosition" :rules="rules" :model="formName" label-width="95px" ref="formName" class="bodybar">
			<el-form-item label="旧密码" prop="oldpassword" :rules="[
				{ required: true, message: '请输入旧密码', trigger: 'blur' }]">
				<el-input type="password" v-model="formName.oldpassword"  placeholder="请输入旧密码"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="password">
				<el-input type="password" v-model="formName.password" placeholder="请输入新密码"></el-input>
			</el-form-item>
			<el-form-item label="确认新密码" prop="chkpwd">
				<el-input type="password" v-model="formName.chkpwd"  placeholder="请重新输入新密码"></el-input>
			</el-form-item>
       <div  class="btn">
         <el-button type="primary" @click="submitForm('formName')">完成</el-button>
       </div>
     </el-form>
	</section>
</template>

<script>
  import * as type from '../../../store/user/mutations_types'

  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value === this.formName.oldpassword) {
          callback(new Error('新密码和旧密码一致,请重新输入新密码!'))
        } else {
          if (this.formName.chkpwd !== '') {
            this.$refs.formName.validateField('chkpwd')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.formName.password) {
          callback(new Error('两次输入新密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        rules: {
          password: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          chkpwd: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        },
        labelPosition: 'left',
        formName: {
          oldpassword: '',
          password: '',
          chkpwd: ''
        }
      }
    },
    methods: {
      submitForm: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.info(JSON.stringify(this.formName))
            this.$store.dispatch(type.USER_CHGPWD, this.formName).then(() => {
              this.$message({
                message: '密码修改成功',
                type: 'success'
              })
              this.$router.push({path: '/center/user/info'})
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .bodybar {
    margin-top: 40px;
  }
  .btn {
    text-align: center;
  }
</style>
