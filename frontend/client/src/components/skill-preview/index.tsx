import { MjSkillCard } from '../business/skill-card'
// 工程演示预览，非服务端真实技能数据。
export function SkillPreview() {
  return <MjSkillCard skill={{ id: 'demo-red-center', tile: '中', name: '红中奇遇', category: '趣味互动', rarity: '普通', summary: '展示技能卡视觉效果，实际效果由后端模板定义。' }} />
}
