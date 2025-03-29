import type { AxiosRequestConfig } from 'axios'

/**
 * 扩展 AxiosRequestConfig 类型
 */
declare module 'axios' {
  interface AxiosRequestConfig {
    retryCount?: number
    retryDelay?: number
    currentRetryCount?: number
    skipTransform?: boolean
    showLoading?: boolean // 是否显示全屏加载动画
    loadingOptions?: any // 加载配置项
    errorMessageMode?: 'none' | 'message' | 'notification' // 错误提示方式
    enableCache?: boolean // 是否启用缓存
    cacheTime?: number // 缓存时间（毫秒）
  }
}

/**
 * 后端返回的数据格式
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 请求配置类型
 */
export interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  loadingOptions?: any
  errorMessageMode?: 'none' | 'message' | 'notification'
  enableCache?: boolean
  cacheTime?: number
}
