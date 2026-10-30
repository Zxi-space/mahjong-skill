import { Switch, Text, View } from '@tarojs/components'
import './style.scss'
export function MjSwitch({checked,onChange,label,disabled=false}:{checked:boolean;onChange:(value:boolean)=>void;label:string;disabled?:boolean}) {
  return <View className='mj-switch-field'><Text className='mj-switch-field__label'>{label}</Text><Switch checked={checked} disabled={disabled} color='var(--qb-action-primary)' onChange={event=>onChange(event.detail.value)} aria-label={label}/></View>
}
