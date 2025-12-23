import { WSMessage, BINARY_SPECTRUM, BINARY_AUDIO, BINARY_SECONDARY_FFT, BINARY_HD_AUDIO } from './types'

export type WSMessageHandler = (message: WSMessage) => void
export type BinaryMessageHandler = (type: number, data: ArrayBuffer) => void

export class WebSocketAPI {
  private ws: WebSocket | null = null
  private reconnectTimeout: number = 1000
  private maxReconnectTimeout: number = 512000
  private messageHandlers: Set<WSMessageHandler> = new Set()
  private binaryHandlers: Set<BinaryMessageHandler> = new Set()
  private isConnecting: boolean = false

  constructor() {
    // Auto-reconnect on close
  }

  connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return Promise.resolve()
    }

    if (this.isConnecting) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            clearInterval(checkInterval)
            resolve()
          } else if (!this.isConnecting) {
            clearInterval(checkInterval)
            reject(new Error('Connection failed'))
          }
        }, 100)
      })
    }

    this.isConnecting = true

    return new Promise((resolve, reject) => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = window.location.host
      const path = window.location.pathname.endsWith('/') 
        ? window.location.pathname + 'ws/'
        : window.location.pathname + '/ws/'
      const wsUrl = `${protocol}//${host}${path}`

      try {
        this.ws = new WebSocket(wsUrl)
        this.ws.binaryType = 'arraybuffer'

        this.ws.onopen = () => {
          this.isConnecting = false
          this.reconnectTimeout = 1000
          console.log('WebSocket connected')
          resolve()
        }

        this.ws.onmessage = (event) => {
          if (event.data instanceof ArrayBuffer) {
            this.handleBinaryMessage(event.data)
          } else if (typeof event.data === 'string') {
            try {
              const message: WSMessage = JSON.parse(event.data)
              this.handleTextMessage(message)
            } catch (e) {
              console.error('Failed to parse WebSocket message:', e)
            }
          }
        }

        this.ws.onclose = () => {
          this.isConnecting = false
          console.log('WebSocket closed, reconnecting...')
          this.scheduleReconnect()
        }

        this.ws.onerror = (error) => {
          this.isConnecting = false
          console.error('WebSocket error:', error)
          reject(error)
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  private handleTextMessage(message: WSMessage) {
    this.messageHandlers.forEach(handler => {
      try {
        handler(message)
      } catch (e) {
        console.error('Error in message handler:', e)
      }
    })
  }

  private handleBinaryMessage(data: ArrayBuffer) {
    if (data.byteLength < 1) return

    const view = new Uint8Array(data)
    const type = view[0]
    const payload = data.slice(1)

    this.binaryHandlers.forEach(handler => {
      try {
        handler(type, payload)
      } catch (e) {
        console.error('Error in binary handler:', e)
      }
    })
  }

  private scheduleReconnect() {
    setTimeout(() => {
      if (this.ws?.readyState === WebSocket.CLOSED) {
        this.connect().catch(() => {
          // Exponential backoff
          this.reconnectTimeout = Math.min(this.reconnectTimeout * 2, this.maxReconnectTimeout)
          this.scheduleReconnect()
        })
      }
    }, this.reconnectTimeout)
  }

  send(message: WSMessage | string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const data = typeof message === 'string' ? message : JSON.stringify(message)
      this.ws.send(data)
    } else {
      console.warn('WebSocket not connected, message not sent:', message)
    }
  }

  sendCommand(command: string, params?: Record<string, any>) {
    const message: WSMessage = { type: command, ...params }
    this.send(message)
  }

  onMessage(handler: WSMessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  onBinary(handler: BinaryMessageHandler): () => void {
    this.binaryHandlers.add(handler)
    return () => this.binaryHandlers.delete(handler)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers.clear()
    this.binaryHandlers.clear()
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }
}

// Singleton instance
export const wsAPI = new WebSocketAPI()

