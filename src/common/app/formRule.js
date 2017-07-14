const baseFormRule = {
  name: [
    {required: true, message: '请输入应用id', trigger: 'blur'},
    {pattern: /^[a-z0-9-]+$/, message: '应用id只能包含小写字母、数字及中划线', trigger: 'blur'}
  ],
  image: [
    {required: true, message: '请输入镜像地址', trigger: 'blur'}
  ],
  vcluster: [
    {required: true, message: '请选择集群', trigger: 'change'}
  ],
  group: [
    {required: true, message: '请选择应用组', trigger: 'change'}
  ],
  network: [
    {required: true, message: '请选择网络模式 ', trigger: 'change'}
  ],
  dockerNum: [
    {required: true, message: '容器个数不能为空'},
    {type: 'number', message: '容器个数必须为数字值'}
  ]
}

export default {
  baseFormRule
}
