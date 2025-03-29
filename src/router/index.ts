import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/commandDispatch',
    component: () => import('@/views/CommandDispatch.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
