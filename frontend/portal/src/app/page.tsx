import { ArrowRight, BookOpen, Handshake, Lightbulb, Layers3, PartyPopper, Smartphone, Users, Sparkles, ShieldCheck } from 'lucide-react'
import { SiteHeader } from '../components/layout/site-header'
import { SiteFooter } from '../components/layout/site-footer'
import { SectionHeading } from '../components/ui/section-heading'
import { FeatureCard } from '../components/ui/feature-card'
const features = [
  {icon:<Lightbulb size={24}/>,title:'简单上手',description:'现场打开电子技能卡，按照提示与牌友协商执行。'},
  {icon:<Layers3 size={24}/>,title:'玩法更丰富',description:'围绕技能卡增加互动，不替代真实麻将规则与判定。'},
  {icon:<Users size={24}/>,title:'好友在一起',description:'面向真实线下牌局，电子房间只同步技能相关信息。'},
  {icon:<Sparkles size={24}/>,title:'持续更新',description:'技能定义和卡组可按版本迭代，玩法边界保持清晰。'},
]
const steps=[{number:'01',title:'选择使用方式',detail:'经典卡盒或好友技能房间，按现场需要选择。'},{number:'02',title:'查看电子技能',detail:'抽取、持有或使用电子技能卡；私有卡信息仅本人可见。'},{number:'03',title:'线下协商执行',detail:'涉及实体麻将动作时，由桌边玩家人工确认。'}]
export default function HomePage(){return <div className='portal-page'><SiteHeader/><main>
  <section className='portal-hero portal-container' aria-labelledby='portal-hero-title'><div className='portal-hero-copy'><span className='portal-eyebrow'><Sparkles size={17}/> MAHJONG SKILL</span><h1 id='portal-hero-title'>让麻将<br/><em>更有趣。</em></h1><p className='portal-hero-lead'>用电子技能牌为传统麻将加点新花样。</p><p className='portal-hero-detail'>和朋友一起，在线下牌局中体验更多互动。雀变不会替你摸牌、出牌或自动判定胜负。</p><div className='portal-hero-actions'><a className='portal-button portal-button--primary portal-button--large' href={process.env.NEXT_PUBLIC_CLIENT_H5_URL || 'http://localhost:5174'}>预览用户端 <ArrowRight size={19}/></a><a className='portal-button portal-button--outline portal-button--large' href='#steps'><BookOpen size={18}/>了解玩法</a></div><span className='portal-hero-note'><ShieldCheck size={16}/> 电子技能牌工具 · 面向真实线下麻将</span></div>
  <div className='portal-hero-illustration' aria-label='麻将牌角色视觉占位，正式雀叽插画需另行接入'><span className='portal-hero-halo' aria-hidden='true'/><span className='portal-display-tile portal-display-tile--left' aria-hidden='true'>中</span><span className='portal-display-tile portal-display-tile--center' aria-hidden='true'>發</span><span className='portal-display-tile portal-display-tile--right' aria-hidden='true'>東</span><span className='portal-illustration-caption'>雀叽家族正式透明素材待接入</span></div></section>
  <section id='features' className='portal-section portal-section--soft'><div className='portal-container'><SectionHeading eyebrow='FEATURES' title='让每一次相聚，多一点新鲜感' description='规则在现实桌面上，趣味在电子技能卡里。'/><div className='portal-features-grid'>{features.map(f=><FeatureCard key={f.title} {...f}/>)}</div></div></section>
  <section id='steps' className='portal-section'><div className='portal-container'><SectionHeading eyebrow='HOW IT WORKS' title='三个步骤，轻松开始' description='真实流程将在技能系统接入后开放；目前仅展示产品的使用方式。'/><div className='portal-steps'>{steps.map(step=><article className='portal-step' key={step.number}><span className='portal-step-number'>{step.number}</span><h3>{step.title}</h3><p>{step.detail}</p></article>)}</div></div></section>
  <section id='scenes' className='portal-section portal-section--soft'><div className='portal-container portal-scene'><div><span className='portal-eyebrow'><Handshake size={17}/> OFFLINE, TOGETHER</span><h2>给真实相聚的快乐，<br/>添一点变化。</h2><p>适用于好友聚会、家庭娱乐或线下活动。雀变只是电子技能的辅助工具，不是线上麻将游戏。</p></div><div className='portal-scene-card'><PartyPopper size={32}/><strong>和有趣的人，打更有趣的麻将！</strong><span><Smartphone size={16}/> 微信小程序 / H5</span></div></div></section>
</main><SiteFooter/></div>}
