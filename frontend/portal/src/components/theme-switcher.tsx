'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'

export type ThemePreference = 'light' | 'dark' | 'system'
const storageKey = 'mahjong-skill-theme'
const options = [
  { value: 'light' as const, label: '浅色', icon: Sun },
  { value: 'dark' as const, label: '深色', icon: Moon },
  { value: 'system' as const, label: '跟随系统', icon: Monitor },
]

function resolve(preference: ThemePreference, systemDark: boolean) {
  return preference === 'system' ? (systemDark ? 'dark' : 'light') : preference
}

export function ThemeSwitcher() {
  // SSR matches initial HTML; browser theme is applied before paint by bootstrap script.
  const [preference, setPreference] = useState<ThemePreference>('light')
  const [systemDark, setSystemDark] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    try { stored = localStorage.getItem(storageKey) } catch { /* private browser mode */ }
    const initial: ThemePreference = stored === 'dark' || stored === 'system' ? stored : 'light'
    setPreference(initial)
    if (!window.matchMedia) { setReady(true); return }
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    setSystemDark(media.matches)
    setReady(true)
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (ready) document.documentElement.setAttribute('data-qb-theme', resolve(preference, systemDark))
  }, [preference, systemDark, ready])

  function choose(next: ThemePreference) {
    setPreference(next)
    try { localStorage.setItem(storageKey, next) } catch { /* storage unavailable */ }
    // Apply immediately; do not wait for effect after rerender.
    document.documentElement.setAttribute('data-qb-theme', resolve(next, systemDark))
  }

  return <div className='qb-theme-switcher' role='group' aria-label='显示主题'>
    {options.map(({value, label, icon: Icon}) => <button
      key={value} type='button' title={`${label}主题`} aria-label={`${label}主题`}
      aria-pressed={preference === value}
      className={`qb-theme-option ${preference === value ? 'is-selected' : ''}`}
      onClick={() => choose(value)}
    ><Icon size={16} aria-hidden='true'/><span>{label}</span></button>)}
  </div>
}
