import { defineStore } from 'pinia'
import storage from '@/composables/storage'

export const usePanelStore = defineStore('panel', {
  state: () => ({
    header: {
      leftLogoUrl: storage.get('header_left_logo_url', import.meta.env.VITE_HEADER_LEFT_LOGO_URL),
      bgColor: storage.get('header_bg_color', import.meta.env.VITE_HEADER_BG_COLOR),
      textColor: storage.get('header_text_color', import.meta.env.VITE_HEADER_TEXT_COLOR),
    },
    footer: {
      leftLogoUrl: storage.get('footer_left_logo_url', import.meta.env.VITE_FOOTER_LEFT_LOGO_URL),
      rightLogoUrl: storage.get(
        'footer_right_logo_url',
        import.meta.env.VITE_FOOTER_RIGHT_LOGO_URL,
      ),
      bgColor: storage.get('footer_bg_color', import.meta.env.VITE_FOOTER_BG_COLOR),
      textColor: storage.get('footer_text_color', import.meta.env.VITE_FOOTER_TEXT_COLOR),
      showClock: storage.get(
        'footer_show_clock',
        import.meta.env.VITE_FOOTER_SHOW_CLOCK === 'true',
      ),
    },
    main: {
      bgColor: storage.get('main_bg_color', import.meta.env.VITE_MAIN_BG_COLOR),
      ticketLabelColor: storage.get(
        'main_ticket_label_color',
        import.meta.env.VITE_MAIN_TICKET_LABEL_COLOR,
      ),
      ticketColor: storage.get('main_ticket_color', import.meta.env.VITE_MAIN_TICKET_COLOR),
      ticketPriorityColor: storage.get(
        'main_ticket_priority_color',
        import.meta.env.VITE_MAIN_TICKET_PRIORITY_COLOR,
      ),
      serviceColor: storage.get('main_service_color', import.meta.env.VITE_MAIN_SERVICE_COLOR),
      localColor: storage.get('main_local_color', import.meta.env.VITE_MAIN_LOCAL_COLOR),
      historyBgColor: storage.get(
        'main_history_bg_color',
        import.meta.env.VITE_MAIN_HISTORY_BG_COLOR,
      ),
      historyLabelColor: storage.get(
        'main_history_label_color',
        import.meta.env.VITE_MAIN_HISTORY_LABEL_COLOR,
      ),
      historyEmptyColor: storage.get(
        'main_history_empty_color',
        import.meta.env.VITE_MAIN_HISTORY_EMPTY_COLOR,
      ),
      historyShowLocal: storage.get(
        'main_history_show_local',
        import.meta.env.VITE_MAIN_HISTORY_SHOW_LOCAL === 'true',
      ),
    },
    video: {
      videoId: storage.get('video_id', import.meta.env.VITE_VIDEO_ID),
      isPlaylist: storage.get(
        'video_is_playlist',
        import.meta.env.VITE_VIDEO_IS_PLAYLIST === 'true',
      ),
    },
  }),

  getters: {
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

  actions: {},
})
