import { Text, View } from '@tarojs/components'
import { MjButton } from '../button'
import './style.scss'
export function MjErrorState({title='加载失败',description='请检查网络后重试',onRetry}:{title?:string;description?:string;onRetry?:()=>void}){return <View className='mj-error-state' role='alert'><Text className='mj-error-state__title'>{title}</Text><Text className='mj-error-state__description'>{description}</Text>{onRetry&&<MjButton tone='secondary' variant='outline' onClick={onRetry}>重试</MjButton>}</View>}
