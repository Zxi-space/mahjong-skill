import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import { useRoomStore } from '../../stores/room'
import { MjAvatar } from '../../components/ui/avatar'
import { MjBadge } from '../../components/ui/badge'
import { MjButton } from '../../components/ui/button'
import { MjCard } from '../../components/ui/card'
import { MjDialog } from '../../components/ui/dialog'
import { MjEmpty } from '../../components/ui/empty'
import { MjToast } from '../../components/ui/toast'
import { MjPageContainer } from '../../components/layout/page-container'
import { MjPageHeading } from '../../components/layout/page-heading'
import './index.scss'

export default function RoomPage() {
  const room = useRoomStore(s => s.demoRoom)
  const toggle = useRoomStore(s => s.toggleDemoRoom)
  const [confirmExit, setConfirmExit] = useState(false)
  const [notice, setNotice] = useState(false)
  return <MjPageContainer className='room'>
    <MjPageHeading eyebrow='ROOM DEMO' title='房间互动演示' description='仅演示本地状态及 UI：尚未接入真实的房间、用户身份或实时通信。' />
    <MjCard><View className='room__status'><Text className='room__subtitle'>当前状态</Text><MjBadge tone={room ? 'success' : 'neutral'}>{room ? '演示中' : '未加入'}</MjBadge></View>
      {room ? <View className='room__player'><MjAvatar name='雀叽' size='large'/><View className='room__player-text'><Text className='room__player-title'>雀叽的演示房间</Text><Text className='room__player-hint'>单设备 Zustand 状态，无联网同步</Text></View></View> : <MjEmpty title='还没有加入房间' description='点击下方按钮进入本地演示状态' />}
    </MjCard>
    {room ? <View className='room__actions'><MjButton block onClick={() => setNotice(true)}>体验提示反馈</MjButton><MjButton block tone='danger' variant='outline' onClick={() => setConfirmExit(true)}>退出演示房间</MjButton></View> : <MjButton block size='large' onClick={toggle}>进入演示房间</MjButton>}
    <MjDialog open={confirmExit} title='离开房间？' description='将退出本地演示房间，此操作不会改变任何线上数据。' destructive confirmText='确认离开' onClose={() => setConfirmExit(false)} onConfirm={() => { toggle(); setConfirmExit(false) }}/>
    <MjToast open={notice} message='这是一条本地示例提示' tone='success' onClose={() => setNotice(false)}/>
  </MjPageContainer>
}
