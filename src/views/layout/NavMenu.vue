<template>
  <aside class="menu-expanded">
    <el-menu :default-active="$route.path" mode="vertical" unique-opened router>
      <template v-for="(item,index) in permissionRoutes" v-if="!item.hidden">
        <el-submenu :index="index+''"  :key="index">
          <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
          <el-menu-item v-for="child in item.children" :index="`${item.path}/${child.path}`" v-if="!child.hidden" :key="child.path">
            {{child.name}}
          </el-menu-item>
        </el-submenu>
        <!--<el-menu-item v-if="item.leaf&&item.children.length>0" :index="`${item.path}/${item.children[0].path}`"><i-->
          <!--:class="item.iconCls"></i>{{item.children[0].name}}-->
        <!--</el-menu-item>-->
      </template>
    </el-menu>
  </aside>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'permissionRoutes'
      ])
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
aside {
  flex: 0 0 230px;
  width: 230px;
  .el-menu {
    height: 100%;
  }
}
</style>
