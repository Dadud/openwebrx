import { useEffect, useRef } from 'react'
import './FrequencyScale.css'

interface FrequencyScaleProps {
  centerFreq: number
  bandwidth: number
  offsetFreq: number
}

export default function FrequencyScale({
  centerFreq,
  bandwidth,
  offsetFreq,
}: FrequencyScaleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width = canvas.clientWidth
    const height = canvas.height = canvas.clientHeight

    // Clear
    ctx.fillStyle = 'rgba(34, 34, 34, 0.9)'
    ctx.fillRect(0, 0, width, height)

    // Draw frequency scale
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 1
    ctx.font = '12px monospace'
    ctx.fillStyle = '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'

    const startFreq = centerFreq - bandwidth / 2
    const endFreq = centerFreq + bandwidth / 2
    const freqRange = endFreq - startFreq

    // Calculate tick spacing
    const logRange = Math.log10(freqRange)
    const tickPower = Math.floor(logRange)
    const tickSpacing = Math.pow(10, tickPower) / (freqRange > 1000000 ? 10 : freqRange > 100000 ? 5 : 2)

    // Draw ticks and labels
    const firstTick = Math.ceil(startFreq / tickSpacing) * tickSpacing
    for (let freq = firstTick; freq <= endFreq; freq += tickSpacing) {
      const x = ((freq - startFreq) / freqRange) * width
      
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()

      // Format frequency
      let label = ''
      if (freq >= 1000000) {
        label = `${(freq / 1000000).toFixed(3)} MHz`
      } else if (freq >= 1000) {
        label = `${(freq / 1000).toFixed(3)} kHz`
      } else {
        label = `${freq.toFixed(0)} Hz`
      }

      ctx.fillText(label, x, 4)
    }

    // Draw center frequency marker
    const centerX = width / 2
    ctx.strokeStyle = '#4a9eff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, height)
    ctx.stroke()

    // Draw offset frequency (tuning position)
    if (offsetFreq !== 0) {
      const offsetX = centerX + (offsetFreq / bandwidth) * width
      ctx.strokeStyle = '#ff4a4a'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(offsetX, 0)
      ctx.lineTo(offsetX, height)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [centerFreq, bandwidth, offsetFreq])

  return <canvas ref={canvasRef} className="frequency-scale" />
}

