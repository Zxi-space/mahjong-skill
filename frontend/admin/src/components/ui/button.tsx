import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const buttonVariants = cva('inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qb-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--qb-bg-canvas)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', {
 variants: {
  variant: {
   default: 'bg-[var(--qb-action-primary)] text-[var(--qb-on-primary)] hover:bg-[var(--qb-action-hover)] active:bg-[var(--qb-action-pressed)]',
   secondary: 'bg-[var(--qb-bg-active)] text-[var(--qb-text-primary)] hover:bg-[var(--qb-bg-hover)]',
   outline: 'border border-[var(--qb-border-default)] bg-[var(--qb-bg-surface)] text-[var(--qb-text-primary)] hover:bg-[var(--qb-bg-hover)]',
   ghost: 'text-[var(--qb-text-secondary)] hover:bg-[var(--qb-bg-hover)] hover:text-[var(--qb-text-primary)]',
   link: 'text-[var(--qb-action-primary)] underline-offset-4 hover:underline',
   destructive: 'bg-[var(--qb-error)] text-white hover:opacity-90',
  },
  size: { xs: 'h-7 px-2 text-xs', sm: 'h-8 px-3', default: 'h-10 px-4', lg: 'h-11 px-5', xl: 'h-[52px] px-6 text-base', icon: 'size-10', 'icon-sm': 'size-8' },
 }, defaultVariants: {variant:'default',size:'default'},
})
export function Button({className, variant, size, asChild=false,...props}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {asChild?:boolean}) {
 const Comp=asChild?Slot:'button'
 return <Comp data-slot='button' className={cn(buttonVariants({variant,size,className}))} {...props}/>
}
