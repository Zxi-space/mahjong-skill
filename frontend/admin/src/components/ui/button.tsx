import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: { default: 'bg-emerald-700 text-white hover:bg-emerald-800', outline: 'border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50' },
    size: { default: 'h-10 px-4 py-2', sm: 'h-9 px-3', lg: 'h-12 px-6' },
  }, defaultVariants: { variant: 'default', size: 'default' },
})
export function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & {asChild?: boolean}) {
  const Component = asChild ? Slot : 'button'
  return <Component data-slot='button' className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
