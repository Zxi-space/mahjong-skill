import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: '雀变 · 让牌局更有趣', description: '雀变 - 线下麻将技能牌电子化互动工具，支持微信小程序与 H5。' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang='zh-CN' suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var p=localStorage.getItem('mahjong-skill-theme');if(p!=='dark'&&p!=='system')p='light';var dark=p==='dark'||(p==='system'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.setAttribute('data-qb-theme',dark?'dark':'light')}catch(e){document.documentElement.setAttribute('data-qb-theme','light')}})();` }} /></head><body>{children}</body></html>
}
