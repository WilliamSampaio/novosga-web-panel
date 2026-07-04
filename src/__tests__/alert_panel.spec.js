import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import AlertPanel from '@/components/panels/Alert/Panel.vue'
import i18n from '@/plugins/i18n'
import { useMainStore } from '@/stores/main'
import { usePanelStore } from '@/stores/panel'
import { useSettingsStore } from '@/stores/settings'

const { playAlertMock, speakAllMock } = vi.hoisted(() => ({
  playAlertMock: vi.fn(() => Promise.resolve()),
  speakAllMock: vi.fn(() => Promise.resolve()),
}))

vi.mock('@/composables/audio', () => ({
  useAlert: () => ({
    playAlert: playAlertMock,
  }),
}))

vi.mock('@/composables/speech', () => ({
  useSpeech: () => ({
    speakAll: speakAllMock,
  }),
}))

const mountAlertPanel = () => {
  const pinia = createPinia()
  setActivePinia(pinia)

  const settingsStore = useSettingsStore()
  settingsStore.unities = [{ id: 1, nome: 'PA' }]
  settingsStore.currentUnity = 1
  settingsStore.alertSound = 'ding-dong.wav'

  const panelStore = usePanelStore()
  panelStore.panel.speechText = '$CLIENT_OR_TICKET$ $LOCAL$ $SERVICE$'
  panelStore.header.bgColor = '#aa0000'
  panelStore.header.textColor = '#ffffff'
  panelStore.footer.bgColor = '#aa0000'
  panelStore.footer.textColor = '#ffffff'
  panelStore.footer.showClock = false
  panelStore.main.ticketColor = '#cc0000'
  panelStore.main.ticketPriorityColor = '#dd0000'
  panelStore.main.ticketLabelColor = '#000000'
  panelStore.main.serviceColor = '#000000'
  panelStore.main.localColor = '#3355aa'

  const wrapper = mount(AlertPanel, {
    global: {
      plugins: [pinia, i18n],
      stubs: {
        Clock: true,
      },
    },
  })

  return {
    wrapper,
    mainStore: useMainStore(),
    settingsStore,
  }
}

const makeMessage = ({
  id = 1,
  ticket = 'A001',
  clientName = 'Maria Silva',
  service = 'Triagem',
  local = 'Consultorio 001',
  priority = true,
  priorityText = 'Emergencia',
} = {}) => ({
  id,
  type: 'ticket',
  ticket,
  clientName,
  local,
  priority,
  priorityText,
  $data: {
    siglaSenha: ticket.slice(0, 1),
    numeroSenha: Number(ticket.slice(1)),
    nomeCliente: clientName,
    local: local.replace(/\s+\d+$/, ''),
    numeroLocal: 1,
    servico: { nome: service },
  },
})

describe('Alert panel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    i18n.global.locale.value = 'pt_BR'
    playAlertMock.mockClear()
    speakAllMock.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the current call without history and emphasizes attendance data', async () => {
    const { wrapper, mainStore } = mountAlertPanel()

    mainStore.newMessage(makeMessage())
    await nextTick()

    const text = wrapper.text()

    expect(text).toContain('PA')
    expect(text).toContain('Atendimento')
    expect(text).toContain('Maria Silva')
    expect(text).toContain('A001')
    expect(text).toContain('Triagem')
    expect(text).toContain('Consultorio 001')
    expect(text).toContain('Emergencia')
    expect(text).not.toContain('Senhas Anteriores')
  })

  it('uses the ticket as the main identifier when client name is missing', async () => {
    const { wrapper, mainStore } = mountAlertPanel()

    mainStore.newMessage(makeMessage({ clientName: '' }))
    await nextTick()

    expect(wrapper.text()).toContain('A001')
  })

  it('updates elapsed time and repeats the alert every 15 seconds', async () => {
    const { wrapper, mainStore } = mountAlertPanel()

    mainStore.newMessage(makeMessage())
    await nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('00:00')
    expect(playAlertMock).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()

    expect(wrapper.text()).toContain('00:01')

    await vi.advanceTimersByTimeAsync(14000)
    await nextTick()

    expect(wrapper.text()).toContain('00:15')
    expect(playAlertMock).toHaveBeenCalledTimes(2)

    await vi.advanceTimersByTimeAsync(15000)
    await nextTick()

    expect(wrapper.text()).toContain('00:30')
    expect(playAlertMock).toHaveBeenCalledTimes(3)
  })

  it('does not reset elapsed time when the same ticket is called again', async () => {
    const { wrapper, mainStore } = mountAlertPanel()

    mainStore.newMessage(makeMessage({ id: 1, ticket: 'A001' }))
    await nextTick()
    await flushPromises()
    await vi.advanceTimersByTimeAsync(5000)
    await nextTick()

    expect(wrapper.text()).toContain('00:05')

    mainStore.newMessage(makeMessage({ id: 2, ticket: 'A001' }))
    await nextTick()
    await flushPromises()

    expect(wrapper.text()).toContain('00:05')
    expect(playAlertMock).toHaveBeenCalledTimes(2)
  })

  it('resets elapsed time when a different ticket becomes current', async () => {
    const { wrapper, mainStore } = mountAlertPanel()

    mainStore.newMessage(makeMessage({ id: 1, ticket: 'A001' }))
    await nextTick()
    await vi.runOnlyPendingTimersAsync()
    await vi.advanceTimersByTimeAsync(5000)
    await nextTick()

    mainStore.newMessage(makeMessage({ id: 2, ticket: 'B002' }))
    await nextTick()

    expect(wrapper.text()).toContain('00:00')
  })

  it('runs speech only for the initial call audio flow', async () => {
    const { mainStore, settingsStore } = mountAlertPanel()
    settingsStore.speech = true

    mainStore.newMessage(makeMessage())
    await nextTick()
    await flushPromises()

    expect(speakAllMock).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(15000)

    expect(playAlertMock).toHaveBeenCalledTimes(2)
    expect(speakAllMock).toHaveBeenCalledTimes(1)
  })

  it('clears recurring alerts after unmount', async () => {
    const { wrapper, mainStore } = mountAlertPanel()

    mainStore.newMessage(makeMessage())
    await nextTick()
    await flushPromises()

    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(15000)

    expect(playAlertMock).toHaveBeenCalledTimes(1)
  })
})
