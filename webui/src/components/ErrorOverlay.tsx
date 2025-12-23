import { useUIStore } from '../store/uiStore'
import './ErrorOverlay.css'

interface ErrorOverlayProps {
  message: string
}

export default function ErrorOverlay({ message }: ErrorOverlayProps) {
  const setError = useUIStore((state) => state.setError)

  return (
    <div className="error-overlay" onClick={() => setError(null)}>
      <div className="error-content">
        <h2>Error</h2>
        <p>{message}</p>
        <button onClick={() => setError(null)}>Close</button>
      </div>
    </div>
  )
}

