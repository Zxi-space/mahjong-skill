import type { ReactNode } from 'react'
export function PageHeader({ title, description, eyebrow, actions }: {title:string;description?:string;eyebrow?:string;actions?:ReactNode}) {
  return <div className='admin-page-header'><div>{eyebrow&&<p className='admin-eyebrow'>{eyebrow}</p>}<h1>{title}</h1>{description&&<p className='admin-page-description'>{description}</p>}</div>{actions&&<div className='admin-page-actions'>{actions}</div>}</div>
}
