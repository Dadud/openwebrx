import { useUIStore } from '../store/uiStore'
import './ErrorOverlay.css'

interface ErrorOverlayProps {
  message: string
}

export default function ErrorOverlay({ message }: ErrorOverlayProps) {
  const setError = useUIStore((state) => state.setError)

  const handleRetry = () => {
    setError(null)
    // Reload the page to retry connection
    window.location.reload()
  }

  return (
    <div className="error-overlay" onClick={() => setError(null)}>
      <div className="error-content" onClick={(e) => e.stopPropagation()}>
        <h2>Connection Error</h2>
        <p>{message}</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button onClick={handleRetry} style={{ flex: 1 }}>Retry</button>
          <button onClick={() => setError(null)} style={{ flex: 1 }}>Close</button>
        </div>
      </div>
    </div>
  )
}

