import { wsAPI } from '../api/websocket'
import { BINARY_AUDIO, BINARY_HD_AUDIO } from '../api/types'

// Simplified IMA ADPCM decoder (minimal implementation)
class ImaAdpcmDecoder {
  private stepIndex: number = 0
  private predictor: number = 0

  private static stepTable = [
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253,
    279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166,
    1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428,
    4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289,
    16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767
  ]

  private static indexTable = [
    -1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8
  ]

  decode(data: ArrayBuffer): Float32Array {
    const view = new Uint8Array(data)
    const output: number[] = []

    for (let i = 0; i < view.length; i++) {
      const byte = view[i]
      const nibbles = [byte & 0x0f, (byte >> 4) & 0x0f]

      for (const nibble of nibbles) {
        let step = ImaAdpcmDecoder.stepTable[this.stepIndex]
        let diff = step >> 3

        if (nibble & 1) diff += step >> 2
        if (nibble & 2) diff += step >> 1
        if (nibble & 4) diff += step
        if (nibble & 8) diff = -diff

        this.predictor = Math.max(-32768, Math.min(32767, this.predictor + diff))
        output.push(this.predictor / 32768.0)

        this.stepIndex += ImaAdpcmDecoder.indexTable[nibble]
        this.stepIndex = Math.max(0, Math.min(88, this.stepIndex))
      }
    }

    return new Float32Array(output)
  }

  reset() {
    this.stepIndex = 0
    this.predictor = 0
  }
}

export class AudioEngine {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null
  private scriptProcessor: ScriptProcessorNode | null = null
  private decoder: ImaAdpcmDecoder
  private audioBuffer: Float32Array[] = []
  private maxBufferSize: number = 48000 // ~1 second at 48kHz
  private volume: number = 1.0
  private muted: boolean = false

  constructor() {
    this.decoder = new ImaAdpcmDecoder()
    this.initAudioContext()
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)

      // Create script processor for audio playback
      this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 0, 1)
      this.scriptProcessor.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0)
        const samplesNeeded = output.length

        // Fill output from buffer
        let samplesWritten = 0
        while (samplesWritten < samplesNeeded && this.audioBuffer.length > 0) {
          const chunk = this.audioBuffer.shift()!
          const toWrite = Math.min(chunk.length, samplesNeeded - samplesWritten)
          output.set(chunk.subarray(0, toWrite), samplesWritten)
          samplesWritten += toWrite

          // If chunk wasn't fully consumed, put remainder back
          if (toWrite < chunk.length) {
            this.audioBuffer.unshift(chunk.subarray(toWrite))
          }
        }

        // Zero-fill if not enough data
        if (samplesWritten < samplesNeeded) {
          output.fill(0, samplesWritten)
        }
      }

      this.scriptProcessor.connect(this.gainNode)
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }

  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  handleAudioData(data: ArrayBuffer) {
    if (!this.audioContext || this.audioContext.state !== 'running') {
      return
    }

    try {
      // Decode IMA ADPCM
      const decoded = this.decoder.decode(data)

      // Apply volume
      if (this.muted || this.volume === 0) {
        decoded.fill(0)
      } else {
        for (let i = 0; i < decoded.length; i++) {
          decoded[i] *= this.volume
        }
      }

      // Add to buffer (limit buffer size)
      this.audioBuffer.push(decoded)
      const totalSamples = this.audioBuffer.reduce((sum, chunk) => sum + chunk.length, 0)
      
      if (totalSamples > this.maxBufferSize) {
        // Remove oldest chunks
        while (this.audioBuffer.length > 0 && totalSamples > this.maxBufferSize) {
          this.audioBuffer.shift()
        }
      }
    } catch (error) {
      console.error('Error processing audio data:', error)
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1.5, volume / 100))
    if (this.gainNode) {
      this.gainNode.gain.value = this.muted ? 0 : this.volume
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (this.gainNode) {
      this.gainNode.gain.value = muted ? 0 : this.volume
    }
  }

  getSampleRate(): number {
    return this.audioContext?.sampleRate || 48000
  }
}

// Initialize audio engine and wire up WebSocket handlers
let audioEngineInstance: AudioEngine | null = null

export function initAudioEngine(): AudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new AudioEngine()

    // Handle audio data from WebSocket
    wsAPI.onBinary((type, data) => {
      if (type === BINARY_AUDIO || type === BINARY_HD_AUDIO) {
        audioEngineInstance!.handleAudioData(data)
      }
    })
  }

  return audioEngineInstance
}

export function getAudioEngine(): AudioEngine | null {
  return audioEngineInstance
}

