import { LIST_PANEL_MODELS } from '@/plugins/registry'
import { defineStore } from 'pinia'
import storage from '@/composables/storage'
import i18n from '@/plugins/i18n'

export const usePanelStore = defineStore('panel', {
  state: () => {
    const defaults = {
      panel: {
        model: import.meta.env.VITE_PANEL || 'default',
        speechText: null,
      },
      header: {
        leftLogoUrl: import.meta.env.VITE_HEADER_LEFT_LOGO_URL,
        bgColor: import.meta.env.VITE_HEADER_BG_COLOR,
        textColor: import.meta.env.VITE_HEADER_TEXT_COLOR,
      },
      footer: {
        leftLogoUrl: import.meta.env.VITE_FOOTER_LEFT_LOGO_URL,
        rightLogoUrl: import.meta.env.VITE_FOOTER_RIGHT_LOGO_URL,
        bgColor: import.meta.env.VITE_FOOTER_BG_COLOR,
        textColor: import.meta.env.VITE_FOOTER_TEXT_COLOR,
        showClock: import.meta.env.VITE_FOOTER_SHOW_CLOCK === 'true',
      },
      main: {
        bgColor: import.meta.env.VITE_MAIN_BG_COLOR,
        ticketLabelColor: import.meta.env.VITE_MAIN_TICKET_LABEL_COLOR,
        ticketColor: import.meta.env.VITE_MAIN_TICKET_COLOR,
        ticketPriorityColor: import.meta.env.VITE_MAIN_TICKET_PRIORITY_COLOR,
        serviceColor: import.meta.env.VITE_MAIN_SERVICE_COLOR,
        localColor: import.meta.env.VITE_MAIN_LOCAL_COLOR,
        historyBgColor: import.meta.env.VITE_MAIN_HISTORY_BG_COLOR,
        historyLabelColor: import.meta.env.VITE_MAIN_HISTORY_LABEL_COLOR,
        historyEmptyColor: import.meta.env.VITE_MAIN_HISTORY_EMPTY_COLOR,
        historyShowLocal: import.meta.env.VITE_MAIN_HISTORY_SHOW_LOCAL === 'true',
      },
    }

    const saved = storage.get('panel')
    if (!saved) return defaults

    return {
      panel: { ...defaults.panel, ...saved.panel },
      header: { ...defaults.header, ...saved.header },
      footer: { ...defaults.footer, ...saved.footer },
      main: { ...defaults.main, ...saved.main },
    }
  },

  getters: {
    listPanelModels: () => {
      return Object.entries(LIST_PANEL_MODELS).map(([key, data]) => ({
        title: data.name,
        value: key,
      }))
    },
    getCurrentPanelModel: (state) => {
      return LIST_PANEL_MODELS[state.panel.model] || null
    },
    headerLeftLogoUrlIsDefined: (state) =>
      state.header.leftLogoUrl !== undefined &&
      state.header.leftLogoUrl !== null &&
      state.header.leftLogoUrl !== '',
    footerLeftLogoUrlIsDefined: (state) =>
      state.footer.leftLogoUrl !== undefined &&
      state.footer.leftLogoUrl !== null &&
      state.footer.leftLogoUrl !== '',
    footerRightLogoUrlIsDefined: (state) =>
      state.footer.rightLogoUrl !== undefined &&
      state.footer.rightLogoUrl !== null &&
      state.footer.rightLogoUrl !== '',
  },

  actions: {
    save() {
      storage.set('panel', this.$state)
    },

    /**
     * @param {Object} data
     * @param {string} data.ticketCode
     * @param {number} data.ticketNumber
     * @param {string} data.clientName
     * @param {string} data.local
     * @param {number} data.localNumber
     * @param {string} data.service
     * @returns {string}
     */
    getParsedSpeechText({ ticketCode, ticketNumber, clientName, local, localNumber, service }) {
      const { t } = i18n.global

      if (this.$state.panel.speechText === null) return ''

      let text = this.$state.panel.speechText

      const ticketText = [t('panel.ticket'), ...ticketCode, ticketNumber].join(' ')
      const clientText = clientName || ''
      const localText = [local, localNumber].join(' ')

      const replacements = {
        $TICKET$: ticketText,
        $CLIENT$: clientText,
        $CLIENT_OR_TICKET$: clientText || ticketText,
        $LOCAL$: localText,
        $SERVICE$: service || '',
      }

      const regex = new RegExp(
        Object.keys(replacements)
          .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('|'),
        'g',
      )

      text = text.replace(regex, (matched) => replacements[matched])

      return text.split(/\s+/).filter(Boolean).join(' ')
    },
  },
})
