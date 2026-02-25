import { defineStore } from 'pinia'
import { Client } from '@/composables/api/21'
import storage from '@/composables/storage'
import { useAuthStoreOld } from './authOld'

const HISTORY_MAX_LENGTH = 4

const locales = import.meta.glob('../../public/i18n/*.json')

export const useMainStore = defineStore('main', {
  state: () => ({
    config: storage.get('config', {}),
    apiInfo: {},
    messages: [], // A primeira mensagem [0] é a atual, o resto é histórico
    dict: {},
  }),

  getters: {
    message: (state) => state.messages[0] || { id: 0, title: '', subtitle: '', description: '' },
    history: (state) => state.messages.slice(1),
    theme: (state) => state.config.theme || 'novosga.default',
  },

  actions: {
    async updateConfig(config) {
      this.config = { ...config }
      storage.set('config', this.config)

      const locale = config.locale || 'pt_BR'
      // O caminho deve bater exatamente com a estrutura de pastas
      const path = `../../public/i18n/${locale}.json`

      if (locales[path]) {
        const mod = await locales[path]()
        this.dict = mod.default
      } else {
        console.warn(`Arquivo de tradução não encontrado: ${path}`)
      }
    },

    async fetchApiInfo() {
      const auth = useAuthStoreOld()
      const api = new Client(this.config.server)
      this.apiInfo = await api.info(auth.accessToken)
    },

    async fetchMessages() {
      const auth = useAuthStoreOld()
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
