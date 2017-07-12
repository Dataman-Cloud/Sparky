/**
 * Created by biancl on 2017-05-24.
 * 容器对象 其中的docker为docker对象
 */
class Container {
  constructor (docker, type, volumes) {
    this.docker = docker
    this.type = type
    this.volumes = volumes
  }
}
export default Container
