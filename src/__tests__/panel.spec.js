import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { usePanelStore } from '@/stores/panel'
import i18n from '@/plugins/i18n'

describe('panel store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    i18n.global.locale.value = 'pt_BR'
  })

  it('lists registered panel models', () => {
    const store = usePanelStore()

    expect(store.listPanelModels).toEqual(
      expect.arrayContaining([
        { title: 'Default', value: 'default' },
        { title: 'Model001', value: 'model001' },
        { title: 'Alert', value: 'alert' },
      ]),
    )
  })

  it('parses speech text placeholders', () => {
    const store = usePanelStore()
    store.panel.speechText = '$TICKET$ $CLIENT$ $LOCAL$ $SERVICE$'

    const text = store.getParsedSpeechText({
      ticketCode: 'A',
      ticketNumber: 7,
      clientName: 'Maria',
      local: 'Guiche',
      localNumber: 2,
      service: 'Triagem',
    })

    expect(text).toBe('Senha A 7 Maria Guiche 2 Triagem')
  })

  it('uses ticket text when client is missing for CLIENT_OR_TICKET', () => {
    const store = usePanelStore()
    store.panel.speechText = '$CLIENT_OR_TICKET$ $LOCAL$'

    const text = store.getParsedSpeechText({
      ticketCode: 'B',
      ticketNumber: 12,
      clientName: '',
      local: 'Sala',
      localNumber: 4,
      service: '',
    })

    expect(text).toBe('Senha B 12 Sala 4')
  })

  it('uses the active locale when parsing speech text placeholders', () => {
    i18n.global.locale.value = 'en'
    const store = usePanelStore()
    store.panel.speechText = '$TICKET$ $LOCAL$'

    const text = store.getParsedSpeechText({
      ticketCode: 'C',
      ticketNumber: 3,
      clientName: '',
      local: 'Counter',
      localNumber: 1,
      service: '',
    })

    expect(text).toBe('Ticket C 3 Counter 1')
  })

  it('returns empty speech text when no template is configured', () => {
    const store = usePanelStore()

    expect(
      store.getParsedSpeechText({
        ticketCode: 'A',
        ticketNumber: 1,
        clientName: 'Maria',
        local: 'Guiche',
        localNumber: 1,
        service: 'Triagem',
      }),
    ).toBe('')
  })
})
