/**
 * Created by biancl on 2017-05-24.
 * 镜像对象
 */
class Image {
  constructor (appId, cmd, cpus, mem, disk, runAs, instances, constraints, container, env, labels, killPolicy, healthChecks, updatePolicy, mode) {
    this.id = appId
    this.cmd = cmd
    this.cpus = cpus
    this.mem = mem
    this.disk = disk
    this.runAs = runAs
    this.instances = instances
    this.constraints = constraints
    this.container = container
    this.env = env
    this.labels = labels
    this.killPolicy = killPolicy
    this.healthChecks = healthChecks
    this.updatePolicy = updatePolicy
    this.mode = mode
    this.ipAddress = {'discovery': {'ports': []}}
  }
}

export default Image
