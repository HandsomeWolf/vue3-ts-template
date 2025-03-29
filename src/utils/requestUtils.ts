import type { AxiosRequestConfig } from 'axios'
import { LOADING_CONFIG } from '@/config/request'

// 生成请求标识
export function generateRequestKey(config: AxiosRequestConfig): string {
  const { url, method, params, data } = config
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 格式化请求参数，移除空值
export function formatRequestData(config: AxiosRequestConfig) {
  if (config.skipTransform)
    return

  // 格式化 URL 参数，移除空值
  if (config.params) {
    const params = { ...config.params }
    for (const key in params) {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    }
    config.params = params
  }

  // 格式化请求体，移除空值
  if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
    const data = { ...config.data }
    for (const key in data) {
      if (data[key] === null || data[key] === undefined || data[key] === '') {
        delete data[key]
      }
    }
    config.data = data
  }
}

// 获取加载配置
export function getLoadingOptions(options?: any) {
  return {
    ...LOADING_CONFIG,
    ...options,
  }
}
