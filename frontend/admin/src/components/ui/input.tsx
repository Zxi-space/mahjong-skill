import { forwardRef } from 'react'
import type { ComponentProps } from 'react'
export const Input = forwardRef<HTMLInputElement, ComponentProps<'input'>>(function Input({className='',...props},ref){return <input ref={ref} className={`admin-input ${className}`.trim()} {...props}/>})
