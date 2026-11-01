import { useState } from 'react'
import { PageHeader } from '../components/ui/page-header'
import { Panel } from '../components/ui/panel'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { StatusBadge } from '../components/ui/status-badge'
import { EmptyState } from '../components/ui/empty-state'
import { Skeleton } from '../components/ui/skeleton'
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,DialogClose } from '../components/ui/dialog'
import { AlertDialog,AlertDialogAction,AlertDialogCancel,AlertDialogContent,AlertDialogDescription,AlertDialogFooter,AlertDialogHeader,AlertDialogTitle,AlertDialogTrigger } from '../components/ui/alert-dialog'
import { Sheet,SheetContent,SheetDescription,SheetHeader,SheetTitle,SheetTrigger } from '../components/ui/sheet'
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '../components/ui/select'
import { Tabs,TabsContent,TabsList,TabsTrigger } from '../components/ui/tabs'
import { Switch } from '../components/ui/switch'
import { Textarea } from '../components/ui/textarea'
import { DataTable,type TableColumn } from '../components/ui/data-table'
import { Tooltip,TooltipContent,TooltipTrigger } from '../components/ui/tooltip'
interface DemoRecord{id:string;name:string;status:string}
const demoRows:DemoRecord[]=[{id:'DEMO-003',name:'组件预览 C',status:'草稿'},{id:'DEMO-001',name:'组件预览 A',status:'演示'},{id:'DEMO-002',name:'组件预览 B',status:'演示'}]
const demoColumns:TableColumn<DemoRecord>[]=[{key:'id',title:'编号',render:row=>row.id,sortable:true},{key:'name',title:'名称',render:row=>row.name},{key:'status',title:'状态',render:row=>row.status}]
export function ComponentsDemo(){
 const [value,setValue]=useState('')
 const [selected,setSelected]=useState('all')
 const [notifications,setNotifications]=useState(true)
 const [dialogOpen,setDialogOpen]=useState(false)
 return <><PageHeader eyebrow='UI / SHADCN' title='基础组件实验室' description='真正使用 shadcn/ui + Radix 原语，检查键盘、焦点、弹层、暗色与响应状态；所有输入均为本地演示。'/>
 <div className='mb-4 grid gap-4 lg:grid-cols-2'>
 <Panel title='按钮、Badge 与交互浮层' description='Dialog、AlertDialog、Sheet 来自 Radix 原语。'><div className='flex flex-wrap items-center gap-2'>
 <Dialog open={dialogOpen} onOpenChange={setDialogOpen}><DialogTrigger asChild><Button>打开 Dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>确认弹窗示例</DialogTitle><DialogDescription>支持焦点管理、ESC、遮罩关闭和返回焦点。</DialogDescription></DialogHeader><DialogFooter><DialogClose asChild><Button variant='outline'>取消</Button></DialogClose><Button onClick={()=>setDialogOpen(false)}>确定</Button></DialogFooter></DialogContent></Dialog>
 <AlertDialog><AlertDialogTrigger asChild><Button variant='destructive'>危险操作确认</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>演示危险操作</AlertDialogTitle><AlertDialogDescription>此处不接入任何后端写操作，仅用于检验不可逆操作二次确认。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction>确认演示</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
 <Sheet><SheetTrigger asChild><Button variant='outline'>打开 Sheet</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>详情抽屉示例</SheetTitle><SheetDescription>侧边信息展示容器，后续用于技能卡详情等。</SheetDescription></SheetHeader></SheetContent></Sheet>
 <Tooltip><TooltipTrigger asChild><Button variant='ghost'>悬停提示</Button></TooltipTrigger><TooltipContent>键盘聚焦时也会显示</TooltipContent></Tooltip>
 <Button variant='secondary' disabled>禁用按钮</Button><StatusBadge tone='success'>成功</StatusBadge><StatusBadge tone='warning'>待处理</StatusBadge><StatusBadge tone='danger'>异常</StatusBadge></div></Panel>
 <Panel title='表单控件' description='输入、选择、切换与文本区共享主题 Token。'><div className='grid gap-4'><div className='grid gap-2'><Label htmlFor='demo-name'>示例名称</Label><Input id='demo-name' value={value} onChange={event=>setValue(event.target.value)} placeholder='输入内容检查焦点和样式'/></div><div className='grid gap-2'><Label htmlFor='demo-filter'>筛选类型</Label><Select value={selected} onValueChange={setSelected}><SelectTrigger id='demo-filter'><SelectValue placeholder='请选择类型'/></SelectTrigger><SelectContent><SelectItem value='all'>全部</SelectItem><SelectItem value='skill'>技能卡</SelectItem><SelectItem value='room'>技能房间</SelectItem></SelectContent></Select></div><div className='flex items-center gap-3'><Switch id='demo-notify' checked={notifications} onCheckedChange={setNotifications}/><Label htmlFor='demo-notify'>接收演示通知（不保存）</Label></div><Label htmlFor='demo-description'>补充说明</Label><Textarea id='demo-description' placeholder='测试长文本、错误与暗色边框'/><p className='text-xs text-[var(--qb-text-secondary)]'>输入：{value||'（空）'} · 筛选：{selected} · 通知：{notifications?'开':'关'}</p></div></Panel>
 <Panel title='Tabs 与骨架屏'><Tabs defaultValue='normal'><TabsList><TabsTrigger value='normal'>普通</TabsTrigger><TabsTrigger value='loading'>加载中</TabsTrigger></TabsList><TabsContent value='normal'><p className='py-4 text-sm text-[var(--qb-text-secondary)]'>键盘方向键可切换标签。</p></TabsContent><TabsContent value='loading'><div className='grid gap-3 py-4'><Skeleton className='h-5 w-3/5'/><Skeleton className='h-4 w-full'/><Skeleton className='h-4 w-4/5'/></div></TabsContent></Tabs></Panel>
 <Panel title='空状态'><EmptyState title='暂无列表记录' description='数据为空时说明清楚，不填充虚构业务数据。'/></Panel></div>
 <Panel title='TanStack Table + shadcn Table' description='仅组件实验室样本，点击编号列标题测试排序。'><DataTable<DemoRecord> columns={demoColumns} rows={demoRows} rowKey={r=>r.id}/></Panel></>
}
