import { useReceiverStore } from '../store/receiverStore'
import { receiverCommands } from '../api/receiverAPI'
import FrequencyDisplay from './FrequencyDisplay'
import ModeSelector from './ModeSelector'
import ProfileSelector from './ProfileSelector'
import AudioControls from './AudioControls'
import WaterfallControls from './WaterfallControls'
import DisplayControls from './DisplayControls'
import StatusPanel from './StatusPanel'
import './Panel.css'

export default function RightPanel() {
  const centerFreq = useReceiverStore((state) => state.centerFreq)
  const offsetFreq = useReceiverStore((state) => state.offsetFreq)

  return (
    <div className="panel right-panel">
      <div className="panel-section">
        <FrequencyDisplay
          centerFreq={centerFreq}
          offsetFreq={offsetFreq}
        />
      </div>

      <div className="panel-section">
        <ProfileSelector />
      </div>

      <div className="panel-section">
        <h3 className="panel-section-title">Modes</h3>
        <ModeSelector />
      </div>

      <div className="panel-section">
        <h3 className="panel-section-title">Controls</h3>
        <AudioControls />
      </div>

      <div className="panel-section">
        <h3 className="panel-section-title">Waterfall</h3>
        <WaterfallControls />
      </div>

      <div className="panel-section">
        <h3 className="panel-section-title">Display</h3>
        <DisplayControls />
      </div>

      <div className="panel-section">
        <StatusPanel />
      </div>
    </div>
  )
}

