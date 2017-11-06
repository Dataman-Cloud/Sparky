<template>
<section>
  <el-form :label-position="labelPosition" :model="formName" label-width="85px" ref="formName" class="bodybar">
    <el-form-item label="姓名" prop="name" :rules="[{required: true, message: '请输入姓名', trigger: 'blur'},
          {max: 25, message: '长度不能超过25个字符', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5A-Za-z0-9]+$/, message: '名称只能包含字母、数字和中文字符', trigger: 'blur'}]">
      <el-input v-model="formName.name"></el-input>
    </el-form-item>

    <el-form-item label="邮箱地址" prop="email" :rules="[
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]">
      <el-input v-model="formName.email"></el-input>
    </el-form-item>

    <el-form-item label="用户角色" prop="roleId" required>
      <el-col :span="18">
        <el-radio-group v-model="formName.roleId" v-for="(item, index) in UserRoles" :key="index">
          <el-radio :label="item.id" style="padding-right: 5px;">{{item.name}}</el-radio>
        </el-radio-group>
      </el-col>
    </el-form-item>

    <el-form-item label="用户描述" prop="title">
      <el-input type="textarea" autosize v-model="formName.desc">
      </el-input>
    </el-form-item>
    <div class="btn">
      <el-button type="primary" @click="submitForm(formName)" class="btn">更新</el-button>
      <el-button @click="cancelForm">取消</el-button>
    </div>

  </el-form>

</section>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import * as type from '../../../store/user/mutations_types'
  import * as roleType from '../../../store/roles/mutations_types'

  export default {
    data () {
      return {
        formName: {
          name: this.$route.query.user.name,
          email: this.$route.query.user.email,
          desc: this.$route.query.user.title,
          roleId: 1,
          id: this.$route.query.user.id
        },
        labelPosition: 'left'
      }
    },
    computed: {
      ...mapState({
        UserRoles (state) {
          return state.roles.roles.roles
        },
        UserRolesTotal (state) {
          return state.roles.roles.total
        },
        roleId (state) {
          return state.roles.roleId
        }
      })
    },
    methods: {
      ...mapActions({
        fetchRoles: roleType.FETCH_ROLES
      }),
      cancelForm: function () {
        this.$router.push({path: '/system/user/list'})
      },
      submitForm: function (user) {
        this.$refs.formName.validate((valid) => {
          if (valid) {
//           this.$route.query.user = this.formName.user
//            this.$route.query.user.email = this.formName.email
//            this.$route.query.user.desc = this.formName.desc
            this.$store.dispatch(type.FETCH_USERS_EDIT, user).then(() => {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.$router.push({path: '/system/user/list'})
            })
          } else {
            return false
          }
        })
      },
      roleInfo: function () {
        this.$store.dispatch(roleType.FETCH_ROLEID_BY_USERID, this.$route.query.user.id).then((data) => {
          this.formName.roleId = data.data
        })
      }
    },
    mounted () {
      this.fetchRoles()
      this.roleInfo()
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
