/**
 * 路由路径常量
 */
export const ROUTE_PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGET_PASSWORD: '/forget-password',
  NOT_FOUND: '/404',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
} as Record<string, string>

/**
 * 路由参数常量
 */
export const ROUTE_PARAM = {
  REDIRECT: 'redirect',
} as Record<string, string>

/**
 * 获取登录页面路径
 * @param redirect 重定向地址
 * @returns 登录页面路径
 */
export function getLoginPath(redirect?: string): string {
  const path = ROUTE_PATH.LOGIN
  if (!redirect)
    return path

  const params = new URLSearchParams()
  params.append(ROUTE_PARAM.REDIRECT, encodeURIComponent(redirect))
  return `${path}?${params.toString()}`
}
