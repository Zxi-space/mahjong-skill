import { PageHeader } from '../components/ui/page-header'
import { Panel } from '../components/ui/panel'
import { EmptyState } from '../components/ui/empty-state'

export function NotReady({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} description="此模块尚未接入实际业务 API；当前仅交付布局和组件底座。" />
      <Panel>
        <EmptyState title="业务模块待建设" description="后续按系统实施计划接入认证、权限、真实接口与操作。" />
      </Panel>
    </>
  )
}
