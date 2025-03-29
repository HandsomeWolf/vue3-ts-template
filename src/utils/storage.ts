/**
 * 本地存储工具类
 * 提供了对 localStorage 和 sessionStorage 的封装
 * 支持类型安全和批量操作
 */

// 存储类型
export enum StorageType {
  LOCAL = 'localStorage',
  SESSION = 'sessionStorage',
}

/**
 * 通用存储类
 */
class Storage {
  private storageType: StorageType

  constructor(type: StorageType) {
    this.storageType = type
  }

  /**
   * 获取原始存储对象
   */
  private get storage(): globalThis.Storage {
    return this.storageType === StorageType.LOCAL
      ? window.localStorage
      : window.sessionStorage
  }

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值
   */
  set<T>(key: string, value: T): void {
    const storageValue = JSON.stringify(value)
    this.storage.setItem(key, storageValue)
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值
   * @returns 存储值或默认值
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    const item = this.storage.getItem(key)

    if (!item)
      return defaultValue

    try {
      return JSON.parse(item) as T
    }
    catch {
      // 如果解析失败，返回原始值或默认值
      return (item as unknown as T) || defaultValue
    }
  }

  /**
   * 移除存储项
   * @param key 键名
   */
  remove(key: string): void {
    this.storage.removeItem(key)
  }

  /**
   * 清空所有存储项
   */
  clear(): void {
    this.storage.clear()
  }

  /**
   * 获取所有键名
   * @returns 键名数组
   */
  keys(): string[] {
    return Object.keys(this.storage)
  }

  /**
   * 获取存储项数量
   * @returns 存储项数量
   */
  size(): number {
    return this.storage.length
  }

  /**
   * 检查是否存在某个键
   * @param key 键名
   * @returns 是否存在
   */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null
  }

  /**
   * 批量设置存储项
   * @param items 键值对对象
   */
  setMany(items: Record<string, any>): void {
    Object.entries(items).forEach(([key, value]) => {
      this.set(key, value)
    })
  }

  /**
   * 批量获取存储项
   * @param keys 键名数组
   * @returns 键值对对象
   */
  getMany(keys: string[]): Record<string, any> {
    return keys.reduce((result, key) => {
      result[key] = this.get(key)
      return result
    }, {} as Record<string, any>)
  }

  /**
   * 批量移除存储项
   * @param keys 键名数组
   */
  removeMany(keys: string[]): void {
    keys.forEach(key => this.remove(key))
  }
}

// 实例化本地存储和会话存储
export const LocalStorage = new Storage(StorageType.LOCAL)
export const SessionStorage = new Storage(StorageType.SESSION)

// 默认导出本地存储
export default LocalStorage
