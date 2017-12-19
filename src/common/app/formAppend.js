function formAppend () {
  return {
    ports: {
      containerPort: '1',
      protocol: 'tcp'
    },
    hostPorts: {
      containerPort: '1',
      protocol: 'tcp'
    },
    mounts: {
      containerPath: '',
      hostPath: '',
      mode: 'RO' // RW
    },
    environmentVariables: {
      key: '',
      value: ''
    },
    dockerPar: {
      key: '',
      value: ''
    },
    health: {
      protocol: 'HTTP',
      gracePeriodSeconds: null,
      intervalSeconds: null,
      timeoutSeconds: null,
      maxConsecutiveFailures: '',
      portType: '1',
      port: undefined,
      protNumCode: false, // “端口号”的input元素是否显示
      portNumOrPortIndexText: '端口组索引', // 存放“端口号”或“端口组索引”文字
      portIndexCode: true, // “端口组索引”的input元素是否显示
      portIndex: undefined,  // 用于存放选择“端口组索引”后的端口组索引
      path: '', // 用于存放选择http协议后的“http路径input元素的值”
      ignoreHttp1xx: false, // “忽略http返回码”的checkbox是否被选中
      healthHttpCheckBoxCode: true, // 选择http协议后表格第一行“路径”标题是否显示
      healthHttpPathCode: true, // 选择http协议后表格第二行“路径”的input元素是否显示
      healthHttpPathText: true // 选择http协议后表格第三行“忽略http返回码”的checkbox元素是否显示
      // healthHttpCheckBoxCode,healthHttpPathCode,healthHttpPathText
    }
  }
}

export default {
  formAppend
}
