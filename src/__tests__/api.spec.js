import { beforeEach, describe, expect, it, vi } from 'vitest'
import i18n from '@/plugins/i18n'

const requestMock = vi.fn()

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      request: requestMock,
    })),
  },
}))

vi.mock('axios-retry', () => ({
  default: vi.fn(),
}))

describe('api client', () => {
  beforeEach(() => {
    requestMock.mockReset()
    i18n.global.locale.value = 'pt_BR'
  })

  it('uses the active locale for the generic API error', async () => {
    i18n.global.locale.value = 'en'
    const { Client } = await import('@/composables/api/21')
    requestMock.mockRejectedValue({})

    const api = new Client('https://novosga.example', null, 0)

    await expect(api.request('/status')).rejects.toThrow('Unknown API error')
  })

  it('preserves API error details when the server returns a message', async () => {
    const { Client } = await import('@/composables/api/21')
    requestMock.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } })

    const api = new Client('https://novosga.example', null, 0)

    await expect(api.request('/token')).rejects.toThrow('Invalid credentials')
  })
})
