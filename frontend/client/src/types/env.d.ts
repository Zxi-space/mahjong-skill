declare namespace NodeJS {
  interface ProcessEnv {
    TARO_APP_API_BASE_URL?: string
    TARO_ENV: 'weapp' | 'h5' | 'alipay' | 'tt'
  }
}
