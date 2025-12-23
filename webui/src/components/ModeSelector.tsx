import { useReceiverStore } from '../store/receiverStore'
import { receiverCommands } from '../api/receiverAPI'

export default function ModeSelector() {
  const modes = useReceiverStore((state) => state.modes)
  const currentMode = useReceiverStore((state) => state.mode)

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    receiverCommands.setMode(e.target.value)
  }

  return (
    <div className="panel-control">
      <label>Mode</label>
      <select value={currentMode} onChange={handleModeChange}>
        {modes.map((mode) => (
          <option key={mode.name} value={mode.name}>
            {mode.label || mode.name}
          </option>
        ))}
      </select>
    </div>
  )
}

