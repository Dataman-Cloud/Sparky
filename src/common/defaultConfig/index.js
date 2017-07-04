import Image from '@/common/model/Image'
import Container from '@/common/model/Container'
import Docker from '@/common/model/Docker'

export const editorOptions = {
  // codemirror options
  tabSize: 4,
  autofocus: true,
  size: 200,
  height: '50px',
  mode: {name: 'javascript', json: true},
  theme: 'base16-dark',
  lineNumbers: true,
  line: true,
  // sublime、emacs、vim三种键位模式，支持你的不同操作习惯
  keyMap: 'sublime',
  // 按键映射，比如Ctrl键映射autocomplete，autocomplete是hint代码提示事件
  extraKeys: {'Ctrl': 'autocomplete'},
  // 代码折叠
  foldGutter: true,
  gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  // 选中文本自动高亮，及高亮方式
  styleSelectedText: true,
  highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
  // more codemirror config...
  // 如果有hint方面的配置，也应该出现在这里
}

export const ruleForm = {
  name: undefined,
  image: undefined,
  force: false,
  base: undefined,
  baseOption: [],
  vcluster: undefined,
  master: undefined,
  group: undefined,
  network: 'BRIDGE',
  cpus: 0,
  memory: 0,
  hardDrive: 0,
  dockerNum: undefined,
  dockerProportion: false,
  f5Pool: undefined,
//          procedureMount: '',
  ports: [],
  mounts: [],
  environmentVariables: [],
  health: [],
  cmd: undefined,
  dockerPar: []
}

export const formRule = {
  name: [
    {required: true, message: '请输入应用id', trigger: 'blur'},
    {pattern: /^[a-z0-9-]+$/, message: '应用id只能包含小写字母、数字及中划线', trigger: 'blur'}
  ],
  desc: [],
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
  norms: [],
  dockerNum: [
    {required: true, message: '容器个数不能为空'},
    {type: 'number', message: '容器个数必须为数字值'}
  ],
  procedureMount: [
    {required: true, message: '请输入程序包挂载点', trigger: 'blur'}
  ]
}

export const resultForm = new Image(
  undefined,
  undefined,
  0.01,
  5,
  0,
  undefined,
  undefined,
  [],
  new Container(new Docker(undefined, 'BRIDGE', false, undefined, [], []), undefined, undefined),
  {},
  undefined,
  undefined,
  [],
  undefined,
  undefined
)
