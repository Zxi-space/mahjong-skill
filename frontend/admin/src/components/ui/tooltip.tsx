'use client'
import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../lib/utils'
export const TooltipProvider=TooltipPrimitive.Provider
export const Tooltip=TooltipPrimitive.Root
export const TooltipTrigger=TooltipPrimitive.Trigger
export function TooltipContent({className,sideOffset=6,...props}:React.ComponentProps<typeof TooltipPrimitive.Content>){return <TooltipPrimitive.Portal><TooltipPrimitive.Content data-slot='tooltip-content' sideOffset={sideOffset} className={cn('z-50 max-w-60 rounded-lg border border-[var(--qb-border-strong)] bg-[var(--qb-bg-elevated)] px-3 py-2 text-xs text-[var(--qb-text-primary)] shadow-lg',className)} {...props}/></TooltipPrimitive.Portal>}
