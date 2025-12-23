import { useUIStore } from '../store/uiStore'
import WaterfallView from './WaterfallView'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import './Layout.css'

export default function Layout() {
  const leftPanelOpen = useUIStore((state) => state.leftPanelOpen)
  const rightPanelOpen = useUIStore((state) => state.rightPanelOpen)

  return (
    <div className="layout">
      <div className="layout-main">
        <WaterfallView />
      </div>
      {leftPanelOpen && (
        <div className="layout-left-panel">
          <LeftPanel />
        </div>
      )}
      {rightPanelOpen && (
        <div className="layout-right-panel">
          <RightPanel />
        </div>
      )}
    </div>
  )
}

