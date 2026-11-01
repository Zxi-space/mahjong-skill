import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { cn } from '../../lib/utils'
export function Panel({title,description,actions,children,className}:{title?:string;description?:string;actions?:ReactNode;children:ReactNode;className?:string}){
 return <Card className={cn('min-w-0',className)}>{(title||description||actions)&&<CardHeader className='flex flex-row items-start justify-between gap-3 pb-4'><div className='space-y-1'>{title&&<CardTitle>{title}</CardTitle>}{description&&<CardDescription>{description}</CardDescription>}</div>{actions}</CardHeader>}<CardContent className={title||description||actions?'':'pt-5'}>{children}</CardContent></Card>
}
