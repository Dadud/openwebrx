import { wsAPI } from './websocket'
import { useReceiverStore } from '../store/receiverStore'
import { WSMessage } from './types'

// Initialize WebSocket connection and wire up message handlers
export function initReceiverAPI() {
  const store = useReceiverStore.getState()

  // Handle text messages
  wsAPI.onMessage((message: WSMessage) => {
    switch (message.type) {
      case 'config':
        if (message.value) {
          store.setConfig(message.value)
          // Update derived state
          if (message.value.center_freq !== undefined) {
            store.setCenterFreq(message.value.center_freq)
          }
          if (message.value.start_offset_freq !== undefined) {
            store.setOffsetFreq(message.value.start_offset_freq)
          }
          if (message.value.samp_rate !== undefined) {
            store.setBandwidth(message.value.samp_rate)
          }
          if (message.value.tuning_step !== undefined) {
            store.setTuningStep(message.value.tuning_step)
          }
          if (message.value.start_mod !== undefined) {
            store.setMode(message.value.start_mod)
          }
          if (message.value.waterfall_levels) {
            store.setWaterfallMin(message.value.waterfall_levels[0])
            store.setWaterfallMax(message.value.waterfall_levels[1])
          }
          if (message.value.initial_squelch_level !== undefined) {
            store.setSquelch(message.value.initial_squelch_level)
          }
          if (message.value.initial_nr_level !== undefined) {
            store.setNRLevel(message.value.initial_nr_level)
            store.setNREnabled(message.value.initial_nr_level !== 0)
          }
        }
        break

      case 'receiver_details':
        if (message.value) {
          store.setReceiverDetails(message.value)
        }
        break

      case 'modes':
        if (message.value) {
          store.setModes(message.value)
        }
        break

      case 'profiles':
        if (message.value) {
          store.setProfiles(message.value)
        }
        break

      case 'features':
        if (message.value) {
          store.setFeatures(message.value)
        }
        break

      case 'bookmarks':
        if (message.value) {
          store.setBookmarks(message.value)
        }
        break

      case 'dial_frequencies':
        if (message.value) {
          store.setDialFrequencies(message.value)
        }
        break

      case 'bands':
        if (message.value) {
          store.setBands(message.value)
        }
        break

      case 'smeter':
        if (message.value !== undefined) {
          store.setSmeter(message.value)
        }
        break

      case 'cpuusage':
        if (message.value !== undefined) {
          store.setCpuUsage(message.value)
        }
        break

      case 'clients':
        if (message.value !== undefined) {
          store.setClients(message.value)
        }
        break

      case 'metadata':
        if (message.value) {
          store.setMetadata(message.value)
        }
        break

      case 'log_message':
        console.log('Server message:', message.value)
        break

      case 'sdr_error':
      case 'demodulator_error':
        console.error('Error:', message.value || message.reason)
        break

      case 'backoff':
        console.warn('Backoff:', message.reason)
        break
    }
  })

  // Handle binary messages - these will be handled by specific components
  // (waterfall, audio engine, etc.)
}

// Commands to send to backend
export const receiverCommands = {
  start: () => wsAPI.sendCommand('start'),
  stop: () => wsAPI.sendCommand('stop'),
  setFrequency: (freq: number) => wsAPI.sendCommand('set_frequency', { value: freq }),
  setOffsetFrequency: (offset: number) => wsAPI.sendCommand('set_offset_frequency', { value: offset }),
  setMode: (mode: string) => wsAPI.sendCommand('set_modulation', { value: mode }),
  setVolume: (volume: number) => wsAPI.sendCommand('set_volume', { value: volume }),
  setSquelch: (level: number) => wsAPI.sendCommand('set_squelch', { value: level }),
  setNR: (level: number) => wsAPI.sendCommand('set_nr', { value: level }),
  setWaterfallLevels: (min: number, max: number) => 
    wsAPI.sendCommand('set_waterfall_levels', { min, max }),
  setProfile: (sdrId: string, profileId: string) => 
    wsAPI.sendCommand('set_profile', { sdr_id: sdrId, profile_id: profileId }),
}

