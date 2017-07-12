/**
 * Created by biancl on 2017-05-24.
 */
class HealthCheck {
  constructor (protocol, path, gracePeriodSeconds, intervalSeconds, timeoutSeconds, maxConsecutiveFailures, port, portIndex, ignoreHttp1xx) {
    this.protocol = protocol
    this.path = path
    this.gracePeriodSeconds = gracePeriodSeconds
    this.intervalSeconds = intervalSeconds
    this.timeoutSeconds = timeoutSeconds
    this.maxConsecutiveFailures = maxConsecutiveFailures
    this.port = port
    this.portIndex = portIndex
    this.ignoreHttp1xx = ignoreHttp1xx
  }
}
export default HealthCheck
