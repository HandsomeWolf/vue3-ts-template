/**
 * API 状态码
 */
export const API_CODE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
} as const

/**
 * API 错误消息
 */
export const API_MESSAGE = {
  [API_CODE.UNAUTHORIZED]: '登录已过期，请重新登录',
  [API_CODE.FORBIDDEN]: '您没有权限执行此操作',
  [API_CODE.SERVER_ERROR]: '服务器错误，请稍后再试',
  [API_CODE.BAD_REQUEST]: '请求参数错误',
  [API_CODE.NOT_FOUND]: '请求的资源不存在',
} as const

/**
 * 请求配置常量
 */
export const REQUEST_CONFIG = {
  DEFAULT_TIMEOUT: 15000,
  DEFAULT_RETRY_COUNT: 3,
  DEFAULT_RETRY_DELAY: 1000,
  DEFAULT_CACHE_TIME: 5 * 60 * 1000, // 5分钟
} as const
