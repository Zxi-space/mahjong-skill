import { useState } from 'react'
import { Text, View } from '@tarojs/components'
import { MjAvatar } from '../../components/ui/avatar'
import { MjBadge } from '../../components/ui/badge'
import { MjButton } from '../../components/ui/button'
import { MjCard } from '../../components/ui/card'
import { MjDialog } from '../../components/ui/dialog'
import { MjEmpty } from '../../components/ui/empty'
import { MjInput } from '../../components/ui/input'
import { MjLoading } from '../../components/ui/loading'
import { MjSheet } from '../../components/ui/sheet'
import { MjTabs } from '../../components/ui/tabs'
import { MjToast } from '../../components/ui/toast'
import { MjSwitch } from '../../components/ui/switch'
import { MjSkeleton } from '../../components/ui/skeleton'
import { MjErrorState } from '../../components/ui/error-state'
import { getPlatformName } from '../../platform'
import { MjPageContainer } from '../../components/layout/page-container'
import { MjPageHeading } from '../../components/layout/page-heading'
import { MjSkillCard } from '../../components/business/skill-card'
import './index.scss'

export default function GalleryPage() {
  const [name, setName] = useState('')
  const [tab, setTab] = useState('normal')
  const [dialog, setDialog] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [toast, setToast] = useState(false)
  const [switched, setSwitched] = useState(false)
  return <MjPageContainer className='gallery' title='组件实验室' tab='components'>
    <MjPageHeading eyebrow='MJ UI / COMPONENT LAB' title='雀变组件示例' description='在微信小程序与 H5 中校验外观、状态与交互。仅包含演示数据。' />
    <MjCard>
      <Text className='gallery__title'>跨端运行检查</Text>
      <Text className='gallery__caption'>当前平台：{getPlatformName()}。请分别在 H5 浏览器及微信开发者工具中检查以下交互。</Text>
      <Text className='gallery__caption'>按钮点击 → Toast；输入昵称 → 文本变化；Tab → 切换；Dialog / Sheet → 打开和关闭；页面返回 → 路由正常。</Text>
      <Text className='gallery__caption'>本页只是手动冒烟测试入口，不代表已通过微信真机验收。</Text>
    </MjCard>
    <MjCard><Text className='gallery__title'>按钮 Button</Text><View className='gallery__actions'><MjButton onClick={() => setToast(true)}>主按钮</MjButton><MjButton tone='secondary' variant='outline' onClick={() => setDialog(true)}>次按钮</MjButton><MjButton tone='danger' variant='ghost' onClick={() => setSheet(true)}>危险文本</MjButton><MjButton loading>处理中</MjButton><MjButton disabled>禁用按钮</MjButton></View></MjCard>
    <MjCard><Text className='gallery__title'>输入 Input / 标签 Badge</Text><MjInput label='你的昵称' value={name} onChange={setName} placeholder='例如：雀叽' maxLength={20}/><View className='gallery__row'><MjBadge tone='primary'>技能</MjBadge><MjBadge tone='success'>成功</MjBadge><MjBadge tone='warning'>注意</MjBadge><MjBadge tone='danger'>失败</MjBadge></View></MjCard>
    <MjCard><Text className='gallery__title'>切换 Tabs</Text><MjTabs options={[{label:'普通',value:'normal'},{label:'稀有',value:'rare'},{label:'传说',value:'legend'}]} value={tab} onChange={setTab}/><Text className='gallery__caption'>当前分类：{tab === 'normal' ? '普通' : tab === 'rare' ? '稀有' : '传说'}</Text></MjCard>
    <MjSkillCard skill={{id:'preview-01', name:'红中奇遇', tile:'中', category:'效果模板示例', rarity:'稀有', summary:'此卡牌为 UI 演示内容，没有真实执行规则。'}}/>
    <MjCard><Text className='gallery__title'>头像 Avatar</Text><View className='gallery__row'><MjAvatar name='东' size='small'/><MjAvatar name='南'/><MjAvatar name='西' size='large'/></View></MjCard>
    <MjCard><Text className='gallery__title'>空状态 Empty / 加载 Loading</Text><MjEmpty title='暂无技能' description='创建新的技能后会显示在这里'/><MjLoading label='正在加载演示内容' /></MjCard>
    <MjCard><Text className='gallery__title'>开关 / 骨架 / 异常状态</Text><MjSwitch label='显示实验性样式' checked={switched} onChange={setSwitched}/><MjSkeleton height={22}/><MjErrorState description='本地测试场景，可点击重试检查交互' onRetry={() => setToast(true)}/></MjCard>
    <MjDialog open={dialog} title='弹窗示例' description='这是独立封装的确认弹窗组件。' onClose={() => setDialog(false)} onConfirm={() => { setDialog(false); setToast(true) }} />
    <MjSheet open={sheet} title='底部弹层示例' onClose={() => setSheet(false)}><Text>这里可以放置卡牌操作、筛选条件或辅助说明。</Text></MjSheet>
    <MjToast open={toast} message='操作示例已触发' tone='success' onClose={() => setToast(false)} />
  </MjPageContainer>
}
