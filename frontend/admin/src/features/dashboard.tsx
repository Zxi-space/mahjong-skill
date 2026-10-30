import { Activity, House, Layers3, Users } from 'lucide-react'
import { PageHeader } from '../components/ui/page-header'
import { Panel } from '../components/ui/panel'
import { EmptyState } from '../components/ui/empty-state'
import { StatusBadge } from '../components/ui/status-badge'
import { DataTable } from '../components/ui/data-table'

const cards = [
  {title:'注册用户',icon:Users,detail:'等待用户统计 API'},
  {title:'电子技能卡',icon:Layers3,detail:'等待技能卡 API'},
  {title:'技能房间',icon:House,detail:'等待房间统计 API'},
  {title:'今日技能操作',icon:Activity,detail:'等待事件统计 API'},
]
interface RoomPreview { id: string; members: string; status: string }
export function Dashboard() {return <>
  <PageHeader eyebrow='DASHBOARD / OVERVIEW' title='工作台' description='欢迎来到雀变运营管理端。这里将展示技能卡和房间的真实运营数据。' actions={<StatusBadge tone='warning'>数据接口待接入</StatusBadge>}/>
  <section className='admin-kpi-grid' aria-label='运营统计'>{cards.map(({title,icon:Icon,detail})=><article key={title} className='admin-kpi'><div className='admin-kpi-head'><span>{title}</span><span className='admin-kpi-icon'><Icon size={19}/></span></div><strong aria-label={`${title}尚无数据`}>—</strong><p>{detail}</p></article>)}</section>
  <div className='admin-dashboard-grid'><Panel title='近 7 日趋势' description='真实趋势将在统计 API 接入后展示。'><EmptyState title='暂无趋势数据' description='不使用视觉设计稿中的示例数值作为真实运营指标。'/></Panel><Panel title='近期活跃技能房间' description='只统计电子技能房间，不包含线上麻将对局。'><DataTable<RoomPreview> columns={[{key:'id',title:'房间编号',render:r=>r.id},{key:'members',title:'玩家',render:r=>r.members},{key:'status',title:'状态',render:r=>r.status}]} rows={[]} rowKey={r=>r.id} emptyMessage='暂无房间记录'/></Panel></div>
  <div className='admin-dashboard-grid admin-dashboard-grid--lower'><Panel title='待审核内容'><EmptyState title='暂无审核任务' description='后续接入审核权限与真实任务列表。'/></Panel><Panel title='热门技能卡'><EmptyState title='暂无技能排行' description='统计口径确定后按真实使用记录计算。'/></Panel></div>
</>}
