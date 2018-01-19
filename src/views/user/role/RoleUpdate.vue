<template>
  <section>

    <el-form :label-position="labelPosition" :model="formName" label-width="85px" ref="formName"
             class="bodybar">
      <el-form-item label="角色名称" prop="name" :rules="[
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {max: 50, message: '长度不能超过50个字符', trigger: 'blur' }]">
        <el-col :span="8">
        <el-input v-model="formName.name"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="角色资源" prop="roleIds" required>
        <el-col :span="12">
        <el-tree
          :data="checkedMenusTree"
          :props="props"
          node-key="id"
          show-checkbox
          ref="tree">
   //     default-checked-keys="sysSrcRole">
        </el-tree>
        </el-col>
      </el-form-item>

      <el-form-item label="角色标签" prop="remarks">
        <el-col :span="12">
        <el-input type="textarea" v-model="formName.remarks" autosize :maxlength="255">
        </el-input>
        </el-col>
      </el-form-item>

      <el-form-item>
        <el-button @click="cancelForm">取消</el-button>
        <el-button type="primary" @click="submitForm" v-bind:disabled="formName.beDisabled" class="btn">更新</el-button>
      </el-form-item>

    </el-form>

  </section>
</template>

<script>
  // , mapActions
  import {mapState, mapActions} from 'vuex'
  import * as type from '../../../store/syssrc/mutations_types'
  import * as sysRecRoletype from '../../../store/syssrcrole/mutations_types'
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
        formName: {
          name: this.$route.query.role.name,
          remarks: this.$route.query.role.remarks,
          id: this.$route.query.role.id,
          delFlag: 0
        },
        roleIds: '',
        beDisabled: true,
        labelPosition: 'left'
      }
    },
    computed: {
      ...mapState({
        checkedMenusTree (state) {
        //  return state.syssrc.checkedMenusTree
          return state.syssrc.menusTree
        },
        sysSrcRole (state) {
          return state.syssrcrole.sysResRole
        }
      })
    },
    methods: {
      ...mapActions({
        fetchAllMenus: type.FETCH_ALL_MENU_RESOURCE
      }),
      cancelForm: function () {
        this.$router.push({name: '角色管理'})
      },
/*      fetchSelectedRes () {
        this.$store.dispatch(sysRecRoletype.FETCH_SYSRESOURCE_ROLE_BY_ID, this.formName.id)
      }, */
      submitForm: function () {
        this.roleIds = this.$refs.tree.getCheckedNodes()
        let params = JSON.parse(JSON.stringify(this.roleIds))
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
        let parm = {sysRole: this.formName, roleIds: JSON.parse(JSON.stringify(ids))}
        console.log(JSON.stringify(ids))
        if (ids.size !== 0) {
          this.$refs.formName.validate((valid) => {
            if (valid) {
              this.$store.dispatch(roleType.FETCH_SYS_ROLE_UPDATE, parm).then((data) => {
                this.showResult(data, '角色更新成功!', '角色更新出错', () => {
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
      },
  /*    fetchSysMenusRes () {
        this.$store.dispatch(type.FETCH_ALL_CHECKED_MENU_RESOURCE, this.formName.id)
        // this.$store.dispatch(sysRecRoletype.FETCH_SYSRESOURCE_ROLE_BY_ID, this.formName.id)
      }, */
      fetchselected () {
        this.$store.dispatch(sysRecRoletype.FETCH_SYSRESOURCE_ROLE_BY_ID, this.formName.id).then((data) => {
          let ids = data.data
          console.log(JSON.stringify(ids))
//          this.$refs.tree.setCheckedNodes(ids)
          this.$refs.tree.setCheckedKeys(ids)
        })
      }
    },
    mounted () {
    //  this.fetchSysMenusRes()
      this.fetchAllMenus()
      this.fetchselected()
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
