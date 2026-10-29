import { useQuery } from '@tanstack/react-query'
import { request } from './request'
export interface HealthResponse { status: string; service: string }
export function useBackendHealth() {
  return useQuery({ queryKey: ['health'], queryFn: () => request<HealthResponse>('/api/v1/health') })
}
