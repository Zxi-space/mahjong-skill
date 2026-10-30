import { View } from '@tarojs/components'
import './style.scss'
export function MjSkeleton({width='100%',height=30}:{width?:string;height?:number}) {return <View className='mj-skeleton' style={{width,height:`${height}px`}} aria-hidden='true'/>}
