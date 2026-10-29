import Taro from '@tarojs/taro'
export const target = process.env.TARO_ENV
export function getPlatformName(): string {
  const names: Record<string, string> = { weapp: '微信小程序', h5: 'H5', alipay: '支付宝小程序', tt: '抖音小程序' }
  return names[String(target)] ?? '未知平台'
}
export function getStorage(key: string) { return Taro.getStorageSync(key) as unknown }
export function setStorage(key: string, data: unknown) { return Taro.setStorageSync(key, data) }
/** 登录与分享按平台分别扩展；禁止业务页面直接操作 wx/my/tt。 */
