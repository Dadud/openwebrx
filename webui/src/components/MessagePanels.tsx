import { useReceiverStore } from '../store/receiverStore'
import './MessagePanels.css'

export default function MessagePanels() {
  const metadata = useReceiverStore((state) => state.metadata)

  // Render different message panels based on metadata mode
  if (!metadata || !metadata.mode) {
    return null
  }

  return (
    <div className="message-panels">
      {metadata.mode === 'wsjt' && (
        <div className="message-panel">
          <h3>WSJT-X</h3>
          <pre>{JSON.stringify(metadata, null, 2)}</pre>
        </div>
      )}
      {metadata.mode === 'js8' && (
        <div className="message-panel">
          <h3>JS8Call</h3>
          <pre>{JSON.stringify(metadata, null, 2)}</pre>
        </div>
      )}
      {/* Add more message panel types as needed */}
    </div>
  )
}

