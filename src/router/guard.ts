import type { RouteLocationNormalized, Router } from 'vue-router'
import { getLoginPath, ROUTE_PATH } from '@/constants/route'
import { useAppOutsideStore } from '@/stores/modules/app'
import { useUserStore } from '@/stores/modules/user'
import { LocalStorage } from '@/utils/storage'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置 NProgress
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
})

// 白名单路由 - 不需要登录也可以访问
const whiteList = [
  ROUTE_PATH.LOGIN,
  ROUTE_PATH.REGISTER,
  ROUTE_PATH.FORGET_PASSWORD,
  ROUTE_PATH.NOT_FOUND,
  ROUTE_PATH.FORBIDDEN,
  ROUTE_PATH.SERVER_ERROR,
]

/**
 * 权限检查
 * @param to 目标路由
 * @param userStore 用户仓库
 * @returns 是否有权限
 */
function checkPermission(to: RouteLocationNormalized, userStore: ReturnType<typeof useUserStore>): boolean {
  // 如果路由没有定义权限要求，则所有用户都可以访问
  if (!to.meta?.requiredPermissions) {
    return true
  }

  // 检查用户是否拥有所需权限
  const requiredPermissions = to.meta.requiredPermissions as string[]
  return userStore.hasPermissions(requiredPermissions)
}

/**
 * 处理路由跳转
 */
function handleRouteNavigation(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: any,
  token: string | null,
): Promise<void> {
  const userStore = useUserStore()

  // 判断是否有 token
  if (token) {
    if (to.path === ROUTE_PATH.LOGIN) {
      // 如果已登录，跳转到首页
      next({ path: ROUTE_PATH.HOME })
      NProgress.done()
      return Promise.resolve()
    }
    else {
      // 判断是否已获取用户信息
      if (userStore.hasUserInfo) {
        // 检查权限
        if (checkPermission(to, userStore)) {
          next()
          return Promise.resolve()
        }
        else {
          // 没有权限，跳转到 403 页面
          next({ path: ROUTE_PATH.FORBIDDEN })
          NProgress.done()
          return Promise.resolve()
        }
      }
      else {
        return userStore.getUserInfo()
          .then(() => {
            // 权限检查
            if (checkPermission(to, userStore)) {
              // 确保添加了路由
              next({ ...to, replace: true })
            }
            else {
              // 没有权限，跳转到 403 页面
              next({ path: ROUTE_PATH.FORBIDDEN })
              NProgress.done()
            }
          })
          .catch((err) => {
            // 获取用户信息失败，清除 token 并跳转登录页
            userStore.resetState()
            LocalStorage.remove('token')
            ElMessage.error('验证失败，请重新登录')
            next(getLoginPath(to.path))
            NProgress.done()
            console.error('获取用户信息失败:', err)
          })
      }
    }
  }
  else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 如果在白名单中，直接进入
      next()
    }
    else {
      // 否则重定向到登录页，并携带重定向参数
      next(getLoginPath(to.path))
      NProgress.done()
    }
    return Promise.resolve()
  }
}

// 类型声明：用于检查路由元数据中的自定义属性
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    requiredPermissions?: string[]
    loadData?: boolean
    scrollToTop?: boolean
  }
}

/**
 * 设置路由守卫
 * @param router 路由实例
 */
export function setupRouterGuard(router: Router) {
  // 全局前置守卫
  router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 设置页面标题
    const title = to.meta?.title
    if (title) {
      document.title = `${title} - ${import.meta.env.VITE_APP_TITLE || '应用'}`
    }

    // 开启全局 loading
    const appStore = useAppOutsideStore()
    appStore.setLoading(true)

    // 获取 token
    const token = LocalStorage.get<string>('token')

    // 处理路由导航
    handleRouteNavigation(to, from, next, token)
      .catch((err) => {
        console.error('路由导航错误:', err)
        next(ROUTE_PATH.SERVER_ERROR)
      })
  })

  // 全局解析守卫
  router.beforeResolve(async (to) => {
    // 如果路由需要数据预加载，可以在这里处理
    if (to.meta?.loadData) {
      // 注意：这段代码需要根据实际组件结构调整
      // 以下逻辑仅作为参考，实际使用时可能需要修改
      try {
        // 这里假设你的组件导出了一个静态方法或者使用了 Composition API 的 setup 函数
        // 在实际应用中，你可能需要基于你的组件结构和API设计来调整这个逻辑
        const lastMatched = to.matched[to.matched.length - 1]
        if (lastMatched && lastMatched.props.default) {
          // 对于基于 props 的预加载
          const props = typeof lastMatched.props.default === 'function'
            ? lastMatched.props.default(to)
            : lastMatched.props.default

          if (props && typeof props.onPreload === 'function') {
            await props.onPreload()
          }
        }
      }
      catch (err) {
        console.error('Failed to load page data:', err)
      }
    }
  })

  // 全局后置钩子
  router.afterEach((to) => {
    // 关闭全局 loading
    const appStore = useAppOutsideStore()
    appStore.setLoading(false)

    // 结束进度条
    NProgress.done()

    // 自动滚动到顶部
    if (to.meta?.scrollToTop !== false) {
      window.scrollTo(0, 0)
    }
  })

  // 错误处理
  router.onError((err) => {
    console.error('路由错误:', err)
    NProgress.done()
    const appStore = useAppOutsideStore()
    appStore.setLoading(false)
  })
}
