/**
 * 工具函数统一出口
 */

// 导出所有格式化工具函数
export * from './format'

// 导出请求相关函数
export { del, get, post, put } from './request'

// 导出存储相关工具函数
export * from './storage'

// 导出验证相关工具函数
export * from './validator'

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间，默认300ms
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return function (this: any, ...args: Parameters<T>): void {
    if (timer)
      clearTimeout(timer)

    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param delay 延迟时间，默认300ms
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay = 300): (...args: Parameters<T>) => void {
  let lastTime = 0

  return function (this: any, ...args: Parameters<T>): void {
    const now = Date.now()

    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 深拷贝函数
 * @param obj 需要深拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj) as unknown as T
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  const cloned: Record<string, any> = {}
  Object.keys(obj as Record<string, any>).forEach((key) => {
    cloned[key] = deepClone((obj as Record<string, any>)[key])
  })

  return cloned as T
}
