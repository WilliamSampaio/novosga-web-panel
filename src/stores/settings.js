import { defineStore } from 'pinia'
import { Client } from '@/composables/api'
import { useMainStore } from './main'
import { useAuthStore } from './auth'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    unities: [],
    services: [],
    availableThemes: [
      {
        id: 'novosga.default',
        name: 'Padrão',
        options: [
          { name: 'logo', i18n: 'settings.label.logo', type: 'url' },
          { name: 'footerText', i18n: 'settings.label.footer_text', type: 'text' },
        ],
      },
    ],
  }),

  actions: {
    async fetchUnities() {
      const main = useMainStore()
      const auth = useAuthStore()
      const api = new Client(main.config.server)
      const data = await api.unities(auth.accessToken)
      this.unities = data
    },

    async fetchServices(unityId) {
      if (!unityId) {
        this.services = []
        return
      }
      const main = useMainStore()
      const auth = useAuthStore()
      const api = new Client(main.config.server)
      const data = await api.services(auth.accessToken, unityId)
      this.services = data
    },
  },
})
