import { create } from 'zustand'

interface UIState {
  // Panel visibility
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  setLeftPanelOpen: (open: boolean) => void
  setRightPanelOpen: (open: boolean) => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void

  // Active panels
  activeLeftPanel: string | null
  activeRightPanel: string | null
  setActiveLeftPanel: (panel: string | null) => void
  setActiveRightPanel: (panel: string | null) => void

  // Spectrum visibility
  spectrumVisible: boolean
  setSpectrumVisible: (visible: boolean) => void

  // Zoom level
  zoomLevel: number
  setZoomLevel: (level: number) => void

  // Waterfall theme
  waterfallTheme: string
  setWaterfallTheme: (theme: string) => void

  // UI theme
  theme: string
  setTheme: (theme: string) => void

  // Opacity
  opacity: number
  setOpacity: (opacity: number) => void

  // Bandplan visibility
  bandplanVisible: boolean
  setBandplanVisible: (visible: boolean) => void

  // Error message
  error: string | null
  setError: (error: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Panels
  leftPanelOpen: false,
  rightPanelOpen: true,
  setLeftPanelOpen: (open) => set({ leftPanelOpen: open }),
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  toggleLeftPanel: () => set((state) => ({ leftPanelOpen: !state.leftPanelOpen })),
  toggleRightPanel: () => set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),

  // Active panels
  activeLeftPanel: null,
  activeRightPanel: 'receiver',
  setActiveLeftPanel: (panel) => set({ activeLeftPanel: panel }),
  setActiveRightPanel: (panel) => set({ activeRightPanel: panel }),

  // Spectrum
  spectrumVisible: true,
  setSpectrumVisible: (visible) => set({ spectrumVisible: visible }),

  // Zoom
  zoomLevel: 0,
  setZoomLevel: (level) => set({ zoomLevel: level }),

  // Themes
  waterfallTheme: 'default',
  theme: 'default',
  setWaterfallTheme: (theme) => set({ waterfallTheme: theme }),
  setTheme: (theme) => set({ theme }),

  // Opacity
  opacity: 100,
  setOpacity: (opacity) => set({ opacity }),

  // Bandplan
  bandplanVisible: true,
  setBandplanVisible: (visible) => set({ bandplanVisible: visible }),

  // Error
  error: null,
  setError: (error) => set({ error }),
}))

