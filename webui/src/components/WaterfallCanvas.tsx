import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { wsAPI } from '../api/websocket'
import { BINARY_SPECTRUM } from '../api/types'
import { useReceiverStore } from '../store/receiverStore'

interface WaterfallCanvasProps {
  fftSize: number
  bandwidth: number
  centerFreq: number
  offsetFreq: number
}

// Waterfall color scheme (simplified - can be expanded)
const getWaterfallColor = (value: number, min: number, max: number): [number, number, number] => {
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)))
  
  // Simple color gradient: black -> blue -> cyan -> green -> yellow -> red
  if (normalized < 0.2) {
    const t = normalized / 0.2
    return [0, 0, t * 0.5] // black to dark blue
  } else if (normalized < 0.4) {
    const t = (normalized - 0.2) / 0.2
    return [0, t * 0.5, 0.5 + t * 0.5] // dark blue to cyan
  } else if (normalized < 0.6) {
    const t = (normalized - 0.4) / 0.2
    return [0, 0.5 + t * 0.5, 1] // cyan to green
  } else if (normalized < 0.8) {
    const t = (normalized - 0.6) / 0.2
    return [t, 1, 1 - t] // green to yellow
  } else {
    const t = (normalized - 0.8) / 0.2
    return [1, 1 - t * 0.5, 0] // yellow to red
  }
}

export default function WaterfallCanvas({
  fftSize,
}: WaterfallCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const textureRef = useRef<THREE.DataTexture | null>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const dataArrayRef = useRef<Float32Array | null>(null)
  const waterfallDataRef = useRef<Float32Array[]>([])
  const maxLinesRef = useRef(500) // Keep last 500 lines

  const waterfallMin = useReceiverStore((state) => state.waterfallMin)
  const waterfallMax = useReceiverStore((state) => state.waterfallMax)
  const waterfallAuto = useReceiverStore((state) => state.waterfallAuto)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    // Create texture for waterfall data
    const textureData = new Uint8Array(fftSize * maxLinesRef.current * 3) // RGB
    const texture = new THREE.DataTexture(
      textureData,
      fftSize,
      maxLinesRef.current,
      THREE.RGBAFormat
    )
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    textureRef.current = texture

    // Create plane to display waterfall
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    materialRef.current = material
    meshRef.current = mesh

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      rendererRef.current.setSize(newWidth, newHeight)
    }

    window.addEventListener('resize', handleResize)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (rendererRef.current?.domElement.parentNode) {
        rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement)
      }
      texture.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [fftSize])

  // Handle spectrum data
  useEffect(() => {
    const handleSpectrum = (type: number, data: ArrayBuffer) => {
      if (type !== BINARY_SPECTRUM || !textureRef.current) return

      // Decode spectrum data
      // Note: The backend sends IMA ADPCM compressed data, but for now we'll try to decode
      // as float32 first (if backend sends uncompressed), then fall back to simple conversion
      const view = new DataView(data)
      const samples: number[] = []
      
      // Try to decode as float32 array (uncompressed)
      try {
        for (let i = 0; i < fftSize && i * 4 < data.byteLength; i++) {
          samples.push(view.getFloat32(i * 4, true))
        }
      } catch {
        // Fallback: try as uint8 and convert (simplified - actual IMA ADPCM decoder needed)
        const uint8View = new Uint8Array(data)
        for (let i = 0; i < fftSize && i < uint8View.length; i++) {
          samples.push((uint8View[i] - 128) * 0.5)
        }
      }

      if (samples.length !== fftSize) return

      // Add to waterfall data
      const floatArray = new Float32Array(samples)
      waterfallDataRef.current.push(floatArray)
      
      // Keep only last maxLines lines
      if (waterfallDataRef.current.length > maxLinesRef.current) {
        waterfallDataRef.current.shift()
      }

      // Update texture
      updateTexture()
    }

    // Initialize data array
    dataArrayRef.current = new Float32Array(fftSize)

    const unsubscribe = wsAPI.onBinary(handleSpectrum)
    return unsubscribe
  }, [fftSize])

  const updateTexture = () => {
    if (!textureRef.current || waterfallDataRef.current.length === 0) return

    const texture = textureRef.current
    const textureData = texture.image.data
    const lines = waterfallDataRef.current.length
    const min = waterfallAuto ? 
      Math.min(...waterfallDataRef.current.flatMap(arr => Array.from(arr))) : 
      waterfallMin
    const max = waterfallAuto ?
      Math.max(...waterfallDataRef.current.flatMap(arr => Array.from(arr))) :
      waterfallMax

    // Fill texture from bottom to top (newest at top)
    for (let y = 0; y < lines; y++) {
      const lineIndex = lines - 1 - y // Reverse order
      const lineData = waterfallDataRef.current[lineIndex]
      
      for (let x = 0; x < fftSize; x++) {
        const value = lineData[x] || 0
        const [r, g, b] = getWaterfallColor(value, min, max)
        const index = (y * fftSize + x) * 3
        
        textureData[index] = Math.floor(r * 255)
        textureData[index + 1] = Math.floor(g * 255)
        textureData[index + 2] = Math.floor(b * 255)
      }
    }

      // Update texture (dimensions are set at creation, just update data)
      texture.needsUpdate = true
  }

  // Update texture when waterfall data changes
  useEffect(() => {
    if (waterfallDataRef.current.length > 0) {
      updateTexture()
    }
  }, [waterfallMin, waterfallMax, waterfallAuto])

  return <div ref={containerRef} className="waterfall-canvas" />
}

