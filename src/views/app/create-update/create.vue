<template lang="html">
  <div class="">
    <editor v-model="variable" :options="options" :lang="'json'" :theme="'solarized_dark'" :height="'600px'" :width="'700px'"></editor>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-upload
          class="upload-demo"
          :http-request="upload"
          action="/">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传json文件</div>
        </el-upload>
      </el-col>
      <el-col :span="2" :offset="6">
        <el-dropdown @command="getStackExample">
          <span class="el-dropdown-link">
            ...试试看<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="template in templates" :command="`${template}`">{{template}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="6">
        <el-button type="primary" v-on:click="createApp">创建</el-button>
      </el-col>
    </el-row>
  </div>


</template>

<script>
import editor from 'vue2-ace-editor'
import 'brace/mode/json'
import 'brace/theme/solarized_dark'

import * as app from '../../../api/app'

const templates = ['simple-template', 'advanced-template']

export default {
  components: {
    editor
  },
  data () {
    return {
      options: {
        fontSize: '14pt'
      },
      variable: '1234',
      templates
    }
  },
  mounted () {
  },
  methods: {
    createApp () {
      app.createApp(this.variable)
    },
    getStackExample (template) {
      console.log(template)
      var abc = `/static/common/${template}.json`
      console.log(abc)
      fetch(`/static/common/${template}.json`)
          .then(res => res.json())
          .then(data => {
            this.variable = JSON.stringify(data, null, 2)
          })
    },
    upload (files) {
      let file = files.file
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.onload = () => resolve(reader)
        reader.readAsText(file)
      }).then(res => {
        console.log(res)
        this.variable = res.result
      })
    }
  }
}

</script>

<style lang="css">
</style>
