import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: '雀变 · 让牌局更有趣', description: '雀变 - 线下麻将技能牌电子化互动工具，支持微信小程序与 H5。' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang='zh-CN'><body>{children}</body></html>
}
