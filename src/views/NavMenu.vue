<template>
  <el-menu :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
           @select="handleSelect"
           unique-opened router>
    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
      <el-submenu :index="index+''" v-if="!item.leaf">
        <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
        <el-menu-item v-for="child in item.children" :index="`${item.path}/${child.path}`" v-if="!child.hidden">
          {{child.name}}
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-if="item.leaf&&item.children.length>0" :index="`${item.path}/${item.children[0].path}`"><i
        :class="item.iconCls"></i>{{item.children[0].name}}
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
  export default {
    data () {
      return {}
    },
    methods: {
      handleOpen (key, keyPath) {
      },
      handleClose (key, keyPath) {
      },
      handleSelect: function (a, b) {
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
