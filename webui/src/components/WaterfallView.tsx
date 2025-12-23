import { useReceiverStore } from '../store/receiverStore'
import { useUIStore } from '../store/uiStore'
import SpectrumCanvas from './SpectrumCanvas'
import WaterfallCanvas from './WaterfallCanvas'
import FrequencyScale from './FrequencyScale'
import BandplanOverlay from './BandplanOverlay'
import './WaterfallView.css'

export default function WaterfallView() {
  const fftSize = useReceiverStore((state) => state.config.fft_size || 4096)
  const bandwidth = useReceiverStore((state) => state.bandwidth)
  const centerFreq = useReceiverStore((state) => state.centerFreq)
  const offsetFreq = useReceiverStore((state) => state.offsetFreq)
  const spectrumVisible = useUIStore((state) => state.spectrumVisible)

  return (
    <div className="waterfall-view">
      <div className="waterfall-frequency-container">
        {useUIStore((state) => state.bandplanVisible) && (
          <BandplanOverlay
            centerFreq={centerFreq}
            bandwidth={bandwidth}
          />
        )}
        <FrequencyScale
          centerFreq={centerFreq}
          bandwidth={bandwidth}
          offsetFreq={offsetFreq}
        />
        {spectrumVisible && (
          <SpectrumCanvas
            fftSize={fftSize}
            bandwidth={bandwidth}
            centerFreq={centerFreq}
            offsetFreq={offsetFreq}
          />
        )}
      </div>
      <div className="waterfall-canvas-container">
        <WaterfallCanvas
          fftSize={fftSize}
          bandwidth={bandwidth}
          centerFreq={centerFreq}
          offsetFreq={offsetFreq}
        />
      </div>
    </div>
  )
}

