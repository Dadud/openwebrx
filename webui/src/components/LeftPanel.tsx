import { useUIStore } from '../store/uiStore'
import MessagePanels from './MessagePanels'
import './Panel.css'

export default function LeftPanel() {
  const activePanel = useUIStore((state) => state.activeLeftPanel)

  return (
    <div className="panel left-panel">
      <MessagePanels />
    </div>
  )
}

