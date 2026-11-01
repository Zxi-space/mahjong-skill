'use client'
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'
export const Tabs=TabsPrimitive.Root
export function TabsList({className,...props}:React.ComponentProps<typeof TabsPrimitive.List>){return <TabsPrimitive.List data-slot='tabs-list' className={cn('inline-flex h-10 items-center rounded-xl bg-[var(--qb-bg-surface-soft)] p-1 text-[var(--qb-text-secondary)]',className)} {...props}/>}
export function TabsTrigger({className,...props}:React.ComponentProps<typeof TabsPrimitive.Trigger>){return <TabsPrimitive.Trigger data-slot='tabs-trigger' className={cn('inline-flex h-8 items-center justify-center rounded-lg px-3 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[var(--qb-focus-ring)] data-[state=active]:bg-[var(--qb-bg-surface)] data-[state=active]:text-[var(--qb-action-primary)] data-[state=active]:shadow-sm disabled:opacity-50',className)} {...props}/>}
export function TabsContent({className,...props}:React.ComponentProps<typeof TabsPrimitive.Content>){return <TabsPrimitive.Content data-slot='tabs-content' className={cn('mt-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--qb-focus-ring)]',className)} {...props}/>}
