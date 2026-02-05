import { defineStore } from 'pinia'
import { Client } from '@/composables/api'
import storage from '@/composables/storage'
import { useAuthStore } from './auth'

const HISTORY_MAX_LENGTH = 5

export const useMainStore = defineStore('main', {
  state: () => ({
    config: storage.get('config', {}),
    apiInfo: {},
    messages: [], // A primeira mensagem [0] é a atual, o resto é histórico
    dict: {}
  }),

  getters: {
    message: (state) => state.messages[0] || { id: 0, title: '', subtitle: '', description: '' },
    history: (state) => state.messages.slice(1),
    theme: (state) => state.config.theme || 'novosga.default'
  },

  actions: {
    async updateConfig(config) {
      this.config = { ...config }
      storage.set('config', this.config)

      // Carregar tradução dinamicamente
      const locale = config.locale || 'pt_BR'
      try {
        const dictionary = await import(`../../static/i18n/${locale}.json`)
        this.dict = dictionary.default
      } catch (e) { console.error('Erro i18n', e) }
    },

    async fetchApiInfo() {
      const auth = useAuthStore()
      const api = new Client(this.config.server)
      this.apiInfo = await api.info(auth.accessToken)
    },

    async fetchMessages() {
      const auth = useAuthStore()
      const api = new Client(this.config.server, null, this.config.retries)
      const messages = await api.messages(auth.accessToken, this.config.unity, this.config.services)

      if (messages.length > 0) {
        this.newMessage(this.normalizeMessage(messages[0]))
      }
    },

    newMessage(message) {
      // Evita duplicados
      if (this.messages.length > 0 && this.messages[0].id === message.id) return

      // Remove se a mesma senha já existe no histórico para não repetir na lateral
      const idx = this.messages.findIndex(m => m.title === message.title && m.type === message.type)
      if (idx !== -1) this.messages.splice(idx, 1)

      this.messages.unshift(message)
      if (this.messages.length > HISTORY_MAX_LENGTH) this.messages.pop()
    },

    normalizeMessage(data) {
      return {
        id: data.id,
        type: 'ticket',
        title: data.siglaSenha + ('000' + data.numeroSenha).slice(-3),
        subtitle: `${data.local} ${('00' + data.numeroLocal).slice(-2)}`,
        description: data.prioridade,
        $data: data
      }
    }
  }
})
