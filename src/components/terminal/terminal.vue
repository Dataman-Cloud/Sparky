<template>
  <div class="terminal-parent">
    <div id="terminal"></div>
  </div>
</template>

<script>
import * as Terminal from 'xterm'
// import * as Fit from 'xterm/dist/addons/fit.js'
// import {DEFAULT_BASE_URL} from '@/config'
import 'xterm/dist/xterm.css'
// import store from 'store'

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
      // let domain = DEFAULT_BASE_URL.replace(/http/, 'ws')
      let uri = 'jborg/terminal?ws_nodeip=' + this.nodeIp + '&ws_cid=' + this.instanceId
      let url = 'ws://' + window.location.host + '/' + uri
      this.url = url
    },
    openWebSocket () {
      let terminalContainer = document.getElementById('terminal')
      // let token = store.getters.token
      this.ws = new WebSocket(`${this.url}`) //  ?Authorization=${token}
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
        Terminal.loadAddon('fit')
        term = new Terminal({cursorBlink: true})
        term.on('resize', (size) => {
          console.log(size)
          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({type: 'TERMINAL_RESIZE', columns: size.cols, rows: size.rows})) // 2
          }
          setTimeout(() => {
            term.showOverlay(size.cols + 'x' + size.rows)
          }, 500)
        })
        term.on('data', (data) => {
          if (this.ws.readyState === WebSocket.OPEN) {
            let parma = {type: 'TERMINAL_COMMAND', command: data}
            this.ws.send(JSON.stringify(parma))
          }
        })
        term.on('open', () => {
          console.log('term open')
          let param = {type: 'TERMINAL_INIT'}
          this.ws.send(JSON.stringify(param))
          param = {type: 'TERMINAL_READY'}
          this.ws.send(JSON.stringify(param))

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
        let data = JSON.parse(event.data)
        switch (data.type) {
          case 'TERMINAL_PRINT':
            term.write(data.text)
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
  height: 600px;
}
#terminal{
  height: 600px;
}
</style>
