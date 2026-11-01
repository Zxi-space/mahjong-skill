import * as React from 'react'
import { cn } from '../../lib/utils'
export function Empty({className,...props}:React.ComponentProps<'div'>){return <div data-slot='empty' className={cn('flex min-h-40 flex-col items-center justify-center gap-4 px-5 py-8 text-center',className)} {...props}/>}
export function EmptyHeader({className,...props}:React.ComponentProps<'div'>){return <div data-slot='empty-header' className={cn('flex flex-col items-center gap-2',className)} {...props}/>}
export function EmptyMedia({className,variant='default',...props}:React.ComponentProps<'div'>&{variant?:'default'|'icon'}){return <div data-slot='empty-media' className={cn(variant==='icon'?'mb-1 grid size-12 place-items-center rounded-xl bg-[var(--qb-bg-active)] text-[var(--qb-action-primary)]':'',className)} {...props}/>}
export function EmptyTitle({className,...props}:React.ComponentProps<'div'>){return <div data-slot='empty-title' className={cn('text-sm font-semibold text-[var(--qb-text-primary)]',className)} {...props}/>}
export function EmptyDescription({className,...props}:React.ComponentProps<'p'>){return <p data-slot='empty-description' className={cn('max-w-96 text-sm leading-relaxed text-[var(--qb-text-secondary)]',className)} {...props}/>}
export function EmptyContent({className,...props}:React.ComponentProps<'div'>){return <div data-slot='empty-content' className={cn('flex items-center justify-center gap-2',className)} {...props}/>}
