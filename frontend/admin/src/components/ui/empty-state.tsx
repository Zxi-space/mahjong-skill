import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'
export function EmptyState({ title='暂无数据', description, action }: {title?:string;description?:string;action?:ReactNode}) { return <div className='admin-empty' role='status'><span className='admin-empty-icon'><Inbox size={25}/></span><strong>{title}</strong>{description&&<p>{description}</p>}{action}</div> }
