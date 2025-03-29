import type { ApiResponse, RequestConfig } from '@/types/api'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource, InternalAxiosRequestConfig } from 'axios'
import { CACHE_CONFIG, defaultConfig } from '@/config/request'
import { API_CODE, API_MESSAGE } from '@/constants/api'
import { getLoginPath } from '@/constants/route'
import { useAppOutsideStore } from '@/stores/modules/app'
import { LocalStorage } from '@/utils/storage'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { formatRequestData, generateRequestKey, getLoadingOptions } from './requestUtils'

// 创建 axios 实例
const service: AxiosInstance = axios.create(defaultConfig)

// 存储请求标识和取消函数
const pendingRequests = new Map<string, CancelTokenSource>()
// 存储loading实例
let loadingInstance: ReturnType<typeof ElLoading.service> | null = null
// 计数器
let loadingCount = 0

// 缓存存储
const cacheMap = new Map<string, { data: any, timestamp: number }>()

/**
 * 显示全屏加载
 * @param config 请求配置
 */
function showLoading(config: AxiosRequestConfig): void {
  if (config.showLoading) {
    loadingCount++
    if (!loadingInstance) {
      loadingInstance = ElLoading.service(getLoadingOptions(config.loadingOptions))
    }
  }
}

/**
 * 隐藏全屏加载
 * @param config 请求配置
 */
function hideLoading(config: AxiosRequestConfig): void {
  if (config.showLoading && loadingInstance) {
    loadingCount--
    if (loadingCount <= 0) {
      loadingInstance.close()
      loadingInstance = null
      loadingCount = 0
    }
  }
}

/**
 * 设置请求头中的通用信息
 * @param config 请求配置
 */
function setCommonHeaders(config: InternalAxiosRequestConfig) {
  // 从本地存储获取 token 并设置到 header
  const token = LocalStorage.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // 设置客户端信息
  config.headers['X-Client-Info'] = navigator.userAgent
}

/**
 * 处理 API 错误
 * @param code 错误码
 * @param message 错误信息
 */
function handleApiError(code: number, message: string) {
  const errorActions: Record<number, () => void> = {
    [API_CODE.UNAUTHORIZED]: handleAuthError,
    [API_CODE.FORBIDDEN]: () => ElMessage.error(API_MESSAGE[API_CODE.FORBIDDEN]),
    [API_CODE.SERVER_ERROR]: () => ElMessage.error(API_MESSAGE[API_CODE.SERVER_ERROR]),
    [API_CODE.BAD_REQUEST]: () => ElMessage.error(message || API_MESSAGE[API_CODE.BAD_REQUEST]),
    [API_CODE.NOT_FOUND]: () => ElMessage.error(API_MESSAGE[API_CODE.NOT_FOUND]),
  }

  // 执行对应错误处理或默认处理
  const handler = errorActions[code]
  if (handler) {
    handler()
  }
  else {
    ElMessage.error(message || '请求失败')
  }
}

/**
 * 处理 401 未授权错误
 */
function handleAuthError() {
  // 清除用户信息并跳转到登录页
  LocalStorage.remove('token')
  ElMessage.error(API_MESSAGE[API_CODE.UNAUTHORIZED])

  // 获取当前页面路径作为重定向地址
  const currentPath = window.location.pathname + window.location.search
  const loginPath = getLoginPath(currentPath)

  // 使用定时器允许消息显示完毕
  setTimeout(() => {
    window.location.href = loginPath
  }, 1500)
}

/**
 * 请求重试逻辑
 * @param error 错误对象
 * @returns Promise | null
 */
function _retryRequest(error: any) {
  const config = error.config

  // 如果未设置重试或已达到最大重试次数，则直接返回 null
  if (!config || !config.retryCount || config.currentRetryCount >= config.retryCount) {
    return null
  }

  // 累加当前重试次数
  config.currentRetryCount = config.currentRetryCount || 0
  config.currentRetryCount++

  // 延时处理
  return new Promise((resolve) => {
    setTimeout(() => {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(`[API Retry] 第${config.currentRetryCount}次重试: ${config.url}`)
      }
      resolve(service(config))
    }, config.retryDelay || defaultConfig.retryDelay)
  })
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const appStore = useAppOutsideStore()
    appStore.setLoading(true)

    // 显示全屏加载
    showLoading(config)

    // 设置通用请求头
    setCommonHeaders(config)

    // 格式化请求数据
    formatRequestData(config)

    // 生成请求标识
    const requestKey = generateRequestKey(config)

    // 检查缓存
    if (config.enableCache) {
      const cached = cacheMap.get(requestKey)
      if (cached && Date.now() - cached.timestamp < (config.cacheTime || CACHE_CONFIG.defaultCacheTime)) {
        return Promise.resolve(cached.data)
      }
    }

    // 如果已存在相同请求，取消之前的请求
    if (pendingRequests.has(requestKey)) {
      const source = pendingRequests.get(requestKey)
      source?.cancel('重复请求被取消')
      pendingRequests.delete(requestKey)
    }

    // 为当前请求创建取消令牌
    const source = axios.CancelToken.source()
    config.cancelToken = source.token
    pendingRequests.set(requestKey, source)

    // 设置重试次数和重试延时，使用默认值或传入的值
    config.retryCount = config.retryCount ?? defaultConfig.retryCount
    config.retryDelay = config.retryDelay ?? defaultConfig.retryDelay

    // 开发环境记录请求信息
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const appStore = useAppOutsideStore()
    appStore.setLoading(false)

    // 隐藏全屏加载
    hideLoading(response.config)

    const res = response.data

    // 根据自定义错误码判断请求是否成功
    if (res.code !== API_CODE.SUCCESS) {
      // 处理错误情况
      handleApiError(res.code, res.message)

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    // 在响应后删除已完成的请求
    const requestKey = generateRequestKey(response.config)
    pendingRequests.delete(requestKey)

    // 处理缓存
    if (response.config.enableCache) {
      cacheMap.set(requestKey, {
        data: res.data,
        timestamp: Date.now(),
      })
    }

    // 开发环境记录响应信息
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, res.data)
    }

    return res.data
  },
  (error) => {
    const appStore = useAppOutsideStore()
    appStore.setLoading(false)

    // 隐藏全屏加载
    if (error.config) {
      hideLoading(error.config)
    }

    // 取消请求不触发错误提示
    if (axios.isCancel(error)) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[API Cancel]', error.message)
      }
      return Promise.reject(error)
    }

    // 尝试重试请求
    const retryResult = _retryRequest(error)
    if (retryResult) {
      return retryResult
    }

    // 处理请求错误
    if (error.config) {
      const requestKey = generateRequestKey(error.config)
      pendingRequests.delete(requestKey)
    }

    // 响应错误处理
    if (error.response) {
      handleApiError(error.response.status, error.response.data?.message || error.message)
    }
    else {
      // 网络错误
      ElMessage.error('网络连接异常，请检查网络设置')
      if (import.meta.env.DEV) {
        console.error('[API Network Error]', error)
      }
    }

    return Promise.reject(error)
  },
)

/**
 * 创建取消请求的令牌和取消函数
 * @returns CancelTokenSource
 */
export function createCancelToken() {
  return axios.CancelToken.source()
}

/**
 * 取消所有请求
 * @param message 取消消息
 */
export function cancelAllRequests(message = '操作已取消') {
  pendingRequests.forEach((source) => {
    source.cancel(message)
  })
  pendingRequests.clear()
}

/**
 * GET 请求
 * @param url 请求地址
 * @param params 请求参数
 * @param config 请求配置
 * @returns Promise
 */
export function get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
  return service.get<any, T>(url, { params, ...config })
}

/**
 * POST 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise
 */
export function post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return service.post<any, T>(url, data, config)
}

/**
 * PUT 请求
 * @param url 请求地址
 * @param data 请求数据
 * @param config 请求配置
 * @returns Promise
 */
export function put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
  return service.put<any, T>(url, data, config)
}

/**
 * DELETE 请求
 * @param url 请求地址
 * @param config 请求配置
 * @returns Promise
 */
export function del<T = any>(url: string, config?: RequestConfig): Promise<T> {
  return service.delete<any, T>(url, config)
}

/**
 * 上传文件
 * @param url 请求地址
 * @param file 文件对象
 * @param name 文件字段名
 * @param data 额外数据
 * @param config 请求配置
 * @returns Promise
 */
export function uploadFile<T = any>(url: string, file: File, name = 'file', data?: Record<string, any>, config?: RequestConfig): Promise<T> {
  const formData = new FormData()
  formData.append(name, file)

  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })
  }

  return service.post<any, T>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config,
  })
}

/**
 * 下载文件
 * @param url 请求地址
 * @param params 请求参数
 * @param config 请求配置
 * @returns Promise<Blob>
 */
export function downloadFile(url: string, params?: any, config?: RequestConfig): Promise<Blob> {
  return service.get(url, {
    params,
    responseType: 'blob',
    ...config,
  })
}

export default service
