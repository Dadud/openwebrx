import { useReceiverStore } from '../store/receiverStore'
import { receiverCommands } from '../api/receiverAPI'
import './FrequencyDisplay.css'

interface FrequencyDisplayProps {
  centerFreq: number
  offsetFreq: number
}

export default function FrequencyDisplay({
  centerFreq,
  offsetFreq,
}: FrequencyDisplayProps) {
  const tuningStep = useReceiverStore((state) => state.tuningStep)

  const formatFreq = (freq: number): string => {
    if (freq >= 1000000) {
      return `${(freq / 1000000).toFixed(6)} MHz`
    } else if (freq >= 1000) {
      return `${(freq / 1000).toFixed(3)} kHz`
    } else {
      return `${freq.toFixed(0)} Hz`
    }
  }

  const actualFreq = centerFreq + offsetFreq

  const tuneUp = () => {
    receiverCommands.setOffsetFrequency(offsetFreq + tuningStep)
  }

  const tuneDown = () => {
    receiverCommands.setOffsetFrequency(offsetFreq - tuningStep)
  }

  return (
    <div className="frequency-display">
      <div className="frequency-display-main">
        <div className="frequency-label">Frequency</div>
        <div className="frequency-value">{formatFreq(actualFreq)}</div>
      </div>
      <div className="frequency-display-secondary">
        <div className="frequency-offset">
          {offsetFreq !== 0 && (
            <span className="frequency-offset-value">
              {offsetFreq > 0 ? '+' : ''}{formatFreq(offsetFreq)}
            </span>
          )}
        </div>
      </div>
      <div className="frequency-controls">
        <button className="frequency-button" onClick={tuneDown} title="Tune down">
          ←
        </button>
        <button className="frequency-button" onClick={tuneUp} title="Tune up">
          →
        </button>
      </div>
    </div>
  )
}

