import type { ReactNode } from 'react'
import { Badge } from './badge'
type Tone='neutral'|'success'|'warning'|'danger'|'info'
export function StatusBadge({tone='neutral',children}:{tone?:Tone;children:ReactNode}){return <Badge variant={{neutral:'secondary',success:'success',warning:'warning',danger:'destructive',info:'info'}[tone] as 'secondary'|'success'|'warning'|'destructive'|'info'}>{children}</Badge>}
