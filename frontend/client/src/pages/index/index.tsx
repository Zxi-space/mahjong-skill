import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import { MjBadge } from '../../components/ui/badge'
import { MjButton } from '../../components/ui/button'
import { MjCard } from '../../components/ui/card'
import { MjPageContainer } from '../../components/layout/page-container'
import { MjPageHeading } from '../../components/layout/page-heading'
import { SkillPreview } from '../../components/skill-preview'
import './index.scss'

export default function HomePage() {
  return <MjPageContainer className='home' title='雀变' tab='home'>
    <View className='home__masthead'><Text className='home__brand'>雀变</Text><MjBadge tone='success'>设计系统预览</MjBadge></View>
    <MjPageHeading eyebrow='MAHJONG SKILL' title='给牌局加点新花样！' description='雀变是一款线下麻将技能卡电子工具。你负责打牌，技能牌负责制造惊喜。' />
    <SkillPreview />
    <View className='home__actions'>
      <MjButton block size='large' onClick={() => Taro.navigateTo({ url: '/pages/room/index' })}>进入房间演示</MjButton>
      <MjButton block tone='secondary' variant='outline' onClick={() => Taro.navigateTo({ url: '/subpackages/gallery/index' })}>查看组件示例</MjButton>
    </View>
    <MjCard tone='mint' className='home__info'><Text className='home__info-title'>玩法说明</Text><Text className='home__info-text'>目前展示 UI 组件与本地房间状态，不会创建真实线上房间，也不会执行真实技能。</Text></MjCard>
    <Text className='home__footnote'>微信小程序 / H5 · 支付宝及抖音适配预留</Text>
  </MjPageContainer>
}
