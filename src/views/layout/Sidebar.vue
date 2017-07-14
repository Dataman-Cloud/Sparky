<template>
  <aside class="menu-expanded">
    <el-menu :default-active="$route.path" mode="vertical" unique-opened>
      <sidebar-item :routes='permissionRoutes'/>
    </el-menu>
 </aside>
</template>

<script>
  import { mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'

  export default {
    components: { SidebarItem },
    computed: {
      ...mapGetters([
        'permissionRoutes'
      ])
    },
    methods: {
    },
    mounted () {
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
