import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import './app.scss'

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 20_000 } } })

export default function App({ children }: PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
