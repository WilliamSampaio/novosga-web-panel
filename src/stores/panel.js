import { defineStore } from 'pinia'
import storage from '@/composables/storage'
import { LIST_PANEL_MODELS } from '@/plugins/registry'

export const usePanelStore = defineStore('panel', {
  state: () => {
    const defaults = {
      panel: import.meta.env.VITE_PANEL ?? 'default',
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
      panel: saved.panel ?? defaults.panel,
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
  },
})
