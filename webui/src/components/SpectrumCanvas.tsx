import { useEffect, useRef } from 'react'
import { wsAPI } from '../api/websocket'
import { BINARY_SPECTRUM } from '../api/types'
import { useReceiverStore } from '../store/receiverStore'

interface SpectrumCanvasProps {
  fftSize: number
  bandwidth: number
  centerFreq: number
  offsetFreq: number
}

export default function SpectrumCanvas({
  fftSize,
}: SpectrumCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dataArrayRef = useRef<Float32Array | null>(null)

  const waterfallMin = useReceiverStore((state) => state.waterfallMin)
  const waterfallMax = useReceiverStore((state) => state.waterfallMax)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width = canvas.clientWidth
    const height = canvas.height = canvas.clientHeight

    const handleSpectrum = (type: number, data: ArrayBuffer) => {
      if (type !== BINARY_SPECTRUM) return

      // Decode spectrum data
      // Note: Backend sends IMA ADPCM compressed data, but we try float32 first
      // (if backend sends uncompressed), then fall back to simple conversion
      const view = new DataView(data)
      const samples: number[] = []
      
      try {
        // Try float32 (uncompressed)
        for (let i = 0; i < fftSize && i * 4 < data.byteLength; i++) {
          samples.push(view.getFloat32(i * 4, true))
        }
      } catch {
        // Fallback: simple uint8 conversion (actual IMA ADPCM decoder needed)
        const uint8View = new Uint8Array(data)
        for (let i = 0; i < fftSize && i < uint8View.length; i++) {
          samples.push((uint8View[i] - 128) * 0.5)
        }
      }

      if (samples.length !== fftSize) return

      dataArrayRef.current = new Float32Array(samples)
      drawSpectrum(ctx, width, height)
    }

    const unsubscribe = wsAPI.onBinary(handleSpectrum)
    return unsubscribe
  }, [fftSize])

  const drawSpectrum = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    if (!dataArrayRef.current) return

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = '#4a9eff'
    ctx.lineWidth = 1
    ctx.beginPath()

    const data = dataArrayRef.current
    const step = width / fftSize
    const range = waterfallMax - waterfallMin

    for (let i = 0; i < fftSize; i++) {
      const x = i * step
      const value = data[i]
      const normalized = Math.max(0, Math.min(1, (value - waterfallMin) / range))
      const y = height - (normalized * height)

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }

  // Redraw on data or range changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    drawSpectrum(ctx, canvas.width, canvas.height)
  }, [waterfallMin, waterfallMax])

  return <canvas ref={canvasRef} className="spectrum-canvas" />
}

