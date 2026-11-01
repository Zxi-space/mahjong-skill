import { Inbox } from 'lucide-react'
import type {ReactNode} from 'react'
import { Empty,EmptyContent,EmptyDescription,EmptyHeader,EmptyMedia,EmptyTitle } from './empty'
export function EmptyState({title='暂无数据',description,action}:{title?:string;description?:string;action?:ReactNode}) {return <Empty role='status'><EmptyHeader><EmptyMedia variant='icon'><Inbox size={23}/></EmptyMedia><EmptyTitle>{title}</EmptyTitle>{description&&<EmptyDescription>{description}</EmptyDescription>}</EmptyHeader>{action&&<EmptyContent>{action}</EmptyContent>}</Empty>}
