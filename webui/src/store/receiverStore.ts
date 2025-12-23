import { create } from 'zustand'
import { ReceiverConfig, GlobalConfig, ReceiverDetails, Mode, Bookmark, DialFrequency, Band, Profile, Features, Metadata } from '../api/types'

interface ReceiverState {
  // Connection state
  connected: boolean
  setConnected: (connected: boolean) => void

  // Configuration
  config: ReceiverConfig
  globalConfig: GlobalConfig
  receiverDetails: ReceiverDetails
  setConfig: (config: Partial<ReceiverConfig>) => void
  setGlobalConfig: (config: Partial<GlobalConfig>) => void
  setReceiverDetails: (details: ReceiverDetails) => void

  // Available options
  modes: Mode[]
  profiles: Profile[]
  features: Features
  setModes: (modes: Mode[]) => void
  setProfiles: (profiles: Profile[]) => void
  setFeatures: (features: Features) => void

  // Frequency and tuning
  centerFreq: number
  offsetFreq: number
  bandwidth: number
  setCenterFreq: (freq: number) => void
  setOffsetFreq: (freq: number) => void
  setBandwidth: (bw: number) => void

  // Current mode
  mode: string
  setMode: (mode: string) => void

  // Audio
  volume: number
  muted: boolean
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  toggleMute: () => void

  // Squelch
  squelch: number
  setSquelch: (level: number) => void

  // Noise reduction
  nrEnabled: boolean
  nrLevel: number
  setNREnabled: (enabled: boolean) => void
  setNRLevel: (level: number) => void

  // Waterfall
  waterfallMin: number
  waterfallMax: number
  waterfallAuto: boolean
  setWaterfallMin: (min: number) => void
  setWaterfallMax: (max: number) => void
  setWaterfallAuto: (auto: boolean) => void

  // Tuning step
  tuningStep: number
  setTuningStep: (step: number) => void

  // Bookmarks and bands
  bookmarks: Bookmark[]
  dialFrequencies: DialFrequency[]
  bands: Band[]
  setBookmarks: (bookmarks: Bookmark[]) => void
  setDialFrequencies: (freqs: DialFrequency[]) => void
  setBands: (bands: Band[]) => void

  // Metadata (for digital modes)
  metadata: Metadata | null
  setMetadata: (metadata: Metadata | null) => void

  // S-meter
  smeter: number
  setSmeter: (level: number) => void

  // Status
  cpuUsage: number
  clients: number
  setCpuUsage: (usage: number) => void
  setClients: (count: number) => void
}

export const useReceiverStore = create<ReceiverState>((set) => ({
  // Connection
  connected: false,
  setConnected: (connected) => set({ connected }),

  // Config
  config: {},
  globalConfig: {},
  receiverDetails: {},
  setConfig: (config) => set((state) => ({ config: { ...state.config, ...config } })),
  setGlobalConfig: (config) => set((state) => ({ globalConfig: { ...state.globalConfig, ...config } })),
  setReceiverDetails: (details) => set({ receiverDetails: details }),

  // Options
  modes: [],
  profiles: [],
  features: {},
  setModes: (modes) => set({ modes }),
  setProfiles: (profiles) => set({ profiles }),
  setFeatures: (features) => set({ features }),

  // Frequency
  centerFreq: 0,
  offsetFreq: 0,
  bandwidth: 0,
  setCenterFreq: (freq) => set({ centerFreq: freq }),
  setOffsetFreq: (freq) => set({ offsetFreq: freq }),
  setBandwidth: (bw) => set({ bandwidth: bw }),

  // Mode
  mode: '',
  setMode: (mode) => set({ mode }),

  // Audio
  volume: 100,
  muted: false,
  setVolume: (volume) => set({ volume }),
  setMuted: (muted) => set({ muted }),
  toggleMute: () => set((state) => ({ muted: !state.muted })),

  // Squelch
  squelch: -150,
  setSquelch: (level) => set({ squelch: level }),

  // NR
  nrEnabled: false,
  nrLevel: 0,
  setNREnabled: (enabled) => set({ nrEnabled: enabled }),
  setNRLevel: (level) => set({ nrLevel: level }),

  // Waterfall
  waterfallMin: -200,
  waterfallMax: 100,
  waterfallAuto: true,
  setWaterfallMin: (min) => set({ waterfallMin: min }),
  setWaterfallMax: (max) => set({ waterfallMax: max }),
  setWaterfallAuto: (auto) => set({ waterfallAuto: auto }),

  // Tuning step
  tuningStep: 1,
  setTuningStep: (step) => set({ tuningStep: step }),

  // Bookmarks
  bookmarks: [],
  dialFrequencies: [],
  bands: [],
  setBookmarks: (bookmarks) => set({ bookmarks }),
  setDialFrequencies: (freqs) => set({ dialFrequencies: freqs }),
  setBands: (bands) => set({ bands }),

  // Metadata
  metadata: null,
  setMetadata: (metadata) => set({ metadata }),

  // S-meter
  smeter: 0,
  setSmeter: (level) => set({ smeter: level }),

  // Status
  cpuUsage: 0,
  clients: 0,
  setCpuUsage: (usage) => set({ cpuUsage: usage }),
  setClients: (count) => set({ clients: count }),
}))

