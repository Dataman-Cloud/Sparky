<template>
  <div class="time-line">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: {
    accordion: Boolean
  },
  data () {
    return {
      activeNames: [0]
    }
  },
  methods: {
    setActiveNames (activeNames, index) {
      activeNames = [].concat(activeNames)
      // let value = this.accordion ? activeNames[0] : activeNames
      this.activeNames = activeNames
      this.$emit('expandClick', index)
    },
    handleClick (item) {
      if (this.accordion) {
        this.setActiveNames(
          (this.activeNames[0] || this.activeNames[0] === 0) &&
          this.activeNames[0] === item.index ? '' : item.index, item.index
        )
      } else {
        let activeNames = this.activeNames.slice(0)
        let index = activeNames.indexOf(item.index)
        if (index > -1) {
          activeNames.splice(index, 1)
        } else {
          activeNames.push(item.index)
        }
        this.setActiveNames(activeNames, item.index)
      }
    }
  },
  created () {
    this.$on('item-click', this.handleClick)
  }
}
</script>

<style lang="css">
</style>
