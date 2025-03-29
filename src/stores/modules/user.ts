import { get } from '@/utils/request'
import { LocalStorage } from '@/utils/storage'
import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  userInfo: UserInfo | null
  permissions: string[]
}

export interface UserInfo {
  id: number
  username: string
  avatar: string
  email: string
  nickname: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: LocalStorage.get<string>('token') || null,
    userInfo: null,
    permissions: [],
  }),

  getters: {
    hasUserInfo: state => state.userInfo !== null,
    getToken: state => state.token,
    getNickname: state => state.userInfo?.nickname ?? '用户',
    getAvatar: state => state.userInfo?.avatar,
    getUserInfo: state => state.userInfo,
    getPermissions: state => state.permissions,
  },

  actions: {
    // 设置 token
    setToken(token: string) {
      this.token = token
      LocalStorage.set('token', token)
    },

    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    },

    // 设置权限
    setPermissions(permissions: string[]) {
      this.permissions = permissions
    },

    // 重置状态
    resetState() {
      this.token = null
      this.userInfo = null
      this.permissions = []
    },

    // 检查用户是否有某些权限
    hasPermissions(permissions: string[]): boolean {
      if (!permissions || permissions.length === 0) {
        return true
      }

      // 检查用户是否有所需的权限
      return permissions.some(permission => this.permissions.includes(permission))
    },

    // 登录
    async login(username: string, password: string): Promise<boolean> {
      try {
        // 这里应调用登录 API
        const response = await get<{ token: string }>('/api/login', { username, password })
        const token = response.token
        this.setToken(token)
        return true
      }
      catch {
        return false
      }
    },

    // 登出
    async logout() {
      try {
        // 这里应调用登出 API
        await get('/api/logout')
      }
      finally {
        this.resetState()
        LocalStorage.remove('token')
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        // 这里应调用获取用户信息 API
        const userInfo = await get<UserInfo>('/api/user/info')
        this.setUserInfo(userInfo)

        // 获取用户权限
        const permissions = await get<string[]>('/api/user/permissions')
        this.setPermissions(permissions)

        return { userInfo, permissions }
      }
      catch (error) {
        return Promise.reject(error)
      }
    },

    // 生成路由（如果需要基于权限动态生成路由）
    async generateRoutes() {
      // 根据权限生成可访问路由表
      // 这里的实现将取决于你的路由结构和权限管理方式
      return []
    },
  },
})
