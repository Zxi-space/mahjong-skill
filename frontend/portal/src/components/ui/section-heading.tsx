import type { ReactNode } from 'react'
export function SectionHeading({eyebrow,title,description,action}:{eyebrow?:string;title:string;description?:string;action?:ReactNode}){return <div className='portal-section-heading'><div>{eyebrow&&<p className='portal-eyebrow'>{eyebrow}</p>}<h2>{title}</h2>{description&&<p className='portal-section-subtitle'>{description}</p>}</div>{action}</div>}
