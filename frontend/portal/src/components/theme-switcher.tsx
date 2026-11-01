'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun, Monitor, Palette } from 'lucide-react'
import { Button } from './ui/button'
import { DropdownMenu,DropdownMenuContent,DropdownMenuLabel,DropdownMenuRadioGroup,DropdownMenuRadioItem,DropdownMenuSeparator,DropdownMenuTrigger } from './ui/dropdown-menu'
export type ThemePreference='light'|'dark'|'system'
const storageKey='mahjong-skill-theme'
const options=[{value:'light' as const,label:'浅色',icon:Sun},{value:'dark' as const,label:'深色',icon:Moon},{value:'system' as const,label:'跟随系统',icon:Monitor}]
function resolve(preference:ThemePreference,systemDark:boolean){return preference==='system'?(systemDark?'dark':'light'):preference}
export function ThemeSwitcher(){
 const [preference,setPreference]=useState<ThemePreference>('light')
 const [systemDark,setSystemDark]=useState(false)
 const [ready,setReady]=useState(false)
 useEffect(()=>{
  let saved:string|null=null
  try{saved=localStorage.getItem(storageKey)}catch{/* storage may be restricted */}
  const initial=saved==='dark'||saved==='system'?saved:'light'
  setPreference(initial)
  if(!window.matchMedia){setReady(true);return}
  const query=window.matchMedia('(prefers-color-scheme: dark)')
  setSystemDark(query.matches);setReady(true)
  const handle=(event:MediaQueryListEvent)=>setSystemDark(event.matches)
  query.addEventListener('change',handle)
  return()=>query.removeEventListener('change',handle)
 },[])
 useEffect(()=>{if(ready)document.documentElement.setAttribute('data-qb-theme',resolve(preference,systemDark))},[ready,preference,systemDark])
 function choose(next:ThemePreference){setPreference(next);try{localStorage.setItem(storageKey,next)}catch{/* storage may be restricted */}document.documentElement.setAttribute('data-qb-theme',resolve(next,systemDark))}
 const CurrentIcon=options.find(o=>o.value===preference)?.icon||Palette
 return <DropdownMenu><DropdownMenuTrigger asChild><Button variant='outline' size='sm' aria-label={`切换显示主题，当前${options.find(o=>o.value===preference)?.label}`} className='gap-2'><CurrentIcon size={16}/><span className='hidden sm:inline'>{options.find(o=>o.value===preference)?.label}</span></Button></DropdownMenuTrigger><DropdownMenuContent align='end'><DropdownMenuLabel>显示主题</DropdownMenuLabel><DropdownMenuSeparator/><DropdownMenuRadioGroup value={preference} onValueChange={value=>choose(value as ThemePreference)}>{options.map(({value,label,icon:Icon})=><DropdownMenuRadioItem value={value} key={value}><Icon size={16}/>{label}</DropdownMenuRadioItem>)}</DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu>
}
