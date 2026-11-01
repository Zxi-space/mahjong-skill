import * as React from 'react'
import { cn } from '../../lib/utils'
export function Card({className,...props}:React.ComponentProps<'div'>){return <div data-slot='card' className={cn('rounded-2xl border border-[var(--qb-border-subtle)] bg-[var(--qb-bg-surface)] text-[var(--qb-text-primary)] shadow-[0_8px_28px_var(--qb-shadow-color)]',className)} {...props}/>}
export function CardHeader({className,...props}:React.ComponentProps<'div'>){return <div data-slot='card-header' className={cn('flex flex-col gap-1.5 px-5 pt-5',className)} {...props}/>}
export function CardTitle({className,...props}:React.ComponentProps<'div'>){return <div data-slot='card-title' className={cn('text-base font-semibold leading-snug',className)} {...props}/>}
export function CardDescription({className,...props}:React.ComponentProps<'div'>){return <div data-slot='card-description' className={cn('text-sm leading-relaxed text-[var(--qb-text-secondary)]',className)} {...props}/>}
export function CardAction({className,...props}:React.ComponentProps<'div'>){return <div data-slot='card-action' className={cn('ml-auto self-start',className)} {...props}/>}
export function CardContent({className,...props}:React.ComponentProps<'div'>){return <div data-slot='card-content' className={cn('px-5 pb-5',className)} {...props}/>}
export function CardFooter({className,...props}:React.ComponentProps<'div'>){return <div data-slot='card-footer' className={cn('flex items-center gap-2 px-5 pb-5',className)} {...props}/>}
