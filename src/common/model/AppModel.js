class AppModel {

  constructor (cpus, mem, disk, constraints, container, instances, healthChecks, cmd, labels, env) {
    this.cpus = cpus
    this.mem = mem
    this.disk = disk
    this.constraints = constraints
    this.container = container
    this.uris = []
    this.instances = instances
    this.healthChecks = healthChecks
    this.cmd = cmd
    this.labels = labels
    this.env = env
  }
}

export default AppModel
