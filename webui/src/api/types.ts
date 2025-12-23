// WebSocket message types from backend
export interface WSMessage {
  type: string;
  value?: any;
  reason?: string;
}

// Binary message types
export const BINARY_SPECTRUM = 0x01;
export const BINARY_AUDIO = 0x02;
export const BINARY_SECONDARY_FFT = 0x03;
export const BINARY_HD_AUDIO = 0x04;

// Receiver configuration
export interface ReceiverConfig {
  center_freq?: number;
  start_freq?: number;
  start_offset_freq?: number;
  samp_rate?: number;
  fft_size?: number;
  tuning_step?: number;
  start_mod?: string;
  sdr_id?: string;
  profile_id?: string;
  waterfall_levels?: [number, number];
  waterfall_auto_level_default_mode?: string;
  initial_squelch_level?: number;
  initial_nr_level?: number;
  squelch_auto_margin?: number;
}

// Global configuration
export interface GlobalConfig {
  waterfall_scheme?: string;
  waterfall_colors?: number[];
  waterfall_auto_levels?: boolean;
  waterfall_auto_min_range?: number;
  fft_compression?: string;
  audio_compression?: string;
  max_clients?: number;
  tuning_precision?: number;
  allow_center_freq_changes?: boolean;
  allow_audio_recording?: boolean;
  allow_chat?: boolean;
  ui_theme?: string;
}

// Receiver details
export interface ReceiverDetails {
  name?: string;
  location?: string;
  asl?: number;
  lat?: number;
  lon?: number;
  antenna?: string;
  version?: string;
}

// Mode information
export interface Mode {
  name: string;
  label: string;
  modulation?: string;
  underlying?: string;
}

// Bookmark
export interface Bookmark {
  name: string;
  frequency: number;
  modulation?: string;
  underlying?: string;
  description?: string;
  scannable?: boolean;
}

// Dial frequency
export interface DialFrequency {
  frequency: number;
  name?: string;
}

// Band information
export interface Band {
  name: string;
  low_bound: number;
  high_bound: number;
  tags?: string[];
}

// Profile
export interface Profile {
  id: string;
  name: string;
  center_freq: number;
  samp_rate: number;
  start_mod?: string;
  start_freq?: number;
}

// Features
export interface Features {
  [key: string]: boolean;
}

// Metadata (for digital modes)
export interface Metadata {
  mode?: string;
  [key: string]: any;
}

