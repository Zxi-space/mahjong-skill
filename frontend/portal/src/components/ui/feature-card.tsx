import type { ReactNode } from 'react'
export function FeatureCard({icon,title,description}:{icon:ReactNode;title:string;description:string}){return <article className='portal-feature-card'><span className='portal-feature-icon' aria-hidden='true'>{icon}</span><h3>{title}</h3><p>{description}</p></article>}
