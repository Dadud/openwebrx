import { useReceiverStore } from '../store/receiverStore'

export default function StatusPanel() {
  const smeter = useReceiverStore((state) => state.smeter)
  const cpuUsage = useReceiverStore((state) => state.cpuUsage)
  const clients = useReceiverStore((state) => state.clients)

  return (
    <>
      <div className="panel-control">
        <label>S-Meter</label>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '20px', background: 'var(--bg-primary)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${Math.max(0, Math.min(100, ((smeter + 150) / 150) * 100))}%`,
                background: 'linear-gradient(to right, #0f0, #ff0, #f00)',
                transition: 'width 0.1s',
              }}
            />
          </div>
          <span style={{ minWidth: '50px', textAlign: 'right', fontFamily: 'monospace' }}>
            {smeter.toFixed(1)} dB
          </span>
        </div>
      </div>

      <div className="panel-control">
        <label>CPU Usage</label>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ flex: 1, height: '20px', background: 'var(--bg-primary)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${Math.max(0, Math.min(100, cpuUsage))}%`,
                background: cpuUsage > 80 ? '#f44' : cpuUsage > 50 ? '#fa4' : '#4a9eff',
                transition: 'width 0.2s',
              }}
            />
          </div>
          <span style={{ minWidth: '40px', textAlign: 'right', fontFamily: 'monospace' }}>
            {cpuUsage.toFixed(0)}%
          </span>
        </div>
      </div>

      <div className="panel-control">
        <label>Clients</label>
        <span style={{ flex: 1, textAlign: 'right', fontFamily: 'monospace' }}>
          {clients}
        </span>
      </div>
    </>
  )
}

