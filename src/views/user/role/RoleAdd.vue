<template>
  <section>

    <el-form :label-position="labelPosition" :model="formName" label-width="85px" ref="formName"
             class="bodybar">
      <el-form-item label="角色名" prop="name" :rules="[
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {pattern: /^[\u4e00-\u9fa5A-Za-z0-9]+$/, message: '名称只能包含字母、数字和中文字符', trigger: 'blur'},
          {max: 25, message: '长度不能超过25个字符', trigger: 'blur' }]">
        <el-input type="text" v-model="formName.name" placeholder="请输入角色名"></el-input>
      </el-form-item>

      <el-form-item label="角色描述" prop="remarks">
        <el-input type="textarea" v-model="formName.remarks" autosize placeholder="请输入角色描述">
        </el-input>
      </el-form-item>

      <el-form-item label="角色资源" prop="roleIds" required>
        <el-tree  v-model="formName.roleIds"
          :data="menusTree"
          :props="props"
          node-key="id"
          show-checkbox
          ref="tree">
        </el-tree>
      </el-form-item>

      <div class="btn">
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm" v-bind:disabled="formName.beDisabled" class="btn">创建</el-button>
      </div>

    </el-form>

  </section>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import * as type from '../../../store/syssrc/mutations_types'
  import * as roleType from '../../../store/roles/mutations_types'
  import { Notification } from 'element-ui'

  export default {
    data () {
      return {
        props: {
          id: 'id',
          label: 'remark',
          children: 'childNode'
        },
        count: 1,
        formName: {
          name: '',
          remarks: '',
          delFlag: 0
        },
        roleIds: '',
        beDisabled: true,
        labelPosition: 'left'
      }
    },
    computed: {
      ...mapState({
        menusTree (state) {
          return state.syssrc.menusTree
        }
      })
    },
    methods: {
      ...mapActions({
     //  fetchFirstMenus: type.FETCH_FIRST_MENU_RESOURCE,
        fetchAllMenus: type.FETCH_ALL_MENU_RESOURCE
      }),
      handleCheckChange (data) {
        this.roleIds.push(data.id)
      },
      cancelForm: function () {
        this.$router.push({name: '角色管理'})
      },
      submitForm: function () {
        this.roleIds = this.$refs.tree.getCheckedNodes()
        let params = JSON.parse(JSON.stringify(this.roleIds))
//        let keyMap = new Map()
   //     let ids = []
        var ids = new Set()
        for (let p of params) {
          let keys = Object.keys(p)
          for (let key of keys) {
            if (key === 'parentId' || key === 'id') {
              if (p[key] !== 0) {
                ids.add(p[key])
              }
            }
          }
        }
   //     console.log(JSON.stringify(ids))
   //      console.log(JSON.stringify(this.roleIds))
        let parm = {sysRole: this.formName, roleIds: JSON.parse(JSON.stringify(ids))}
     //   console.log(JSON.stringify(parm))
        if (ids.size !== 0) {
          this.$refs.formName.validate((valid) => {
            if (valid) {
              this.$store.dispatch(roleType.FETCH_SYS_ROLE_ADD, parm).then((data) => {
                this.showResult(data, '角色创建成功!', '角色创建出错', () => {
                  this.$router.push({name: '角色管理'})
                })
              })
            } else {
              return false
            }
          })
        } else {
          this.$message.error('请选择角色资源')
        }
/*        this.$refs.formName.validate((valid) => {
          if (valid) {
            this.$store.dispatch(roleType.FETCH_SYS_ROLE_ADD, parm).then((data) => {
              this.showResult(data, '角色创建成功!', '角色创建出错', () => {
                this.$router.push({name: '角色管理'})
              })
            })
          } else {
            return false
          }
        }) */
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
      this.fetchAllMenus()
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
