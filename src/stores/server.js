import { defineStore } from 'pinia'
import storage from '@/composables/storage'

export const useServerStore = defineStore('server', {
  state: () => {
    const defaults = {
      apiVersion: import.meta.env.VITE_API_VERSION,
      apiUrl: import.meta.env.VITE_API_URL,
      apiUsername: import.meta.env.VITE_API_USERNAME,
      apiPassword: import.meta.env.VITE_API_PASSWORD,
      apiClientId: import.meta.env.VITE_API_CLIENT_ID,
      apiClientSecret: import.meta.env.VITE_API_CLIENT_SECRET,
      apiRetries: parseInt(import.meta.env.VITE_API_RETRIES) || 0,
    }

    const saved = storage.get('server')
    if (!saved) return defaults

    return {
      ...defaults,
      ...saved,
    }
  },

  getters: {},

  actions: {
    save() {
      storage.set('server', this.$state)
    },
  },
})
