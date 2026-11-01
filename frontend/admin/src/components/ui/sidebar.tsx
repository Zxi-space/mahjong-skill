'use client'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { PanelLeft } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from './button'
import { Sheet, SheetContent, SheetTitle } from './sheet'

type SidebarContextValue={mobileOpen:boolean;setMobileOpen:(value:boolean)=>void;collapsed:boolean;setCollapsed:(value:boolean)=>void}
const SidebarContext=React.createContext<SidebarContextValue|null>(null)
export function useSidebar(){const context=React.useContext(SidebarContext);if(!context)throw new Error('useSidebar must be used within SidebarProvider');return context}
export function SidebarProvider({children,defaultOpen=true,className,...props}:React.ComponentProps<'div'>&{defaultOpen?:boolean}){
 const [collapsed,setCollapsed]=React.useState(!defaultOpen)
 const [mobileOpen,setMobileOpen]=React.useState(false)
 return <SidebarContext.Provider value={{mobileOpen,setMobileOpen,collapsed,setCollapsed}}><div data-slot='sidebar-wrapper' className={cn('flex min-h-screen w-full',className)} {...props}>{children}</div></SidebarContext.Provider>
}
export function Sidebar({children,className,...props}:React.ComponentProps<'aside'>){
 const {mobileOpen,setMobileOpen,collapsed}=useSidebar()
 return <><aside data-slot='sidebar' data-collapsed={collapsed} className={cn('sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-[var(--qb-border-subtle)] bg-[var(--qb-bg-sidebar)] transition-[width] duration-200 lg:flex data-[collapsed=true]:w-[72px]',className)} {...props}>{children}</aside><div className='lg:hidden'><Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetContent side='left' className='w-[260px] p-0' aria-describedby={undefined}><SheetTitle className='sr-only'>雀变管理端导航</SheetTitle><div className='flex h-full flex-col'>{children}</div></SheetContent></Sheet></div></>}
export function SidebarHeader({className,...props}:React.ComponentProps<'div'>){return <div data-slot='sidebar-header' className={cn('shrink-0 p-3',className)} {...props}/>}
export function SidebarContent({className,...props}:React.ComponentProps<'div'>){return <div data-slot='sidebar-content' className={cn('min-h-0 flex-1 overflow-y-auto px-2',className)} {...props}/>}
export function SidebarFooter({className,...props}:React.ComponentProps<'div'>){return <div data-slot='sidebar-footer' className={cn('mt-auto border-t border-[var(--qb-border-subtle)] p-3',className)} {...props}/>}
export function SidebarGroup({className,...props}:React.ComponentProps<'div'>){return <div data-slot='sidebar-group' className={cn('flex flex-col gap-1 py-2',className)} {...props}/>}
export function SidebarGroupLabel({className,...props}:React.ComponentProps<'div'>){const {collapsed}=useSidebar();return <div data-slot='sidebar-group-label' className={cn('px-3 py-2 text-xs font-semibold text-[var(--qb-text-muted)]',collapsed&&'lg:sr-only',className)} {...props}/>}
export function SidebarGroupContent({className,...props}:React.ComponentProps<'div'>){return <div data-slot='sidebar-group-content' className={cn('flex flex-col gap-1',className)} {...props}/>}
export function SidebarMenu({className,...props}:React.ComponentProps<'ul'>){return <ul data-slot='sidebar-menu' className={cn('flex flex-col gap-1',className)} {...props}/>}
export function SidebarMenuItem({className,...props}:React.ComponentProps<'li'>){return <li data-slot='sidebar-menu-item' className={cn('list-none',className)} {...props}/>}
export function SidebarMenuButton({asChild=false,isActive=false,className,...props}:React.ComponentProps<'button'>&{asChild?:boolean;isActive?:boolean}){const Comp=asChild?Slot:'button';return <Comp data-slot='sidebar-menu-button' data-active={isActive} className={cn('flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-[var(--qb-text-secondary)] outline-none transition-colors hover:bg-[var(--qb-bg-hover)] focus-visible:ring-2 focus-visible:ring-[var(--qb-focus-ring)] data-[active=true]:bg-[var(--qb-bg-active)] data-[active=true]:font-bold data-[active=true]:text-[var(--qb-action-primary)] [&_svg]:size-[18px] [&_svg]:shrink-0',className)} {...props}/>}
export function SidebarInset({className,...props}:React.ComponentProps<'div'>){return <div data-slot='sidebar-inset' className={cn('min-w-0 flex-1',className)} {...props}/>}
export function SidebarTrigger({className,...props}:React.ComponentProps<typeof Button>){const {mobileOpen,setMobileOpen,collapsed,setCollapsed}=useSidebar();return <Button type='button' variant='ghost' size='icon' aria-label='切换导航侧栏' className={className} onClick={(event)=>{if(window.matchMedia('(max-width: 1023px)').matches)setMobileOpen(!mobileOpen);else setCollapsed(!collapsed);props.onClick?.(event)}} {...Object.fromEntries(Object.entries(props).filter(([key])=>key!=='onClick'))}><PanelLeft/></Button>}
