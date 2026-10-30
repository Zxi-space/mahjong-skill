'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { ThemeSwitcher } from '../theme-switcher'
const nav = [{title:'首页',href:'#top'},{title:'产品特色',href:'#features'},{title:'使用方法',href:'#steps'},{title:'适用场景',href:'#scenes'}]
export function SiteHeader(){const [open,setOpen]=useState(false);return <header className='site-header' id='top'><div className='portal-container site-header-inner'>
  <Link className='site-brand' href='#top' aria-label='雀变首页'><span className='site-brand-symbol' aria-hidden='true'>雀</span><span><strong>雀变</strong><small>MAHJONG SKILL</small></span></Link>
  <nav className={`site-nav ${open?'is-open':''}`} aria-label='站点导航'>{nav.map(item=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)}>{item.title}</Link>)}</nav>
  <div className='site-header-actions'><ThemeSwitcher/><a className='portal-button portal-button--primary site-quick-cta' href={process.env.NEXT_PUBLIC_CLIENT_H5_URL||'http://localhost:5174'}>预览用户端 <ArrowUpRight size={17}/></a><button className='site-menu-toggle' type='button' onClick={()=>setOpen(!open)} aria-label={open?'关闭导航':'打开导航'} aria-expanded={open}>{open?<X size={22}/>:<Menu size={22}/>}</button></div>
</div></header>}
