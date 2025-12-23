import { useEffect } from 'react'
import { wsAPI } from './api/websocket'
import { initReceiverAPI } from './api/receiverAPI'
import { initAudioEngine } from './audio/AudioEngine'
import { useReceiverStore } from './store/receiverStore'
import { useUIStore } from './store/uiStore'
import Layout from './components/Layout'
import ErrorOverlay from './components/ErrorOverlay'
import './App.css'

function App() {
  console.log('App component rendering')
  const connected = useReceiverStore((state) => state.connected)
  const setConnected = useReceiverStore((state) => state.setConnected)
  const error = useUIStore((state) => state.error)
  const volume = useReceiverStore((state) => state.volume)
  const muted = useReceiverStore((state) => state.muted)

  useEffect(() => {
    // Initialize audio engine
    const audioEngine = initAudioEngine()
    
    // Initialize API handlers
    initReceiverAPI()

    // Add connection timeout
    const connectionTimeout = setTimeout(() => {
      if (wsAPI.readyState !== WebSocket.OPEN) {
        console.error('WebSocket connection timeout')
        useUIStore.getState().setError(
          'Connection timeout. Make sure the OpenWebRX backend is running on port 8073 and accessible.'
        )
      }
    }, 10000) // 10 second timeout

    // Connect WebSocket
    wsAPI.connect()
      .then(() => {
        clearTimeout(connectionTimeout)
        console.log('WebSocket connected, initializing...')
        setConnected(true)
        // Resume audio context (required for autoplay policy)
        audioEngine.resume()
        // Send start command
        wsAPI.sendCommand('start')
      })
      .catch((err) => {
        clearTimeout(connectionTimeout)
        console.error('Failed to connect to WebSocket:', err)
        const errorMsg = err.message || 'Failed to connect to server. Make sure the OpenWebRX backend is running on port 8073.'
        useUIStore.getState().setError(errorMsg)
      })

    // Handle connection state changes
    const checkConnection = setInterval(() => {
      const isConnected = wsAPI.readyState === WebSocket.OPEN
      setConnected(isConnected)
      if (isConnected) {
        clearTimeout(connectionTimeout)
      }
    }, 1000)

    return () => {
      clearTimeout(connectionTimeout)
      clearInterval(checkConnection)
      wsAPI.disconnect()
    }
  }, [setConnected])

  // Update audio engine when volume/mute changes
  useEffect(() => {
    const audioEngine = initAudioEngine()
    audioEngine.setVolume(volume)
    audioEngine.setMuted(muted)
  }, [volume, muted])

  return (
    <div className="app" style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {error && <ErrorOverlay message={error} />}
      {connected ? <Layout /> : <div className="connecting">Connecting...</div>}
    </div>
  )
}

export default App

