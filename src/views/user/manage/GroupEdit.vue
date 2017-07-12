<template>
	<section class="bodybar">
		 <el-form :label-position="labelPosition" :model="formName" label-width="95px" ref="formName">
			<el-form-item label="名称" prop="name" :rules="[
				{ required: true, message: '请输入名称', trigger: 'blur' }]">
				<el-input type="text" v-model="formName.name" @blur="inputBlur('name',formName.name)"></el-input>
			</el-form-item>
			 <el-form-item label="用户描述">
				<el-input type="textarea" autosize></el-input>
			</el-form-item>
       <div class="btn">
         <el-button type="primary" @click="submitForm('formName')" v-bind:disabled="formName.beDisabled" class="btn">更新</el-button>
         <el-button @click="cancelForm">取消</el-button>
       </div>
		 </el-form>
	</section>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'left',
      beDisabled: true,
      formName: {
        name: ''
      }
    }
  },
  methods: {
    submitForm: function (formName) {
      this.$router.push({path: '/system/user/group'})
    },
    cancelForm: function () {
      this.$router.push({path: '/system/user/group'})
    },
    inputBlur: function (errorItem, inputContent) {
      // 对于按钮的状态进行修改
      if (this.formName.name !== '') {
        this.formName.beDisabled = false
      } else {
        this.formName.beDisabled = true
      }
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
