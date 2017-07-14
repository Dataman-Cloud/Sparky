<template>
  <div class="terminal-parent">
    <div id="terminal"></div>
  </div>
</template>

<script>
import * as Terminal from 'xterm'
// import * as Fit from 'xterm/dist/addons/fit.js'
import 'xterm/dist/xterm.css'
import store from 'store'

export default {
  props: {
    instanceId: [Number, String],
    nodeIp: [Number, String]
  },
  data () {
    return {
      url: '',
      ws: null

    }
  },
  methods: {
    buildUrl (params) {
      let domain = 'ws://192.168.199.22:5015'
      let uri = 'v1/nodes/$node_ip/instances/$instance_id/terminal'
      let url = domain + '/' + uri
      if (params) {
        for (let key in params) {
          if (params.hasOwnProperty(key)) {
            url = url.replace('$' + key, params[key])
          }
        }
      }
      this.url = url
    },
    openWebSocket () {
      let terminalContainer = document.getElementById('terminal')
      let token = store.getters.token
      this.ws = new WebSocket(`${this.url}?Authorization=${token}`)
      let autoReconnect = -1
      let wsError
      let pingTimer
      let term
      let unloadCallback = (event) => {
        let message = `Close terminal? this will also terminate the command.`
        event = event || window.event
        event.returnValue = message
        return message
      }
      this.ws.onopen = (event) => {
        wsError = false
        pingTimer = setInterval(this.sendPing, 30 * 1000, this.ws)
        if (typeof term !== 'undefined') {
          term.destroy()
        }
        term = new Terminal({cursorBlink: true})
        term.on('resize', (size) => {
          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send('2' + JSON.stringify({columns: size.cols, rows: size.rows}))
          }
          setTimeout(() => {
            term.showOverlay(size.cols + 'x' + size.rows)
          }, 500)
        })
        term.on('data', (data) => {
          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send('0' + data)
          }
        })
        term.on('open', () => {
          window.addEventListener('resize', () => {
            clearTimeout(window.resizedFinished)
            window.resizedFinished = setTimeout(() => {
              term.fit()
            }, 250)
          })
          window.addEventListener('beforeunload', unloadCallback)
          term.fit()
        })

        while (terminalContainer.firstChild) {
          terminalContainer.removeChild(terminalContainer.firstChild)
        }
        term.open(terminalContainer, true)
      }

      this.ws.onmessage = (event) => {
        var data = event.data.slice(1)
        switch (event.data[0]) {
          case '0':
            term.write(window.atob(data))
            break
          case '1':
            // pong
            break
          case '2':
            document.title = data
            break
          case '3':
            let preferences = JSON.parse(data)
            Object.keys(preferences).forEach((key) => {
              console.log('Setting ' + key + ': ' + preferences[key])
              term.setOption(key, preferences[key])
            })
            break
          case '4':
            autoReconnect = JSON.parse(data)
            console.log('Enabling reconnect: ' + autoReconnect + ' seconds')
            break
        }
      }
      this.ws.onclose = (event) => {
        console.log('Websocket connection closed with code: ' + event.code)
        if (term) {
          term.off('data')
          term.off('resize')
          if (!wsError) {
            term.showOverlay('Connection Closed', null)
          }
        }
        window.removeEventListener('beforeunload', unloadCallback)
        clearInterval(pingTimer)
        // 1000: CLOSE_NORMAL
        if (event.code !== 1000 && autoReconnect > 0) {
          setTimeout(this.openWebSocket, autoReconnect * 1000)
        }
      }
    },
    sendPing () {
      if (this.ws) {
        this.ws.send('1')
      }
    },
    clear () {
      if (this.ws) {
        this.ws.close()
      }
    }
  },
  mounted () {
    // term()
    this.buildUrl({
      node_ip: this.nodeIp,
      instance_id: this.instanceId
    })
    this.openWebSocket()
  },
  beforeDestroy () {
    this.clear()
  }
}
</script>

<style scoped>
.terminal-parent {
  height: 300px;
}
</style>
