<template>
  <el-col :span="24" class="breadcrumb-container">
<!--    <strong class="title">{{$route.name}}</strong> -->
    <el-breadcrumb separator="/" class="breadcrumb-inner">
      <el-breadcrumb-item v-for="item in $route.matched" :to="item" :key="item.name">
        {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </el-col>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.breadcrumb-container {

  .title {
    width: 200px;
    float: left;
    color: #475669;
    font-size: 18px;
  }

  .breadcrumb-inner {
    float: left;
    margin-bottom: 20px;
  }
}
</style>
