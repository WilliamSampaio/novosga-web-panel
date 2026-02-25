import storage from '@/composables/storage'
import moment from 'moment'
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
    if (!saved) return defaults

    return {
      ...defaults,
      ...saved,
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isExpired: (state) => {
      if (!state.expireDate) return true
      return moment(state.expireDate).isSameOrBefore(moment())
    },
  },

  actions: {
    save() {
      storage.set('auth', this.$state)
    },

    updateToken(token) {
      if (!token) {
        token = { access_token: null, refresh_token: null, expires_in: null }
      }

      this.accessToken = token.access_token
      this.refreshToken = token.refresh_token

      if (token.expires_in) {
        // Expira 5 minutos antes para segurança
        const dt = moment().add(token.expires_in - 300, 's')
        this.expireDate = dt.format()
      } else {
        this.expireDate = null
      }

      this.save()
    },

    async token() {
      const serverStore = useServerStore()

      if (!serverStore.apiUrl || !serverStore.apiClientId || !serverStore.apiUsername)
        throw new Error('Configurações incompletas')

      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: serverStore.apiClientId,
        client_secret: serverStore.apiClientSecret,
        username: serverStore.apiUsername,
        password: serverStore.apiPassword,
      })

      const api = new Client21(serverStore.apiUrl)
      const data = await api.request('/token', { method: 'POST', data: params })
      this.updateToken(data)
      return data
    },

    async refresh() {
      const serverStore = useServerStore()

      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: serverStore.apiClientId,
        client_secret: serverStore.apiClientSecret,
        refresh_token: this.refreshToken,
      })

      const api = new Client21(serverStore.apiUrl)
      const data = await api.request('/token', { method: 'POST', data: params })
      this.updateToken(data)
      return data
    },
  },
})
