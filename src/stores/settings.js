import { defineStore } from 'pinia'
import { Client as Client21 } from '@/composables/api/21'
import { useServerStore } from './server'
import { useAuthStore } from './auth'
import storage from '@/composables/storage'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    const defaults = {
      unities: [],
      services: [],
      currentUnity: null,
      enabledServices: [],
      speech: false,
      alertSound: null,
    }

    const saved = storage.get('settings')
    if (!saved) return defaults

    return {
      ...defaults,
      ...saved,
    }
  },

  actions: {
    save() {
      storage.set('settings', this.$state)
    },

    async fetchUnities() {
      const serverStore = useServerStore()
      const authStore = useAuthStore()
      const api = new Client21(serverStore.apiUrl, null, serverStore.apiRetries)
      const data = await api.unities(authStore.accessToken)
      this.unities = data
    },

    async fetchServices(unityId) {
      if (!unityId) {
        this.services = []
        return
      }
      const serverStore = useServerStore()
      const authStore = useAuthStore()
      const api = new Client21(serverStore.apiUrl, null, serverStore.apiRetries)
      const data = await api.services(authStore.accessToken, unityId)
      this.services = data
    },
  },
})
