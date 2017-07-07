<template>
    <div>
        <template v-for="item in routes">
            <el-menu-item :index="item.path+'/'+item.children[0].path" v-if="!item.hidden&&item.noDropdown&&item.children.length>0">
                <i :class="item.iconCls"></i> {{item.children[0].name}}
            </el-menu-item>
            <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden">
                <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                <template v-for="child in item.children" v-if='!child.hidden'>
                    <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]'></sidebar-item>
                    <el-menu-item :index="item.path+'/'+child.path" v-else>
                        {{child.name}}
                    </el-menu-item>
                </template>
            </el-submenu>
        </template>
    </div>
</template>

<script>

    export default {
      name: 'SidebarItem',
      props: {
        routes: {
          type: Array
        }
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
