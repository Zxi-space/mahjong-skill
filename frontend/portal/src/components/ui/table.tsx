import * as React from 'react'
import { cn } from '../../lib/utils'
export function Table({className,...props}:React.ComponentProps<'table'>){return <div data-slot='table-container' className='relative w-full overflow-x-auto'><table data-slot='table' className={cn('w-full caption-bottom text-left text-sm',className)} {...props}/></div>}
export function TableHeader({className,...props}:React.ComponentProps<'thead'>){return <thead data-slot='table-header' className={cn('[&_tr]:border-b [&_tr]:border-[var(--qb-border-subtle)]',className)} {...props}/>}
export function TableBody({className,...props}:React.ComponentProps<'tbody'>){return <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0',className)} {...props}/>}
export function TableFooter({className,...props}:React.ComponentProps<'tfoot'>){return <tfoot data-slot='table-footer' className={cn('border-t border-[var(--qb-border-subtle)] bg-[var(--qb-bg-surface-soft)] font-medium',className)} {...props}/>}
export function TableRow({className,...props}:React.ComponentProps<'tr'>){return <tr data-slot='table-row' className={cn('border-b border-[var(--qb-border-subtle)] transition-colors hover:bg-[var(--qb-bg-table-hover)] data-[state=selected]:bg-[var(--qb-bg-active)]',className)} {...props}/>}
export function TableHead({className,...props}:React.ComponentProps<'th'>){return <th data-slot='table-head' className={cn('h-11 whitespace-nowrap bg-[var(--qb-bg-table-header)] px-4 text-left align-middle text-xs font-semibold text-[var(--qb-text-secondary)]',className)} {...props}/>}
export function TableCell({className,...props}:React.ComponentProps<'td'>){return <td data-slot='table-cell' className={cn('p-4 align-middle text-sm',className)} {...props}/>}
export function TableCaption({className,...props}:React.ComponentProps<'caption'>){return <caption data-slot='table-caption' className={cn('mt-3 text-sm text-[var(--qb-text-muted)]',className)} {...props}/>}
