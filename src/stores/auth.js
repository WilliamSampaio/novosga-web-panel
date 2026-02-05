import { defineStore } from 'pinia'
import { Client } from '@/composables/api'
import storage from '@/composables/storage'
import moment from 'moment'
import { useMainStore } from './main'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: storage.get('access_token'),
    refreshToken: storage.get('refresh_token'),
    expireDate: storage.get('expire_date')
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isExpired: (state) => {
      if (!state.expireDate) return true
      return moment(state.expireDate).isSameOrBefore(moment())
    }
  },

  actions: {
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

      storage.set('access_token', this.accessToken)
      storage.set('refresh_token', this.refreshToken)
      storage.set('expire_date', this.expireDate)
    },

    async token() {
      const mainStore = useMainStore()
      const { server, clientId, clientSecret, username, password } = mainStore.config

      if (!server || !clientId || !username) throw new Error('Configurações incompletas')

      const params = new URLSearchParams({
        grant_type: 'password',
        client_id: clientId,
        client_secret: clientSecret,
        username,
        password
      })

      const api = new Client(server)
      const data = await api.request('/token', { method: 'POST', data: params })
      this.updateToken(data)
      return data
    },

    async refresh() {
      const mainStore = useMainStore()
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: mainStore.config.clientId,
        client_secret: mainStore.config.clientSecret,
        refresh_token: this.refreshToken
      })

      const api = new Client(mainStore.config.server)
      const data = await api.request('/token', { method: 'POST', data: params })
      this.updateToken(data)
      return data
    }
  }
})
