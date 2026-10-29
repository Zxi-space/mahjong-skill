import { LayoutDashboard, Layers, Users, House, Settings, ShieldCheck } from 'lucide-react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { Dashboard } from './features/dashboard'
const items = [
  { to: '/', label: '工作台', icon: LayoutDashboard },
  { to: '/skills', label: '技能管理', icon: Layers },
  { to: '/rooms', label: '房间管理', icon: House },
  { to: '/users', label: '用户管理', icon: Users },
  { to: '/settings', label: '系统设置', icon: Settings },
]
function EmptyPage({ title }: {title: string}) { return <div className='panel'><h2>{title}</h2><p>模块尚未开发；此处不会伪造后端数据。</p></div> }
export function App() { return <div className='shell'>
  <aside className='sidebar'><div className='brand'><div className='logo'>雀</div><div><strong>雀变</strong><small>MAHJONG SKILL</small></div></div>
    <div className='nav-heading'>管理导航</div><nav>{items.map(x => <NavLink key={x.to} title={x.label} to={x.to} end={x.to === '/'} className={({isActive}) => `nav-item ${isActive?'active':''}`}><x.icon size={19}/>{x.label}</NavLink>)}</nav>
    <div className='sidebar-foot'><ShieldCheck size={16}/> 独立管理端 · 待接入鉴权</div>
  </aside><main className='main'><header className='topbar'><span>运营管理平台</span><span className='env-label'>DEV / INITIALIZED</span></header>
    <div className='content'><Routes><Route path='/' element={<Dashboard/>}/>{items.slice(1).map(x => <Route key={x.to} path={x.to} element={<EmptyPage title={x.label} />}/>)}</Routes></div>
  </main></div> }
