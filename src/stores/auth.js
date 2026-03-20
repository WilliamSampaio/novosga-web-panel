import storage from '@/composables/storage'
import { defineStore } from 'pinia'
import { useServerStore } from './server'
import { Client as Client21 } from '@/composables/api/21'

export const useAuthStore = defineStore('auth', {
  state: () => {
    const defaults = {
      accessToken: null,
      refreshToken: null,
      expireDate: null,
    }

    const saved = storage.get('auth')
    return { ...defaults, ...saved }
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isExpired: (state) => {
      if (!state.expireDate) return true
      return new Date(state.expireDate) <= new Date()
    },
  },

  actions: {
    save() {
      storage.set('auth', this.$state)
    },

    updateToken(token = {}) {
      const { access_token = null, refresh_token = null, expires_in = null } = token || {}

      this.accessToken = access_token
      this.refreshToken = refresh_token

      if (expires_in) {
        const dt = new Date()
        dt.setSeconds(dt.getSeconds() + (expires_in - 300))
        this.expireDate = dt.toISOString()
      } else {
        this.expireDate = null
      }

      this.save()
    },

    async token() {
      const serverStore = useServerStore()

      if (!serverStore.apiUrl || !serverStore.apiClientId || !serverStore.apiUsername) {
        throw new Error('Configurações de API incompletas no servidor.')
      }

      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: serverStore.apiClientId,
        client_secret: serverStore.apiClientSecret,
        username: serverStore.apiUsername,
        password: serverStore.apiPassword,
      })

      const api = new Client21(serverStore.apiUrl, null, serverStore.apiRetries)
      const data = await api.request('/token', { method: 'POST', data: params })
      this.updateToken(data)
      return data
    },

    async refresh() {
      const serverStore = useServerStore()
      if (!this.refreshToken) throw new Error('Nenhum Refresh Token disponível.')

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: serverStore.apiClientId,
        client_secret: serverStore.apiClientSecret,
        refresh_token: this.refreshToken,
      })

      const api = new Client21(serverStore.apiUrl, null, serverStore.apiRetries)
      const data = await api.request('/token', { method: 'POST', data: params })
      this.updateToken(data)
      return data
    },

    logout() {
      this.updateToken(null)
      storage.remove('auth')
    },
  },
})
