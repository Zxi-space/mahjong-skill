'use client'
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
export const Sheet=DialogPrimitive.Root
export const SheetTrigger=DialogPrimitive.Trigger
export const SheetClose=DialogPrimitive.Close
export function SheetContent({side='right',className,children,showCloseButton=true,...props}:React.ComponentProps<typeof DialogPrimitive.Content>&{side?:'left'|'right';showCloseButton?:boolean}){return <DialogPrimitive.Portal><DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-[var(--qb-overlay)]'/><DialogPrimitive.Content data-slot='sheet-content' className={cn('fixed inset-y-0 z-50 flex h-full w-[min(85vw,320px)] flex-col gap-4 bg-[var(--qb-bg-sidebar)] p-5 text-[var(--qb-text-primary)] shadow-[0_16px_44px_var(--qb-shadow-float)] outline-none',side==='right'?'right-0 border-l border-[var(--qb-border-default)]':'left-0 border-r border-[var(--qb-border-default)]',className)} {...props}>{children}{showCloseButton&&<DialogPrimitive.Close className='absolute right-4 top-4 rounded-md p-1 text-[var(--qb-text-secondary)] hover:bg-[var(--qb-bg-hover)]'><X size={18}/><span className='sr-only'>关闭</span></DialogPrimitive.Close>}</DialogPrimitive.Content></DialogPrimitive.Portal>}
export function SheetHeader({className,...props}:React.ComponentProps<'div'>){return <div className={cn('flex flex-col gap-2',className)} {...props}/>}
export function SheetTitle({className,...props}:React.ComponentProps<typeof DialogPrimitive.Title>){return <DialogPrimitive.Title className={cn('text-lg font-semibold',className)} {...props}/>}
export function SheetDescription({className,...props}:React.ComponentProps<typeof DialogPrimitive.Description>){return <DialogPrimitive.Description className={cn('text-sm text-[var(--qb-text-secondary)]',className)} {...props}/>}
export function SheetFooter({className,...props}:React.ComponentProps<'div'>){return <div className={cn('mt-auto flex flex-col gap-2',className)} {...props}/>}
