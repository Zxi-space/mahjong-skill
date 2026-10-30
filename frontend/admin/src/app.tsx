import { Route, Routes } from 'react-router-dom'
import { AdminShell } from './components/layout/admin-shell'
import { Dashboard } from './features/dashboard'
import { ComponentsDemo } from './features/components-demo'
import { PageHeader } from './components/ui/page-header'
import { Panel } from './components/ui/panel'
import { EmptyState } from './components/ui/empty-state'
function NotReady({title}:{title:string}) {return <><PageHeader title={title} description='此模块尚未接入实际业务 API；当前仅交付布局和组件底座。'/><Panel><EmptyState title='业务模块待建设' description='后续按系统实施计划接入认证、权限、真实接口与操作。'/></Panel></>}
export function App(){return <AdminShell><Routes><Route path='/' element={<Dashboard/>}/><Route path='/components' element={<ComponentsDemo/>}/>{['skills','decks','rooms','users','review','settings'].map(x=><Route key={x} path={`/${x}`} element={<NotReady title={{skills:'卡牌管理',decks:'牌库管理',rooms:'房间管理',users:'用户管理',review:'内容审核',settings:'系统设置'}[x] || x}/>}/>)}</Routes></AdminShell>}
