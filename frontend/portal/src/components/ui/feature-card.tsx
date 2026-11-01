import type {ReactNode} from 'react'
import { Card,CardContent,CardHeader,CardTitle,CardDescription } from './card'
export function FeatureCard({icon,title,description}:{icon:ReactNode;title:string;description:string}){return <Card className='h-full shadow-none'><CardHeader className='gap-3'><span aria-hidden='true' className='grid size-12 place-items-center rounded-xl bg-[var(--qb-bg-active)] text-[var(--qb-action-primary)]'>{icon}</span><CardTitle className='text-lg'>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent/></Card>}
