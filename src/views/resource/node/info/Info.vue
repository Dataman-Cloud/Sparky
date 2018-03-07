<template>
  <section>
    <el-form label-position="left" inline class="demo-table-expand">
      <el-form-item label="主机名称">
        <span>{{nodeInfo.Name }}</span>
      </el-form-item>
      <el-form-item label="主机IP">
        <span>{{this.$route.query.nodeIp }}</span>
      </el-form-item>
      <el-form-item label="系统版本">
        <span>{{nodeInfo.OperatingSystem }}</span>
      </el-form-item>
      <el-form-item label="内核版本">
        <span>{{nodeInfo.KernelVersion }}</span>
      </el-form-item>
      <el-form-item label="镜像个数">
        <span>{{nodeInfo.Images }}</span>
      </el-form-item>
      <el-form-item label="CPU">
        <span>{{nodeInfo.NCPU }}</span>
      </el-form-item>
      <el-form-item label="内存">
        <span>{{formatFileSize(nodeInfo.MemTotal) }}</span>
      </el-form-item>
      <el-form-item label="系统时间">
        <span>{{nodeInfo.RegistryConfig.SystemTime | moment("YYYY/MM/DD HH:mm:ss") }}</span>
      </el-form-item>
      <br clear="all"/>
    </el-form>
    <strong class="title">docker信息</strong>
    <el-form label-position="left" inline class="demo-table-expand">

      <br clear="all"/>
      <el-form-item label="版本">
        <span>{{nodeInfo.ServerVersion }}</span>
      </el-form-item>
      <el-form-item label="存储驱动">
        <span>{{nodeInfo.Driver }}</span>
      </el-form-item>
      <el-form-item label="Docker 存储目录">
        <span>{{nodeInfo.DockerRootDir }}</span>
      </el-form-item>
      <el-form-item label="Debug 模式">
        <span>{{nodeInfo.Debug ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="IPv4Forwarding">
        <span>{{nodeInfo.IPv4Forwarding ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="Cgroup 驱动">
        <span>{{nodeInfo.CgroupDriver === undefined ? 'cgroupfs' : nodeInfo.CgroupDriver }}</span>
      </el-form-item>
      <el-form-item label="LoggingDriver">
        <span>{{nodeInfo.LoggingDriver ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item label="允许内存溢出">
        <span>{{nodeInfo.OomKillDisable ? '是' : '否' }}</span>
      </el-form-item>


      <el-form-item label="容器总数" v-bind:style="smallLable">
        <el-tag type="gray">{{nodeInfo.Containers }}</el-tag>
      </el-form-item>
      <el-form-item label="运行容器" v-bind:style="smallLable">
        <el-tag type="gray">{{nodeInfo.ContainersRunning }}</el-tag>
      </el-form-item>
      <el-form-item label="暂停容器" v-bind:style="smallLable">
        <el-tag type="gray">0</el-tag>
      </el-form-item>
      <el-form-item label="停止容器" v-bind:style="smallLable">
        <el-tag type="gray">{{nodeInfo.ContainersStopped }}</el-tag>
      </el-form-item>

    </el-form>


    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane label="容器列表" name="first">

          <el-table :data="instances" highlight-current-row style="width: 100%;">
            <el-table-column label="容器id" min-width="120" sortable>
              <template scope="instance">
                <router-link :to="{name: '容器信息', query:{instanceId: instance.row.containerId, nodeIp : getNodeIp() }}">
                  {{instance.row.containerId.substring(-1, 16) }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column prop="appId" label="应用名称" min-width="100" sortable>
            </el-table-column>
            <el-table-column prop="containerName" label="容器名称" min-width="220" sortable>
            </el-table-column>
            <el-table-column prop="posts" label="对内地址" min-width="200" sortable>
              <template scope="scope">
                {{formatPost(scope.row.posts)}}
              </template>
            </el-table-column>
            <el-table-column prop="containerStatus" label="运行时间" min-width="150" sortable>
            </el-table-column>
            <el-table-column prop="containerCreateTime" label="创建时间" min-width="100" sortable>
              <template scope="instance">
                {{instance.row.containerCreateTime * 1000 | moment("YYYY/MM/DD HH:mm:ss")}}
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="镜像列表" name="third">
          <el-table :data="images" highlight-current-row style="width: 100%;">
            <el-table-column label="ID" prop="" min-width="100" sortable>
              <template scope="image">
                {{image.row.imageId.substring(-1, 16) }}
              </template>
            </el-table-column>
            <el-table-column prop="repoTags" label="名称" min-width="400" sortable>
            </el-table-column>
            <el-table-column prop="" label="大小" min-width="80" sortable>
              <template scope="image">
                {{formatFileSize(image.row.size) }}
              </template>
            </el-table-column>
            <!--<el-table-column prop="updatedAt" label="创建时间" min-width="100" sortable>-->
            <!--<template scope="images">-->
            <!--{{images.row.Created | moment("YYYY/MM/DD HH:mm:ss")}}-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="" label="操作" min-width="80" sortable>
              <template scope="images">
                <el-button type="danger" size="small" @click="delImage(images.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </template>

  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import * as type from '../../../../store/node/mutations_types'
  import * as util from '../../../../common/js/util'

  export default {
    data () {
      return {
        smallLable: {
          width: '20%'
        },
        activeName: 'first'
      }
    },
    computed: {
      ...mapState({
        nodeInfo (state) {
          return state.node.nodes.currNode
        },
        images (state) {
          return state.node.nodes.currImages
        },
        instances (state) {
          return state.node.nodes.currInstances
        }
      })
    },
    methods: {
      getNodeInfo () {
        return this.$store.dispatch(type.NODE_INFO, this.$route.query.nodeIp)
      },
      getNodeIp () {
        return this.$route.query.nodeIp
      },
      getNodeImages () {
        return this.$store.dispatch(type.FETCH_NODE_IMAGES, this.$route.query.nodeIp)
      },
      getNodeInstances () {
        return this.$store.dispatch(type.FETCH_NODE_INSTANCES, this.$route.query.nodeIp)
      },
      formatFileSize (size) {
        return util.renderSize(size)
      },
      formatPost (poststr) {
        let post = JSON.parse(poststr)
        if (post.length === 0) {
          return ''
        }
        let str = ''
        post.forEach(function (p, i) {
          if (i > 0) {
            str += ','
          }
          str += p.type + ':' + p.privatePort
        })
        return str
      },
      delImage (iamge) {
        let param = {nodeIp: this.$route.query.nodeIp, imageId: iamge.imageId}
        // console.log(param)
        this.$confirm('此操作将永久删除该镜像信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return this.$store.dispatch(type.DEL_NODE_IMAGE, param).then(() => {
            this.$message({
              message: '删除中',
              type: 'success',
              onClose: this.getNodeImages
            })
          })
        })
      }
    },
    mounted () {
      this.getNodeInfo()
      this.getNodeImages()
      this.getNodeInstances()
    }
  }
</script>


<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  #fontweight label {
    font-weight: bold
  }
</style>
