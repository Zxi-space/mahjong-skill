'use client'
import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
export const DropdownMenu=DropdownMenuPrimitive.Root
export const DropdownMenuTrigger=DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup=DropdownMenuPrimitive.Group
export const DropdownMenuSub=DropdownMenuPrimitive.Sub
export const DropdownMenuRadioGroup=DropdownMenuPrimitive.RadioGroup
export function DropdownMenuContent({className,sideOffset=6,...props}:React.ComponentProps<typeof DropdownMenuPrimitive.Content>){return <DropdownMenuPrimitive.Portal><DropdownMenuPrimitive.Content data-slot='dropdown-menu-content' sideOffset={sideOffset} className={cn('z-50 min-w-44 overflow-hidden rounded-xl border border-[var(--qb-border-default)] bg-[var(--qb-bg-elevated)] p-1 text-[var(--qb-text-primary)] shadow-[0_12px_32px_var(--qb-shadow-color)] outline-none',className)} {...props}/></DropdownMenuPrimitive.Portal>}
export function DropdownMenuItem({className,inset,...props}:React.ComponentProps<typeof DropdownMenuPrimitive.Item>&{inset?:boolean}){return <DropdownMenuPrimitive.Item data-slot='dropdown-menu-item' className={cn('relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none focus:bg-[var(--qb-bg-hover)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',inset&&'pl-8',className)} {...props}/>}
export function DropdownMenuRadioItem({className,children,...props}:React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>){return <DropdownMenuPrimitive.RadioItem className={cn('relative flex cursor-pointer select-none items-center gap-2 rounded-lg py-2 pl-8 pr-2 text-sm outline-none focus:bg-[var(--qb-bg-hover)]',className)} {...props}><span className='absolute left-2'><DropdownMenuPrimitive.ItemIndicator><Check size={15}/></DropdownMenuPrimitive.ItemIndicator></span>{children}</DropdownMenuPrimitive.RadioItem>}
export function DropdownMenuLabel({className,...props}:React.ComponentProps<typeof DropdownMenuPrimitive.Label>){return <DropdownMenuPrimitive.Label className={cn('px-2.5 py-1.5 text-xs font-semibold text-[var(--qb-text-muted)]',className)} {...props}/>}
export function DropdownMenuSeparator({className,...props}:React.ComponentProps<typeof DropdownMenuPrimitive.Separator>){return <DropdownMenuPrimitive.Separator className={cn('my-1 h-px bg-[var(--qb-border-subtle)]',className)} {...props}/>}
export function DropdownMenuSubTrigger({className,children,...props}:React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>){return <DropdownMenuPrimitive.SubTrigger className={cn('flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none focus:bg-[var(--qb-bg-hover)]',className)} {...props}>{children}<ChevronRight className='ml-auto size-4'/></DropdownMenuPrimitive.SubTrigger>}
export function DropdownMenuSubContent({className,...props}:React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>){return <DropdownMenuPrimitive.Portal><DropdownMenuPrimitive.SubContent className={cn('z-50 min-w-40 rounded-xl border border-[var(--qb-border-default)] bg-[var(--qb-bg-elevated)] p-1 shadow-lg',className)} {...props}/></DropdownMenuPrimitive.Portal>}
