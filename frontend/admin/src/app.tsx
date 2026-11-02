import { lazy, Suspense, type ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AdminShell } from './components/layout/admin-shell'
import { Skeleton } from './components/ui/skeleton'

// Keep page modules out of the application shell. The component laboratory and
// TanStack Table should not load until their routes are visited.
const Dashboard = lazy(() => import('./features/dashboard').then(module => ({ default: module.Dashboard })))
const ComponentsDemo = lazy(() => import('./features/components-demo').then(module => ({ default: module.ComponentsDemo })))
const NotReady = lazy(() => import('./features/not-ready').then(module => ({ default: module.NotReady })))

const placeholderRoutes = [
  { path: '/skills', title: '卡牌管理' },
  { path: '/decks', title: '牌库管理' },
  { path: '/rooms', title: '房间管理' },
  { path: '/users', title: '用户管理' },
  { path: '/review', title: '内容审核' },
  { path: '/settings', title: '系统设置' },
]

function PageLoading() {
  return (
    <div aria-label="页面加载中" aria-busy="true" role="status" className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <span className="sr-only">页面加载中</span>
    </div>
  )
}

function LazyPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageLoading />}>{children}</Suspense>
}

export function App() {
  return (
    <AdminShell>
      <Routes>
        <Route path="/" element={<LazyPage><Dashboard /></LazyPage>} />
        <Route path="/components" element={<LazyPage><ComponentsDemo /></LazyPage>} />
        {placeholderRoutes.map(({ path, title }) => (
          <Route key={path} path={path} element={<LazyPage><NotReady title={title} /></LazyPage>} />
        ))}
      </Routes>
    </AdminShell>
  )
}
