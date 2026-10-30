import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Layers3, WalletCards, House, Users, ShieldCheck, Menu, X, Search, Settings2, Blocks, Bell, ChevronRight } from 'lucide-react'
import { ThemeSwitcher } from '../theme-switcher'
import type { ReactNode } from 'react'

const menu = [
  { to: '/', label: '工作台', icon: LayoutDashboard },
  { to: '/skills', label: '卡牌管理', icon: Layers3 },
  { to: '/decks', label: '牌库管理', icon: WalletCards },
  { to: '/rooms', label: '房间管理', icon: House },
  { to: '/users', label: '用户管理', icon: Users },
  { to: '/review', label: '内容审核', icon: ShieldCheck },
]
const tools = [{to: '/components',label:'组件示例',icon:Blocks},{to: '/settings',label:'系统设置',icon:Settings2}]
const labels = Object.fromEntries([...menu, ...tools].map(item=>[item.to,item.label]))
export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const current = labels[pathname] || '管理端'
  return <div className='admin-shell'>
    {open && <button aria-label='关闭导航菜单' className='sidebar-backdrop' onClick={()=>setOpen(false)}/>}
    <aside className={`admin-sidebar ${open ? 'is-open' : ''}`} aria-label='管理端侧边栏'>
      <Link className='admin-brand' to='/' onClick={()=>setOpen(false)}><span className='admin-brand-mark' aria-hidden='true'>雀</span><span><strong>雀变</strong><small>运营管理端</small></span></Link>
      <div className='admin-nav-group'><span className='admin-nav-title'>运营管理</span><nav aria-label='运营管理'>{menu.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)} className={({isActive})=>`admin-nav-link ${isActive ? 'is-active' : ''}`}><Icon size={18}/><span>{label}</span>{pathname===to&&<ChevronRight size={15} className='admin-nav-arrow'/>}</NavLink>)}</nav></div>
      <div className='admin-nav-group'><span className='admin-nav-title'>开发与设置</span><nav aria-label='开发与设置'>{tools.map(({to,label,icon:Icon})=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`admin-nav-link ${isActive ? 'is-active' : ''}`}><Icon size={18}/><span>{label}</span></NavLink>)}</nav></div>
      <div className='admin-sidebar-note'>本地开发 · 管理认证待接入</div>
    </aside>
    <div className='admin-main'>
      <header className='admin-header'><div className='admin-header-start'><button className='admin-menu-toggle admin-icon-button' aria-label={open?'关闭菜单':'打开菜单'} onClick={()=>setOpen(!open)}>{open ? <X size={21}/> : <Menu size={21}/>}</button><span className='admin-header-location'>{current}</span><span className='admin-header-separator'>/</span><span className='admin-header-caption'>雀变运营管理</span></div>
        <div className='admin-header-actions'><div className='admin-search-label'><Search size={16}/><span>搜索待接入</span></div><ThemeSwitcher/><span className='admin-icon-placeholder' title='通知功能待接入'><Bell size={19}/></span><span className='admin-user-avatar' aria-label='管理员身份待接入'>管</span></div>
      </header>
      <main className='admin-content' id='main-content'>{children}</main>
    </div>
  </div>
}
