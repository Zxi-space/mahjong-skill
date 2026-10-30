import { create } from 'zustand'
import Taro from '@tarojs/taro'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'
export const THEME_KEY = 'mahjong-skill-theme'

const isPreference = (value: unknown): value is ThemePreference =>
  value === 'light' || value === 'dark' || value === 'system'

function isH5(): boolean { return process.env.TARO_ENV === 'h5' }

function readPreference(): ThemePreference {
  try {
    const saved = isH5() && typeof localStorage !== 'undefined'
      ? localStorage.getItem(THEME_KEY) : Taro.getStorageSync(THEME_KEY)
    return isPreference(saved) ? saved : 'light'
  } catch { return 'light' }
}

function readSystemTheme(): ResolvedTheme {
  if (isH5()) {
    try {
      return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch { return 'light' }
  }
  try { return Taro.getSystemInfoSync().theme === 'dark' ? 'dark' : 'light' }
  catch { return 'light' }
}

export function resolveTheme(pref: ThemePreference, system: ResolvedTheme): ResolvedTheme {
  return pref === 'system' ? system : pref
}

interface ThemeState {
  preference: ThemePreference
  systemTheme: ResolvedTheme
  resolved: ResolvedTheme
  setPreference: (next: ThemePreference) => void
  setSystemTheme: (next: ResolvedTheme) => void
}

const initialPreference = readPreference()
const initialSystem = readSystemTheme()

export const useThemeStore = create<ThemeState>((set) => ({
  preference: initialPreference,
  systemTheme: initialSystem,
  resolved: resolveTheme(initialPreference, initialSystem),
  setPreference: (next) => {
    try {
      if (isH5() && typeof localStorage !== 'undefined') localStorage.setItem(THEME_KEY, next)
      else Taro.setStorageSync(THEME_KEY, next)
    } catch { /* storage denied; in-memory theme still works */ }
    set((state) => ({ preference: next, resolved: resolveTheme(next, state.systemTheme) }))
  },
  setSystemTheme: (next) => set((state) => ({
    systemTheme: next,
    resolved: resolveTheme(state.preference, next),
  })),
}))

// Initialized only once in App; never remounts the room state or React Query provider.
export function subscribeSystemTheme(): () => void {
  if (isH5() && typeof window !== 'undefined') {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const changed = (event: MediaQueryListEvent) => useThemeStore.getState().setSystemTheme(event.matches ? 'dark' : 'light')
    useThemeStore.getState().setSystemTheme(media.matches ? 'dark' : 'light')
    media.addEventListener('change', changed)
    return () => media.removeEventListener('change', changed)
  }
  if (process.env.TARO_ENV === 'weapp') {
    const handler = (event: {theme: 'light' | 'dark'}) => useThemeStore.getState().setSystemTheme(event.theme)
    try { Taro.onThemeChange(handler) } catch { /* other runtimes may not expose the event */ }
    return () => { try { Taro.offThemeChange(handler) } catch { /* unsupported runtime */ } }
  }
  return () => undefined
}

export function synchronizePlatformTheme(resolved: ResolvedTheme): void {
  if (isH5()) {
    if (typeof document !== 'undefined') document.documentElement.setAttribute('data-qb-theme', resolved)
    return
  }
  if (process.env.TARO_ENV === 'weapp') {
    // Platform navigation bar/background are outside CSS variable scope.
    try {
      Taro.setNavigationBarColor({
        frontColor: resolved === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: resolved === 'dark' ? '#091C19' : '#FFFCF6',
        animation: {duration: 0, timingFunc: 'linear'},
      })
      Taro.setBackgroundColor({backgroundColor: resolved === 'dark' ? '#091C19' : '#FFFCF6'})
    } catch { /* platform API best effort */ }
  }
}
