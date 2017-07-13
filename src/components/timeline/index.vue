  <template>
    <el-row :span="24" align="" type="flex">
      <el-col :span="6" type="flex" align="middle" justify="end" class="left-container">
          <el-row class="" type="flex" justify="end">
            <slot name="title"></slot>
          </el-row>
          <el-row class="" type="flex" justify="end">
            <slot name="action"></slot>
          </el-row>
      </el-col>
      <el-col :span="2" class="version-line">
          <a @click="handleClick" class="cursor-pointer">{{isActive ? "收起" : "展开"}}</a>
      </el-col>
      <el-collapse-transition>
      <el-col :span="16" v-show="isActive">
        <slot name="content" ></slot>
      </el-col>
      </el-collapse-transition>
    </el-row>
   </template>

<script>
export default {
  props: {
    index: Number
  },
  data () {
    return {
      isActive: this.index === 0
    }
  },

  methods: {
    handleClick () {
      this.$emit('expandClick', this.index, !this.isActive)
      this.isActive = !this.isActive
    }
  }
}
</script>

<style lang="css">
.left-container {
  padding-top: 10px;
}

.version-line {
  background: url(../../assets/bg-line-gray.png) center top repeat-y;
}

.version-line a {
  background-color: #d8dfe5;
  display: block;
  height: 24px;
  width: 36px;
  line-height: 20px;
  border: 2px solid #FFF;
  border-radius: 12px;
  text-decoration: none;
  margin: 20px auto;
  font-size: 12px;
  text-align: center;
}
</style>
