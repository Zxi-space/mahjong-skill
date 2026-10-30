import { useState } from 'react'
import { PageHeader } from '../components/ui/page-header'
import { Panel } from '../components/ui/panel'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { StatusBadge } from '../components/ui/status-badge'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { Dialog } from '../components/ui/dialog'
import { DataTable } from '../components/ui/data-table'
export function ComponentsDemo(){const [open,setOpen]=useState(false);const [value,setValue]=useState('');return <>
  <PageHeader eyebrow='UI / COMPONENTS' title='基础组件示例' description='交互组件的 Light / Dark、焦点与空态检查页，仅使用演示输入，不写入业务数据。'/>
  <div className='admin-component-grid'><Panel title='按钮与状态'><div className='admin-controls'><Button onClick={()=>setOpen(true)}>打开弹窗</Button><Button variant='outline' onClick={()=>setValue('')}>清除输入</Button><Button disabled>禁用</Button><StatusBadge tone='success'>成功</StatusBadge><StatusBadge tone='warning'>待处理</StatusBadge><StatusBadge tone='danger'>异常</StatusBadge></div></Panel>
  <Panel title='输入与焦点'><label className='admin-field'><span>示例搜索</span><Input value={value} onChange={e=>setValue(e.target.value)} placeholder='输入内容检查焦点和样式'/></label><p className='admin-helper'>当前输入：{value || '（空）'}</p></Panel>
  <Panel title='加载骨架'><div className='admin-skeleton-demo'><Skeleton height={22} width='60%'/><Skeleton height={16}/><Skeleton height={16} width='80%'/></div></Panel>
  <Panel title='空状态'><EmptyState title='暂无列表记录' description='数据为空时提供清晰说明，而不是填充假数据。'/></Panel></div>
  <Panel title='数据表格基础版'><DataTable<{id:string;name:string}> rows={[]} rowKey={row=>row.id} columns={[{key:'id',title:'编号',render:row=>row.id},{key:'name',title:'名称',render:row=>row.name}]}/></Panel>
  <Dialog open={open} title='确认弹窗示例' description='这里是可真实关闭的原生 Dialog 容器。' onClose={()=>setOpen(false)}><Button onClick={()=>setOpen(false)}>知道了</Button></Dialog>
</>}
