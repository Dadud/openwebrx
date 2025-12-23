import { useEffect, useRef } from 'react'
import { useReceiverStore } from '../store/receiverStore'
import './BandplanOverlay.css'

interface BandplanOverlayProps {
  centerFreq: number
  bandwidth: number
}

export default function BandplanOverlay({
  centerFreq,
  bandwidth,
}: BandplanOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bands = useReceiverStore((state) => state.bands)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width = canvas.clientWidth
    const height = canvas.height = canvas.clientHeight

    // Clear
    ctx.clearRect(0, 0, width, height)

    const startFreq = centerFreq - bandwidth / 2
    const endFreq = centerFreq + bandwidth / 2
    const freqRange = endFreq - startFreq

    // Draw bands
    bands.forEach((band) => {
      const bandStart = Math.max(startFreq, band.low_bound)
      const bandEnd = Math.min(endFreq, band.high_bound)
      
      if (bandStart >= bandEnd) return

      const x1 = ((bandStart - startFreq) / freqRange) * width
      const x2 = ((bandEnd - startFreq) / freqRange) * width

      ctx.fillStyle = 'rgba(74, 158, 255, 0.2)'
      ctx.fillRect(x1, 0, x2 - x1, height)

      // Draw label
      ctx.fillStyle = '#4a9eff'
      ctx.font = '10px sans-serif'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(band.name, x1 + 2, 2)
    })
  }, [centerFreq, bandwidth, bands])

  return <canvas ref={canvasRef} className="bandplan-overlay" />
}

