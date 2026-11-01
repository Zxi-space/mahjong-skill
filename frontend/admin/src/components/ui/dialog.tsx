'use client'
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
export const Dialog=DialogPrimitive.Root
export const DialogTrigger=DialogPrimitive.Trigger
export const DialogClose=DialogPrimitive.Close
export const DialogPortal=DialogPrimitive.Portal
export function DialogOverlay({className,...props}:React.ComponentProps<typeof DialogPrimitive.Overlay>){return <DialogPrimitive.Overlay data-slot='dialog-overlay' className={cn('fixed inset-0 z-50 bg-[var(--qb-overlay)]',className)} {...props}/>}
export function DialogContent({className,children,showCloseButton=true,...props}:React.ComponentProps<typeof DialogPrimitive.Content>&{showCloseButton?:boolean}){return <DialogPortal><DialogOverlay/><DialogPrimitive.Content data-slot='dialog-content' className={cn('fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl border border-[var(--qb-border-subtle)] bg-[var(--qb-bg-elevated)] p-6 text-[var(--qb-text-primary)] shadow-[0_16px_44px_var(--qb-shadow-float)] outline-none',className)} {...props}>{children}{showCloseButton&&<DialogPrimitive.Close className='absolute right-4 top-4 rounded-md p-1 text-[var(--qb-text-secondary)] hover:bg-[var(--qb-bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--qb-focus-ring)]'><X size={18}/><span className='sr-only'>关闭</span></DialogPrimitive.Close>}</DialogPrimitive.Content></DialogPortal>}
export function DialogHeader({className,...props}:React.ComponentProps<'div'>){return <div data-slot='dialog-header' className={cn('flex flex-col gap-2 text-left',className)} {...props}/>}
export function DialogFooter({className,...props}:React.ComponentProps<'div'>){return <div data-slot='dialog-footer' className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',className)} {...props}/>}
export function DialogTitle({className,...props}:React.ComponentProps<typeof DialogPrimitive.Title>){return <DialogPrimitive.Title data-slot='dialog-title' className={cn('text-lg font-semibold',className)} {...props}/>}
export function DialogDescription({className,...props}:React.ComponentProps<typeof DialogPrimitive.Description>){return <DialogPrimitive.Description data-slot='dialog-description' className={cn('text-sm leading-relaxed text-[var(--qb-text-secondary)]',className)} {...props}/>}
