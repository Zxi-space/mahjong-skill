'use client'
import Link from 'next/link'
import { ArrowUpRight, Menu } from 'lucide-react'
import { ThemeSwitcher } from '../theme-switcher'
import { Button } from '../ui/button'
import { Sheet,SheetClose,SheetContent,SheetHeader,SheetTitle,SheetTrigger } from '../ui/sheet'
import { Separator } from '../ui/separator'
import { NavigationMenu,NavigationMenuList,NavigationMenuItem,NavigationMenuLink } from '../ui/navigation-menu'
const nav=[{title:'首页',href:'#top'},{title:'产品特色',href:'#features'},{title:'使用方法',href:'#steps'},{title:'适用场景',href:'#scenes'}]
const clientUrl=process.env.NEXT_PUBLIC_CLIENT_H5_URL||'http://localhost:5174'
export function SiteHeader(){return <header className='site-header' id='top'><div className='portal-container site-header-inner'><Link className='site-brand' href='#top' aria-label='雀变首页'><span className='site-brand-symbol' aria-hidden='true'>雀</span><span><strong>雀变</strong><small>MAHJONG SKILL</small></span></Link><nav className='site-nav' aria-label='站点导航'><NavigationMenu viewport={false}><NavigationMenuList>{nav.map(item=><NavigationMenuItem key={item.href}><NavigationMenuLink asChild><Link href={item.href}>{item.title}</Link></NavigationMenuLink></NavigationMenuItem>)}</NavigationMenuList></NavigationMenu></nav><div className='site-header-actions'><ThemeSwitcher/><Button asChild size='default' className='site-quick-cta'><a href={clientUrl}>预览用户端 <ArrowUpRight size={17}/></a></Button><div className='lg:hidden'><Sheet><SheetTrigger asChild><Button variant='outline' size='icon' aria-label='打开站点导航'><Menu size={20}/></Button></SheetTrigger><SheetContent aria-describedby={undefined} className='gap-5'><SheetHeader><SheetTitle>雀变 · 站点导航</SheetTitle></SheetHeader><Separator/><nav aria-label='移动端导航' className='flex flex-col gap-2'>{nav.map(item=><SheetClose key={item.href} asChild><Link className='rounded-xl px-3 py-3 text-sm font-semibold text-[var(--qb-text-primary)] hover:bg-[var(--qb-bg-hover)]' href={item.href}>{item.title}</Link></SheetClose>)}</nav><Button asChild size='lg' className='mt-3'><a href={clientUrl}>预览用户端 <ArrowUpRight size={17}/></a></Button></SheetContent></Sheet></div></div></div></header>}
