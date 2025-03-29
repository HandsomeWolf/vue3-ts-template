import { store } from '@/stores/index'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: true,
  }),
  getters: {
    getLoading(): boolean {
      return this.loading
    },
  },
  actions: {
    setLoading(onOff: boolean) {
      this.loading = onOff ?? true
    },
  },
})

export function useAppOutsideStore() {
  return useAppStore(store)
}
