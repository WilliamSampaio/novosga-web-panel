import { defineStore } from 'pinia'
import { Client as Client21 } from '@/composables/api/21'
import { useServerStore } from './server'
import { useAuthStore } from './auth'
import storage from '@/composables/storage'
import { useMessagesStore } from './messages'
import { useI18n } from 'vue-i18n'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    const defaults = {
      unities: [],
      services: [],
      currentUnity: null,
      enabledServices: [],
      speech: false,
      alertSound: null,
      locale: null,
      darkTheme: false,
    }

    const saved = storage.get('settings')
    if (!saved) return defaults

    return {
      ...defaults,
      ...saved,
    }
  },

  getters: {
    getLocales: () => {
      const { messages, availableLocales } = useI18n()
      return availableLocales.map((lang) => ({
        title: messages.value[lang].language_name || lang,
        value: lang,
      }))
    },
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

      const messages = useMessagesStore()

      if (!Array.isArray(data) || data.length === 0) {
        this.services = []
        messages.add({ text: 'Nenhum serviço enocontrado!', color: 'error' })
        return
      }

      this.services = data
    },

    toggleDarkTheme() {
      this.darkTheme = !this.darkTheme
      this.save()
    },
  },
})
