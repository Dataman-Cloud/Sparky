<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-button type="primary" @click = "addAppModel" v-showBtn="addCatalog" >创建应用模版</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-showBtn="packagePublish" @click = "catalogStackCreate">{{CatalogStackCreate}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <!--列表-->
    <el-table :data="filterModels" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="name" label="模版名称" min-width="65" sortable  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="accountsName" label="创建者" width="100" sortable >
      </el-table-column>
      <el-table-column prop="groupName" label="所属组" width="150" sortable>
      </el-table-column>
      <el-table-column prop="desc" label="描述" min-width="100" sortable  show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" min-width="70" sortable>
        <template scope="app">
          {{app.row.createdAt | moment("YYYY/MM/DD HH:mm:ss")}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="165" show-overflow-tooltip>
        <template scope="scope">
                <el-button v-if="!isCatalogStackCreate" v-showBtn="catalogInfo" type="info" size="mini"  @click="info(scope.$index)">详情</el-button>
                <el-button v-if="!isCatalogStackCreate" v-showBtn="catalogUpdate" type="success" size="mini" @click="updataAppModel(scope.$index)">更新</el-button>
                <!-- 当前不为程序包发布，并且该登录用户有操作此模板的权限 -->
                <el-button v-if="!isCatalogStackCreate && scope.row.isRole" v-showBtn="catalogDel" type="danger" size="mini" @click="removeModel(scope.$index)">删除</el-button>
                <el-button v-if="isCatalogStackCreate" v-showBtn="packagePublish" type="success" size="mini" @click="catalogStackCreatePage(scope.$index)">程序包发布</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination layout="total, prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
                     style="float:right;">
      </el-pagination>
    </el-col>
    <!-- 弹出层 -->
    <el-dialog
      :title="this.dialogMessage.name"
      :visible.sync="dialogVisible"
      size="tiny"
    >
      <span >创建人：</span><span >{{dialogMessage.accountName}}</span><br/>
      <span >所属组：</span><span >{{dialogMessage.groupName}}</span><br/><br/>
      <span>{{dialogMessage.desc}}</span>
      <div class="">
        <codemirror v-model="this.dialogMessage.json" class="codemirror">
        </codemirror>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import {LABEL_PREFIX} from '@/config'
  import * as type from '@/store/model/mutations_types'
  import Codemirror from '@/components/jsonEditor/index'

  export default {
    components: {
      Codemirror
    },
    data () {
      return {
        filters: {
          name: '00000'
        },
        isCatalogStackCreate: false, // 程序包发布
        CatalogStackCreate: '程序包发布', // 程序包发布文字
        isRole: false, // 是否对某一模版拥有权限
        page: 1, // 默认当前第1页
        pageSize: 10, // 一页显示几条数据
        listLoading: false,
        dialogVisible: false,
        dialogMessage: {
          name: '',
          accountName: '',
          groupName: '',
          desc: '',
          json: ''
        },
        prefix: LABEL_PREFIX,
        interval: null
      }
    },
    watch: {
      // 当使用路由参数时，例如从 /user/foo 导航到 user/bar，原来的组件实例会被复用。因为两个路由都渲染同个组件，比起销毁再创建，复用则显得更加高效。
      $route (to) {
        this.page = 1
        this.listLoading = true
        this.listModel()
          .then(data => {
            this.listLoading = false
          })
      }
    },
    computed: {
      ...mapState({
        curGroupId ({ user }) {
          return user.aboutme.currentGroupID
        },
        models ({ model }) {
          return model.model.models
        },
        total ({ model }) {
          return model.model.total
        },
        getUserInfo ({ user }) {
          return user.aboutme
        }
      }),
      filterModels () {
        // 从已有数组中返回元素
        if (this.models && Array.isArray(this.models) && this.models.length > 0) {
          // 获取列表数据
          let modelList = this.models.slice((this.page - 1) * this.pageSize, this.page * this.pageSize)
          /* -- 判断权限 -- */
          // 当前登录用户的当前组信息
          let groups = []
          let group = {}
          for (let v of this.getUserInfo.accountGroups) {
            if (this.getUserInfo.currentGroupId === v.groupId) {
              groups.push(v)
            }
          }
          for (let v of groups) { // 取最大的权限
            if (this.getUserInfo.userName === 'admin') { // 超管
              group = {'role': 'superuser'}
              break
            } else if (v.role === 'owner') { // 组管理员
              group = v
              break
            } else if (v.role === 'member') { // 普通组员
              group = v
            }
          }
          // 循环列表数据 判断权限
          for (let v of modelList) {
            // 默认没有权限
            v['isRole'] = false
            if (group.role === 'superuser') { // 超管有权限
              v['isRole'] = true
            } else if (group.role === 'owner' && group.groupId === v.groupId) { // 为该模板的创建组并为组管理员
              v['isRole'] = true
            } else if (group.role === 'member' && this.getUserInfo.id === v.accountId) { // 为组员但为该模板的创建者
              v['isRole'] = true
            } else if (v.accountsName === 'admin') { // 该模版的创建者为超管
              v['isRole'] = true
            }
          }
          return modelList
        } else {
          return []
        }
      }
    },
    methods: {
      // 模版详情弹出层
      info (index) {
        this.dialogVisible = true
        this.dialogMessage.name = this.filterModels[index].name
        this.dialogMessage.accountName = this.filterModels[index].accountsName
        this.dialogMessage.groupName = this.filterModels[index].groupName
        this.dialogMessage.desc = this.filterModels[index].desc
        this.dialogMessage.json = this.filterModels[index].json
      },
      // 删除模版按钮
      removeModel (index) {
        this.$confirm('是否删除应用模版', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 确定后请求删除接口
          return this.$store.dispatch(type.FETCH_REMOVE_MODEL, {
            modelID: this.filterModels[index].id
          }).then(() => {
            this.listModel()
              .then(data => {
                // 删除成功后重新请求数据
                this.listLoading = false
                // 删除成功提示
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              })
          })
        })
      },
      handleCurrentChange (val) {
        this.page = val
      },
      //  获取用户列表
      listModel () {
        return this.$store.dispatch(type.FETCH_SELECT_MODEL, {
          curGroupId: this.curGroupId
        }).then(() => {})
      },
      // 添加新的应用模版
      addAppModel () {
        this.$router.push({path: '/app/list/addModel'})
      },
      // 更新应用模版
      updataAppModel (index) {
        this.$router.push({path: '/app/list/updateModel', query: {'id': this.filterModels[index].id}})
      },
      // 程序包发布
      catalogStackCreate () {
        if (this.isCatalogStackCreate === false) {
          this.isCatalogStackCreate = true
          this.CatalogStackCreate = '取消'
        } else if (this.isCatalogStackCreate === true) {
          this.isCatalogStackCreate = false
          this.CatalogStackCreate = '程序包发布'
        }
      },
      // 进入程序包发布页面
      catalogStackCreatePage (index) {
        this.$router.push({path: '/app/list/catalogStackCreate', query: {'id': this.filterModels[index].id}})
      }
    },
    mounted () {
      this.listLoading = true
      this.listModel()
        .then(() => {
          this.listLoading = false
        })
      // 判断是否为程序包发布页面
      if (this.$route.path === '/app/list/catalogStackList') {
        this.isCatalogStackCreate = true
        this.CatalogStackCreate = '取消'
      }
      // this.interval = setInterval(() => this.listModel(), 5000)
    },
    beforeDestroy: function () {
      // clearInterval(this.interval)
    }
  }
</script>

<style scoped>
</style>
