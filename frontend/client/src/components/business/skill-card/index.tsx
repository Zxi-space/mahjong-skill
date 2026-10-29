import { Text, View } from '@tarojs/components'
import { MjBadge } from '../../ui/badge'
import { MjCard } from '../../ui/card'
import './style.scss'
export interface SkillCardPreview {
  id: string
  name: string
  summary: string
  tile: string
  category: string
  rarity?: '普通' | '稀有' | '传说'
}
export function MjSkillCard({ skill }: {skill: SkillCardPreview}) {
  return <MjCard className='mj-skill-card' padded={false}>
    <View className='mj-skill-card__art'><Text className='mj-skill-card__tile'>{skill.tile}</Text><Text className='mj-skill-card__ornament'>✧</Text></View>
    <View className='mj-skill-card__content'><View className='mj-skill-card__tags'><MjBadge tone='primary'>{skill.category}</MjBadge><MjBadge tone={skill.rarity === '传说' ? 'warning' : 'neutral'}>{skill.rarity || '普通'}</MjBadge></View>
      <Text className='mj-skill-card__title'>{skill.name}</Text><Text className='mj-skill-card__summary'>{skill.summary}</Text>
    </View>
  </MjCard>
}
