<template>
  <view 
    class="app-sse-bridge" 
    :prop="bridgeData" 
    :change:prop="sseRender.handleProp"
    style="display: none;"
  ></view>
</template>

<script>
export default {
  name: "AppSseBridge",
  props: {
    bridgeData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['message', 'error', 'open', 'close'],
  methods: {
    onMessage(payload) {
      this.$emit('message', payload)
    },
    onError(payload) {
      this.$emit('error', payload)
    },
    onOpen(payload) {
      this.$emit('open', payload)
    },
    onClose(payload) {
      this.$emit('close', payload)
    }
  }
}
</script>

<script module="sseRender" lang="renderjs">
export default {
  data() {
    return {
      _currentXHR: null,
      _cursor: 0
    }
  },
  methods: {
    handleProp(newVal, oldVal, ownerInstance) {
      const payload = newVal || {}
      
      if (payload.action === 'disconnect') {
        this.closeConnection(ownerInstance)
        return
      }
      
      if (payload.action === 'connect') {
        this.setupSSEConnection(payload, ownerInstance)
      }
    },
    setupSSEConnection(payload, ownerInstance) {
      this.closeConnection(ownerInstance)
      this._cursor = 0
      
      const xhr = new XMLHttpRequest()
      this._currentXHR = xhr
      
      xhr.open('GET', payload.url, true)
      xhr.setRequestHeader('Accept', 'text/event-stream')
      
      if (payload.header) {
        for (const key in payload.header) {
          xhr.setRequestHeader(key, payload.header[key])
        }
      }
      
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 2) {
          ownerInstance.callMethod('onOpen', { status: xhr.status })
        } else if (xhr.readyState === 3) {
          const text = xhr.responseText
          const newText = text.substring(this._cursor)
          this._cursor = text.length
          this.parseSSEChunk(newText, ownerInstance)
        } else if (xhr.readyState === 4) {
          ownerInstance.callMethod('onClose', { status: xhr.status })
        }
      }
      
      xhr.onerror = (err) => {
        ownerInstance.callMethod('onError', { error: 'Network Error' })
      }
      
      xhr.send()
    },
    parseSSEChunk(chunk, ownerInstance) {
      const lines = chunk.split('\n')
      lines.forEach(line => {
        if (line.startsWith('data:')) {
          const msg = line.replace('data:', '').trim()
          if (msg) {
            ownerInstance.callMethod('onMessage', msg)
          }
        }
      })
    },
    closeConnection(ownerInstance) {
      if (this._currentXHR) {
        this._currentXHR.abort()
        this._currentXHR = null
        if (ownerInstance) {
          ownerInstance.callMethod('onClose', { aborted: true })
        }
      }
    }
  }
}
</script>