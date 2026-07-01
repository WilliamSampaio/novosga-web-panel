import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '@/plugins/i18n'
import { useMessagesStore } from '@/stores/messages'
import { useSettingsStore } from '@/stores/settings'

vi.mock('@/composables/api/21', () => ({
  Client: vi.fn(function () {
    return {
      services: vi.fn().mockResolvedValue([]),
    }
  }),
}))

describe('settings store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    i18n.global.locale.value = 'pt_BR'
  })

  it('uses the active locale when no services are returned', async () => {
    i18n.global.locale.value = 'en'
    const settingsStore = useSettingsStore()
    const messagesStore = useMessagesStore()

    await settingsStore.fetchServices(1)

    expect(settingsStore.services).toEqual([])
    expect(messagesStore.queue).toEqual([{ text: 'No services found!', color: 'error' }])
  })
})
