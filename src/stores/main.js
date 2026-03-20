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
    message: (state) => state.messages[0] || { id: 0, title: '', subtitle: '', description: '' },
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

      if (rawMessages?.length > 0) {
        this.newMessage(this.normalizeMessage(rawMessages[0]))
      }
    },

    newMessage(message) {
      // Evita duplicados
      if (this.messages.length > 0 && this.messages[0].id === message.id) return

      // Remove se a mesma senha já existe no histórico para não repetir na lateral
      const idx = this.messages.findIndex(
        (m) => m.ticket === message.ticket && m.type === message.type,
      )
      if (idx !== -1) this.messages.splice(idx, 1)

      this.messages.unshift(message)
      if (this.messages.length > HISTORY_MAX_LENGTH) this.messages.pop()
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
