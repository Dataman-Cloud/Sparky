<template>
	<section class="bodybar">
		 <el-form :label-position="labelPosition" :model="formName" label-width="95px" ref="formName">
			<el-form-item label="名称" prop="name" :rules="[
				{ required: true, message: '请输入名称', trigger: 'blur' }]">
				<el-input type="text" v-model="formName.name" placeholder="请输名称"></el-input>
			</el-form-item>
			 <el-form-item label="用户描述">
				<el-input type="textarea" v-model="formName.description" autosize placeholder="请输入内容"></el-input>
			</el-form-item>
       <div class="btn">
         <el-button type="primary" @click="submitForm" class="btn">完成</el-button>
         <el-button @click="cancelForm">取消</el-button>
       </div>
		 </el-form>
	</section>
</template>

<script>
  import * as type from '@/store/user/mutations_types'
  export default {
    data () {
      return {
        labelPosition: 'left',
        formName: {
          name: ''
        }
      }
    },
    methods: {
      submitForm: function () {
        this.$refs.formName.validate((valid) => {
          if (valid) {
            this.$store.dispatch(type.FETCH_GROUP_ADD, this.formName).then(() => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$router.push({path: '/system/user/group'})
            })
          } else {
            return false
          }
        })
      },
      cancelForm: function () {
        this.$router.push({path: '/system/user/group'})
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
