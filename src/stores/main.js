import { defineStore } from 'pinia'
import { Client as Client21 } from '@/composables/api/21'
import { useAuthStore } from './auth'
import { useServerStore } from './server'
import { useSettingsStore } from './settings'

const HISTORY_MAX_LENGTH = 10

// const locales = import.meta.glob('../../public/i18n/*.json')

export const useMainStore = defineStore('main', {
  state: () => ({
    apiInfo: {},
    messages: [], // A primeira mensagem [0] é a atual, o resto é histórico
    dict: {},
  }),

  getters: {
    message: (state) => state.messages[0] || { id: 0, title: '', subtitle: '', description: '' },
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
      const messages = await api.messages(
        authStore.accessToken,
        settingsStore.currentUnity,
        settingsStore.enabledServices,
      )

      if (messages.length > 0) {
        this.newMessage(this.normalizeMessage(messages[0]))
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
      return {
        id: data.id,
        type: 'ticket',
        ticket: data.siglaSenha + ('000' + data.numeroSenha).slice(-3),
        clientName: data.nomeCliente,
        local: `${data.local} ${('00' + data.numeroLocal).slice(-2)}`,
        priority: data.prioridade === 'Prioridade' ? true : false,
        $data: data,
      }
    },
  },
})
