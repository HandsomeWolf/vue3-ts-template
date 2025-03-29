import type { AxiosRequestConfig } from 'axios'
import { REQUEST_CONFIG } from '@/constants/api'

// 默认配置
export const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: REQUEST_CONFIG.DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  retryCount: REQUEST_CONFIG.DEFAULT_RETRY_COUNT,
  retryDelay: REQUEST_CONFIG.DEFAULT_RETRY_DELAY,
  showLoading: false,
  errorMessageMode: 'message',
}

// 缓存配置
export const CACHE_CONFIG = {
  defaultCacheTime: REQUEST_CONFIG.DEFAULT_CACHE_TIME,
}

// 加载配置
export const LOADING_CONFIG = {
  lock: true,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.7)',
}
