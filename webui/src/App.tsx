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

    // Connect WebSocket
    wsAPI.connect()
      .then(() => {
        setConnected(true)
        // Resume audio context (required for autoplay policy)
        audioEngine.resume()
        // Send start command
        wsAPI.sendCommand('start')
      })
      .catch((err) => {
        console.error('Failed to connect:', err)
        useUIStore.getState().setError('Failed to connect to server')
      })

    // Handle connection state changes
    const checkConnection = setInterval(() => {
      const isConnected = wsAPI.readyState === WebSocket.OPEN
      setConnected(isConnected)
    }, 1000)

    return () => {
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
    <div className="app">
      {error && <ErrorOverlay message={error} />}
      {connected ? <Layout /> : <div className="connecting">Connecting...</div>}
    </div>
  )
}

export default App

