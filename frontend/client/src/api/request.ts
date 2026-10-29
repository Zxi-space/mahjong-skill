import Taro from '@tarojs/taro'

const BASE = process.env.TARO_APP_API_BASE_URL ?? 'http://127.0.0.1:8000'
export interface ApiEnvelope<T> { code: string; message: string; data: T }

/** 独立的 Taro HTTP 传输层；业务 API 未来在此之上使用 Orval custom mutator。 */
export async function request<T>(path: string, method: 'GET' | 'POST' = 'GET', data?: unknown): Promise<T> {
  const response = await Taro.request<ApiEnvelope<T>>({ url: `${BASE}${path}`, method, data, timeout: 10000 })
  if (response.statusCode < 200 || response.statusCode >= 300) throw new Error(`HTTP ${response.statusCode}`)
  if (response.data.code !== 'OK') throw new Error(response.data.message || response.data.code)
  return response.data.data
}
