import HealthCheck from '@/common/model/HealthCheck'
// import appConf from '@/common/app'

function transformFormToJson (normalForm, jsonForm) {
  let container = jsonForm.container
  let docker = container.docker
  let constraints = jsonForm.constraints = []
  let healths = jsonForm.healthChecks = []
  jsonForm.id = normalForm.group != null ? (normalForm.group + '/' + normalForm.name) : normalForm.name
  jsonForm.cmd = normalForm.cmd
  jsonForm.cpus = normalForm.cpus
  jsonForm.mem = normalForm.memory
  jsonForm.disk = normalForm.hardDrive
  jsonForm.instances = normalForm.dockerNum
  // add by 2017-10-19
  jsonForm.labels = {}
/*  if (normalForm.HAPROXY_PROTOCOL_TYPE) {
    jsonForm.labels.HAPROXY_PROTOCOL_TYPE = normalForm.HAPROXY_PROTOCOL_TYPE // !== undefined ? normalForm.HAPROXY_PROTOCOL_TYPE : {}
  } */
  // jsonForm.labels.NEED_HAPROXY = normalForm.NEED_HAPROXY
  if (normalForm.NEED_HAPROXY) {
    jsonForm.labels.NEED_HAPROXY = 'true'
  } else {
    jsonForm.labels.NEED_HAPROXY = 'false'
  }
  if (normalForm.CURRENT_VERSION) {
    jsonForm.labels.CURRENT_VERSION = normalForm.CURRENT_VERSION
  }
  if (normalForm.PACKAGE_TYPE) {
    jsonForm.labels.PACKAGE_TYPE = normalForm.PACKAGE_TYPE
  }
  if (normalForm.vcluster) {
    constraints.push(['vcluster', 'LIKE', normalForm.vcluster])
  }
  if (normalForm.dockerProportion) {
    constraints.push(['hostname', 'UNIQUE'])
  }
  if (normalForm.master && normalForm.master.length > 0) {
    let host = normalForm.master.toString()
    constraints.push(['hostname', 'LIKE', host.replace(/,/g, '|')])
  }
  if (normalForm.image != null) {
    docker.image = normalForm.image
  }
  if (normalForm.dockerPar != null && normalForm.dockerPar.length > 0) {
    docker.parameters = normalForm.dockerPar
  }
  if (normalForm.ckeckNET) {
    let hasNetSet = false
    for (let p of docker.parameters) {
      if (p['key'] === 'net') {
        p['value'] = normalForm.ckeckNET
        hasNetSet = true
      }
    }
    if (!hasNetSet) {
      docker.parameters.push({key: 'net', value: normalForm.ckeckNET})
    }
    // console.log(docker.parameters)
  } else {
    var tmparr = []
    for (let p of docker.parameters) {
      if (p['key'] === 'net') { continue }
      tmparr.push(p)
    }
    docker.parameters = tmparr
  }
  docker.network = normalForm.network
  if (docker.network === 'BRIDGE') {
    docker.portMappings = normalForm.ports
  } else {
    docker.portMappings = []
  }
  docker.forcePullImage = normalForm.force
  jsonForm.env = {}
  if (normalForm.f5Pool != null) {
    jsonForm.env.F5_POOL_NAME = normalForm.f5Pool
  }
  if (normalForm.loadtype.length > 0) {
    jsonForm.labels.LOADTYPE = normalForm.loadtype[0]
    jsonForm.labels.LOADAPP_MACVLAN = normalForm.ckeckLoadNET
  } else {
    jsonForm.labels.LOADTYPE = ''
    jsonForm.labels.LOADAPP_MACVLAN = ''
  }
  if (normalForm.environmentVariables && normalForm.environmentVariables.length > 0) {
    for (let obj of normalForm.environmentVariables) {
      jsonForm.env[obj.key] = obj.value
    }
  }
  if (normalForm.mounts != null && normalForm.mounts.length > 0) {
    container.volumes = normalForm.mounts
  }
  if (normalForm.health != null && normalForm.health.length > 0) {
//            jsonForm.healthChecks = normalForm.health
    for (let item of normalForm.health) {
      healths.push(new HealthCheck(item.protocol, item.path, item.gracePeriodSeconds, item.intervalSeconds, item.timeoutSeconds, item.maxConsecutiveFailures, item.port, item.portIndex, item.ignoreHttp1xx))
    }
//            jsonForm.healthChecks = healths
  }
  if (normalForm.cmd != null) {
    jsonForm.cmd = normalForm.cmd
  }
  if (normalForm.hostPorts != null && normalForm.hostPorts.length > 0) {
    jsonForm.ipAddress.discovery.ports = []
    for (let port of normalForm.hostPorts) {
      jsonForm.ipAddress.discovery.ports.push({'number': port.containerPort, 'protocol': port.protocol, 'name': port.containerPort + port.protocol})
    }
  } else {
    jsonForm.ipAddress.discovery.ports = []
    // delete jsonForm.ipAddress
  }
  if (normalForm.labels) {
    if (normalForm.labels.DEFAULT_PACKAGE_VERSION) {
      jsonForm.labels.DEFAULT_PACKAGE_VERSION = normalForm.labels.DEFAULT_PACKAGE_VERSION
    }
    if (normalForm.labels.GROUP_ID) {
      jsonForm.labels.GROUP_ID = normalForm.labels.GROUP_ID
    }
    if (normalForm.labels.LOAD_APPID) {
      jsonForm.labels.LOAD_APPID = normalForm.labels.LOAD_APPID
    }
    if (normalForm.labels.NIXY_REALM) {
      jsonForm.labels.NIXY_REALM = normalForm.labels.NIXY_REALM
    }
    if (normalForm.labels.PACKAGE_VERSION) {
      jsonForm.labels.PACKAGE_VERSION = normalForm.labels.PACKAGE_VERSION
    }
    if (normalForm.labels.USER_ID) {
      jsonForm.labels.USER_ID = normalForm.labels.USER_ID
    }
    if (normalForm.labels.VCLUSTER) {
      jsonForm.labels.VCLUSTER = normalForm.labels.VCLUSTER
    }
    console.log(normalForm.labels)
  }
  return jsonForm
}

function transformJsonToForm (appModel, normalForm) {
  // console.log(appModel)
  normalForm.name = appModel.id.split('/')[2] // 名称
  normalForm.group = appModel.id.split('/')[1]
  normalForm.image = appModel.container.docker.image // 镜像
  normalForm.force = appModel.container.docker.forcePullImage // 强制拉取镜像
  // 仓库认证
  normalForm.vcluster = appModel.constraints[0][2] // 选择的集群
  normalForm.network = appModel.container.docker.network  // 网络模式
  normalForm.cpus = appModel.cpus // cpu
  normalForm.memory = appModel.mem // 内存
  normalForm.disk = appModel.disk // 硬盘
  normalForm.dockerNum = appModel.instances // 容器个数
  for (let constraint of appModel.constraints) {
    if (constraint[1].toUpperCase() === 'UNIQUE') {
      normalForm.dockerProportion = true
      normalForm.dockerProportionDefault = true
    } else if (constraint[0].toUpperCase() === 'HOSTNAME') {
      if (constraint[2] !== undefined) {
        let hosts = constraint[2].split('|')
        for (var host of hosts) {
          normalForm.master.push(host)
        }
      }
    }
  }
  normalForm.f5Pool = appModel.env['F5_POOL_NAME'] // F5 Pool 名称
  normalForm.CURRENT_VERSION = appModel.labels['CURRENT_VERSION'] // 程序包版本
  if (appModel.labels['NEED_HAPROXY'] === 'true') {
    normalForm.NEED_HAPROXY = true
  }
  if (appModel.labels['NEED_HAPROXY'] === 'false') {
    normalForm.NEED_HAPROXY = false
  }
  if (appModel.labels['LOADTYPE']) {
    normalForm.loadtype = []
    normalForm.loadtype[0] = appModel.labels['LOADTYPE']
  } else {
    normalForm.loadtype = []
  }
  if (appModel.labels['LOADAPP_MACVLAN']) {
    normalForm.ckeckLoadNET = appModel.labels['LOADAPP_MACVLAN']
  } else {
    normalForm.ckeckLoadNET = ''
  }
  // normalForm.NEED_HAPROXY = appModel.labels['NEED_HAPROXY'] === 'true'// HAPROXY
  normalForm.PACKAGE_TYPE = appModel.labels['PACKAGE_TYPE'] // 程序包发布包类型
  normalForm.procedureMount = appModel.labels['PACKAGE_VOLUME']// 程序包挂载点
  normalForm.cmd = appModel.cmd // CMD命令
  //  自定义端口号
  if (appModel.container.docker.portMappings && appModel.container.docker.portMappings.length > 0) {
    for (let v of appModel.container.docker.portMappings) {
      normalForm.ports.push({containerPort: v.containerPort, protocol: v.protocol})
    }
  }
  if (appModel.ipAddress && appModel.ipAddress.discovery.ports && appModel.ipAddress.discovery.ports.length > 0) {
    normalForm.hostPorts = []
    for (let v of appModel.ipAddress.discovery.ports) {
      normalForm.hostPorts.push({containerPort: v.number, protocol: v.protocol})
    }
  }
  // 挂载目录
  if (appModel.container.volumes.length > 0) {
    for (let v of appModel.container.volumes) {
      normalForm.mounts.push({containerPath: v.containerPath, hostPath: v.hostPath, mode: v.mode})
    }
  }
  // 健康检查
  if (appModel.healthChecks && Array.isArray(appModel.healthChecks) && appModel.healthChecks.length > 0) {
    for (let v of appModel.healthChecks) {
      let health = {
        gracePeriodSeconds: v.gracePeriodSeconds, // 宽限时间
        protocol: v.protocol, // 协议
        intervalSeconds: v.intervalSeconds, // 检查间隔
        timeoutSeconds: v.timeoutSeconds, // 检查超时
        maxConsecutiveFailures: v.maxConsecutiveFailures // 最大失败次数
      }
      if (v.protocol === 'HTTP') {
        health.path = v.path // 选择http协议后的路径
        health.ignoreHttp1xx = v.ignoreHttp1xx // 是否选中了忽略http返回码
        health.healthHttpPathText = true// 选择http协议后表格第一行“路径”标题
        health.healthHttpPathCode = true // 选择http协议后显示表格第二行“路径”
        health.healthHttpCheckBoxCode = true// 选择http协议后显示表格第三行“忽略http返回码”的checkbox元素
      }
      if (v.hasOwnProperty('ifPortIndex')) { // 选中了端口组索引后
        health.portType = '端口组索引' // 选中端口组索引
        health.portIndex = v.portIndex// 端口组索引的值
        health.port = '' // 清空之端口号
        health.protNumCode = false // “端口号”的input元素隐藏
        health.portNumOrPortIndexText = '端口组索引'// 文字显示为端口组索引
        health.portIndexCode = true // “端口组索引”的input元素显示
      } else {
        health.portType = '端口号' // 选中端口号
        health.port = v.port // 端口号的值
        health.protNumCode = true // “端口号”的input元素显示
        health.portNumOrPortIndexText = '端口号'// 文字显示为端口组索引
        health.portIndexCode = false // “端口组索引”的input元素隐藏
        health.portIndex = ''//  清空“端口组索引”
      }
      normalForm.health.push(health)
    }
  }

  // 自定义环境变量
  for (let v in appModel.env) {
    if (v === 'F5_POOL_NAME') {
      normalForm.f5Pool = appModel.env[v]
      continue
    }
    // if (v === 'LOAD_TYPE') {
    //   normalForm.loadtype = []
    //   normalForm.loadtype[0] = appModel.env[v]
    //   continue
    // }
    normalForm.environmentVariables.push({key: v, value: appModel.env[v]})
  }
  // 自定义Docker变量
  for (let v of appModel.container.docker.parameters) {
    if (v['key'] === 'net') {
      normalForm.networkMacCheck = '1'
      normalForm.ckeckNET = v['value']
      continue
    }
    normalForm.dockerPar.push({key: v['key'], value: v['value']})
  }
  normalForm.labels = appModel.labels
  console.log(normalForm)
  return normalForm
}

export default {
  transformFormToJson,
  transformJsonToForm
}
