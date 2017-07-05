<template>
  <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
           @select="handleSelect"
           unique-opened router>
    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden && isshow (item.name)">
      <el-submenu :index="index+''"  :key="index">
        <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
        <el-menu-item v-for="child in item.children" :index="`${item.path}/${child.path}`" v-if="!child.hidden && isshow(child.name)" :key="child.path">
          {{child.name}}
        </el-menu-item>
      </el-submenu>
      <!--<el-menu-item v-if="item.leaf&&item.children.length>0" :index="`${item.path}/${item.children[0].path}`"><i-->
        <!--:class="item.iconCls"></i>{{item.children[0].name}}-->
      <!--</el-menu-item>-->
    </template>
  </el-menu>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data () {
      return {}
    },
    computed: {
      ...mapState({
        sysResources (state) {
          return state.user.sysResources
        }
      })
    },
    methods: {
      handleOpen (key, keyPath) {
      },
      handleClose (key, keyPath) {
      },
      handleSelect: function (a, b) {
      },
      isshow (routeName) {
        console.log(routeName)
        return this.sysResources.filter(res => res.resourceName === routeName).length > 0
      }
    },
    mounted () {
      console.log(this.$router.options.routes)
    }
  }
</script>

<style scoped lang="scss" type="text/scss">

</style>
