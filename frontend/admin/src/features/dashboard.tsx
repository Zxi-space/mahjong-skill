import { Layers, House, Users, Activity, ArrowUpRight } from 'lucide-react'
const stats = [ {name:'技能模板', icon:Layers}, {name:'进行中的房间', icon:House}, {name:'累计用户', icon:Users}, {name:'今日操作', icon:Activity} ]
export function Dashboard() { return <><div className='page-head'><div><p className='eyebrow'>OVERVIEW</p><h1>雀变工作台</h1><p>统一管理电子技能卡、房间与运营内容。</p></div><span className='hint'>工程初始化演示 · 尚无统计数据</span></div>
  <div className='stats'>{stats.map(x => <div className='stat' key={x.name}><span className='stat-head'>{x.name}<x.icon size={19}/></span><strong>—</strong><small>接入后端后显示</small></div>)}</div>
  <section className='panel'><h2>接下来做什么 <ArrowUpRight size={18}/></h2><p>完成管理员登录与 RBAC、技能模板 CRUD、房间实时列表、门户内容管理。</p><div className='actions'><span className='chip'>React 19</span><span className='chip'>Vite 8</span><span className='chip'>Tailwind CSS 4</span><span className='chip'>TanStack Query</span></div></section>
</> }
