import { defineStore } from 'pinia'
import { Client as Client21 } from '@/composables/api/21'
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
      const api = new Client21(serverStore.apiUrl, null, serverStore.apiRetries)
      this.apiInfo = await api.info()
    },

    async fetchMessages() {
      const serverStore = useServerStore()
      const settingsStore = useSettingsStore()
      const api = new Client21(serverStore.apiUrl, null, serverStore.apiRetries)

      const rawMessages = await api.messages(
        settingsStore.currentUnity,
        settingsStore.enabledServices,
      )

      if (!rawMessages || rawMessages.length === 0) return

      const novas = rawMessages
        .map((m) => this.normalizeMessage(m))
        .filter(
          (novaTicket) =>
            !this.messages.some(
              (existing) =>
                existing.ticket === novaTicket.ticket && existing.local === novaTicket.local,
            ),
        )

      if (novas.length > 0) {
        this.messages = [...novas, ...this.messages].slice(0, HISTORY_MAX_LENGTH)
      }
    },

    normalizeMessage(data) {
      const numeroSenha = String(data.numeroSenha).padStart(3, '0')
      const numeroLocal = String(data.numeroLocal).padStart(3, '0')

      return {
        id: data.id,
        type: 'ticket',
        ticket: `${data.siglaSenha}${numeroSenha}`,
        clientName: data.nomeCliente || '',
        local: `${data.local} ${numeroLocal}`,
        priority: data.prioridade === 'Prioridade',
        $data: data,
      }
    },
  },
})
