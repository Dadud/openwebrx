import { useReceiverStore } from '../store/receiverStore'
import { receiverCommands } from '../api/receiverAPI'

export default function AudioControls() {
  const volume = useReceiverStore((state) => state.volume)
  const muted = useReceiverStore((state) => state.muted)
  const squelch = useReceiverStore((state) => state.squelch)
  const nrLevel = useReceiverStore((state) => state.nrLevel)
  const toggleMute = useReceiverStore((state) => state.toggleMute)
  const setVolume = useReceiverStore((state) => state.setVolume)
  const setSquelch = useReceiverStore((state) => state.setSquelch)
  const setNREnabled = useReceiverStore((state) => state.setNREnabled)
  const setNRLevel = useReceiverStore((state) => state.setNRLevel)

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setVolume(value)
    receiverCommands.setVolume(value)
  }

  const handleSquelchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setSquelch(value)
    receiverCommands.setSquelch(value)
  }

  const handleNRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    setNRLevel(value)
    receiverCommands.setNR(value)
    setNREnabled(value !== 0)
  }

  return (
    <>
      <div className="panel-control">
        <label>Volume</label>
        <button
          className="panel-button"
          onClick={toggleMute}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          min="0"
          max="150"
          value={volume}
          onChange={handleVolumeChange}
          disabled={muted}
        />
        <span style={{ minWidth: '40px', textAlign: 'right' }}>{volume}%</span>
      </div>

      <div className="panel-control">
        <label>Squelch</label>
        <input
          type="range"
          min="-150"
          max="0"
          value={squelch}
          onChange={handleSquelchChange}
        />
        <span style={{ minWidth: '50px', textAlign: 'right' }}>{squelch} dB</span>
      </div>

      <div className="panel-control">
        <label>Noise Reduction</label>
        <input
          type="range"
          min="-20"
          max="20"
          value={nrLevel}
          onChange={handleNRChange}
        />
        <span style={{ minWidth: '40px', textAlign: 'right' }}>{nrLevel}</span>
      </div>
    </>
  )
}

