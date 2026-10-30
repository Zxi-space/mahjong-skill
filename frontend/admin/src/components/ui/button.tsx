import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--qb-focus-ring)] disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: { default: 'bg-[var(--qb-action-primary)] text-[var(--qb-on-primary)] hover:bg-[var(--qb-action-hover)]', outline: 'border border-[var(--qb-border-default)] bg-[var(--qb-bg-surface)] text-[var(--qb-text-primary)] hover:bg-[var(--qb-bg-hover)]' },
    size: { default: 'h-10 px-4 py-2', sm: 'h-9 px-3', lg: 'h-12 px-6' },
  }, defaultVariants: { variant: 'default', size: 'default' },
})
export function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {asChild?: boolean}) {
  const Component = asChild ? Slot : 'button'
  return <Component data-slot='button' className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
