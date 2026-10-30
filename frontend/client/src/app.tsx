import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, type PropsWithChildren } from 'react'
import { subscribeSystemTheme, synchronizePlatformTheme, useThemeStore } from './theme/theme'
import './app.scss'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 20_000 } } })

export default function App({ children }: PropsWithChildren) {
  const resolved = useThemeStore((state) => state.resolved)
  useEffect(() => subscribeSystemTheme(), [])
  useEffect(() => synchronizePlatformTheme(resolved), [resolved])
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
