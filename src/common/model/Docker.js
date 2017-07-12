/**
 * Created by biancl on 2017-05-24.
 */
class Docker {
  constructor (image, network, forcePullImage, privileged, parameters, portMappings) {
    this.image = image
    this.network = network
    this.forcePullImage = forcePullImage
    this.privileged = privileged
    this.parameters = parameters
    this.portMappings = portMappings
  }
}
export default Docker
