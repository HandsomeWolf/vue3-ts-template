import dayjs from 'dayjs'

/**
 * 相对时间格式化（例如：刚刚、几分钟前、几小时前、几天前）
 * @param date 日期
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date | string | number): string {
  if (!date)
    return ''
  const now = dayjs()
  const target = dayjs(date)
  const diff = now.diff(target, 'minute')

  if (diff < 1)
    return '刚刚'
  if (diff < 60)
    return `${diff}分钟前`

  const hourDiff = now.diff(target, 'hour')
  if (hourDiff < 24)
    return `${hourDiff}小时前`

  const dayDiff = now.diff(target, 'day')
  if (dayDiff < 30)
    return `${dayDiff}天前`

  const monthDiff = now.diff(target, 'month')
  if (monthDiff < 12)
    return `${monthDiff}个月前`

  return `${now.diff(target, 'year')}年前`
}

/**
 * 文件大小格式化
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${units[i]}`
}

/**
 * 将驼峰命名转换为短横线命名
 * @param str 驼峰命名字符串
 * @returns 短横线命名字符串
 */
export function formatCamelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 将短横线命名转换为驼峰命名
 * @param str 短横线命名字符串
 * @returns 驼峰命名字符串
 */
export function formatKebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * 格式化手机号码（隐藏中间四位）
 * @param phone 手机号码
 * @returns 格式化后的手机号码
 */
export function formatPhone(phone: string): string {
  if (!phone || phone.length !== 11)
    return phone
  return `${phone.substring(0, 3)}****${phone.substring(7)}`
}

/**
 * 格式化银行卡号（每4位添加一个空格）
 * @param cardNumber 银行卡号
 * @returns 格式化后的银行卡号
 */
export function formatBankCard(cardNumber: string): string {
  if (!cardNumber)
    return ''
  return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
}

/**
 * 格式化身份证号（隐藏中间出生日期部分）
 * @param idCard 身份证号
 * @returns 格式化后的身份证号
 */
export function formatIdCard(idCard: string): string {
  if (!idCard || idCard.length < 15)
    return idCard
  return `${idCard.substring(0, 6)}********${idCard.substring(14)}`
}

/**
 * 将输入内容格式化为安全的HTML内容（防XSS）
 * @param html 原始HTML内容
 * @returns 安全的HTML内容
 */
export function formatSafeHtml(html: string): string {
  if (!html)
    return ''
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * 将对象的keys从驼峰转为下划线格式
 * @param obj 对象
 * @returns 转换后的对象
 */
export function formatObjectKeysToSnake<T>(obj: Record<string, any>): T {
  if (!obj || typeof obj !== 'object')
    return obj as unknown as T

  if (Array.isArray(obj)) {
    return obj.map(item => formatObjectKeysToSnake(item)) as unknown as T
  }

  const result: Record<string, any> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      const value = obj[key]

      result[newKey] = value && typeof value === 'object'
        ? formatObjectKeysToSnake(value)
        : value
    }
  }

  return result as unknown as T
}

/**
 * 将对象的keys从下划线转为驼峰格式
 * @param obj 对象
 * @returns 转换后的对象
 */
export function formatObjectKeysToCamel<T>(obj: Record<string, any>): T {
  if (!obj || typeof obj !== 'object')
    return obj as unknown as T

  if (Array.isArray(obj)) {
    return obj.map(item => formatObjectKeysToCamel(item)) as unknown as T
  }

  const result: Record<string, any> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      const value = obj[key]

      result[newKey] = value && typeof value === 'object'
        ? formatObjectKeysToCamel(value)
        : value
    }
  }

  return result as unknown as T
}

/**
 * 获取数据类型
 * @param value 需要获取类型的值
 * @returns 类型字符串
 */
export function getType(value: unknown): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
/**
 * 生成指定范围内的随机数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机数
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
