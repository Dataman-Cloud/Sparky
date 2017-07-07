<template>
  <section>
    <el-col :span="24" class="content-wrapper">
      <transition name="fade" mode="out-in">
        <router-view :key="key"></router-view>
      </transition>
    </el-col>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style lang="css" scoped>
.content-wrapper {
  background-color: #fff;
  box-sizing: border-box;
}
</style>
