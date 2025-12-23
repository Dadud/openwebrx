import { useReceiverStore } from '../store/receiverStore'
import { receiverCommands } from '../api/receiverAPI'

export default function WaterfallControls() {
  const waterfallMin = useReceiverStore((state) => state.waterfallMin)
  const waterfallMax = useReceiverStore((state) => state.waterfallMax)
  const waterfallAuto = useReceiverStore((state) => state.waterfallAuto)
  const setWaterfallMin = useReceiverStore((state) => state.setWaterfallMin)
  const setWaterfallMax = useReceiverStore((state) => state.setWaterfallMax)
  const setWaterfallAuto = useReceiverStore((state) => state.setWaterfallAuto)

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setWaterfallMin(value)
    receiverCommands.setWaterfallLevels(value, waterfallMax)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setWaterfallMax(value)
    receiverCommands.setWaterfallLevels(waterfallMin, value)
  }

  const handleAutoToggle = () => {
    setWaterfallAuto(!waterfallAuto)
  }

  return (
    <>
      <div className="panel-control">
        <label>Auto Range</label>
        <button
          className="panel-button"
          onClick={handleAutoToggle}
          style={{ background: waterfallAuto ? 'var(--accent)' : 'var(--bg-secondary)' }}
        >
          {waterfallAuto ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="panel-control">
        <label>Min Level</label>
        <input
          type="range"
          min="-200"
          max="100"
          value={waterfallMin}
          onChange={handleMinChange}
          disabled={waterfallAuto}
        />
        <span style={{ minWidth: '50px', textAlign: 'right' }}>{waterfallMin} dB</span>
      </div>

      <div className="panel-control">
        <label>Max Level</label>
        <input
          type="range"
          min="-200"
          max="100"
          value={waterfallMax}
          onChange={handleMaxChange}
          disabled={waterfallAuto}
        />
        <span style={{ minWidth: '50px', textAlign: 'right' }}>{waterfallMax} dB</span>
      </div>
    </>
  )
}

