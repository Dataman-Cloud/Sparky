import Image from '@/common/model/Image'
import Container from '@/common/model/Container'
import Docker from '@/common/model/Docker'

function ruleForm () {
  return {
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
}

function resultForm () {
  return new Image(
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
}

function modelForm () {
  return {
    id: '',
    name: '',
    desc: '',
    image: '',
    force: false,
    base: '',
    vcluster: undefined,
    master: undefined,
    network: 'BRIDGE',
    cpus: 0,
    memory: 0,
    hardDrive: 0,
    dockerNum: '',
    dockerProportion: false,
    dockerProportionDefault: false, // dockerProportion的值是否为原有的值(查询出的值)
    f5Pool: '',
    procedureMount: '',
    ports: [],
    mounts: [],
    environmentVariables: [],
    health: [],
    cmd: undefined,
    dockerPar: [],
    createdTime: ''
  }
}

export default {
  ruleForm,
  resultForm,
  modelForm
}
