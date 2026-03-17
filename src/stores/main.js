import { defineStore } from 'pinia'
import { Client as Client21 } from '@/composables/api/21'
import { useAuthStore } from './auth'
import { useServerStore } from './server'
import { useSettingsStore } from './settings'

const HISTORY_MAX_LENGTH = 10

export const useMainStore = defineStore('main', {
  state: () => ({
    apiInfo: {},
    messages: [],
    dict: {},
  }),

  getters: {
    message: (state) => state.messages[0] || { id: 0, ticket: '', clientName: '', local: '' },
    history: (state) => state.messages.slice(1),
  },

  actions: {
    async fetchApiInfo() {
      const serverStore = useServerStore()
      const authStore = useAuthStore()
      const api = new Client21(serverStore.apiUrl, null, serverStore.apiRetries)
      this.apiInfo = await api.info(authStore.accessToken)
    },

    async fetchMessages() {
      const serverStore = useServerStore()
      const authStore = useAuthStore()
      const settingsStore = useSettingsStore()
      const api = new Client21(serverStore.apiUrl, null, serverStore.apiRetries)

      try {
        const messages = await api.messages(
          authStore.accessToken,
          settingsStore.currentUnity,
          settingsStore.enabledServices,
        )

        if (messages && messages.length > 0) {
          this.messages = messages.map((m) => this.normalizeMessage(m)).slice(0, HISTORY_MAX_LENGTH)
        }
      } catch (error) {
        console.error('Erro ao buscar histórico inicial:', error)
      }
    },

    normalizeMessage(data) {
      return {
        id: data.id,
        type: 'ticket',
        ticket: data.siglaSenha + ('000' + data.numeroSenha).slice(-3),
        clientName: data.nomeCliente || '',
        local: `${data.local} ${('000' + data.numeroLocal).slice(-3)}`,
        priority: data.prioridade === 'Prioridade',
        $data: data,
      }
    },
  },
})
