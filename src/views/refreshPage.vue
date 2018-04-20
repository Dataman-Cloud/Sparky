<template>
</template>
<script>
  export default {
    data () {
      return {
        toName: this.$route.params.toName || '我的应用',
        params: this.$route.params.params || null
      }
    },
    methods: {
      refresh () {
        console.log('to:' + this.toName)
        // this.$router.push({name: this.toName})
        try {
          this.$router.push({name: this.toName, params: this.params})
        } catch (err) {
          this.$router.push({name: '我的应用'})
        }
      }
    },
    mounted () {
      this.refresh()
    }
  }
</script>
