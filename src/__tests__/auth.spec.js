import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('updates token data and persists it in localStorage', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))

    const store = useAuthStore()

    store.updateToken({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      expires_in: 900,
    })

    expect(store.accessToken).toBe('access-token')
    expect(store.refreshToken).toBe('refresh-token')
    expect(store.expireDate).toBe('2026-01-01T10:10:00.000Z')
    expect(store.isAuthenticated).toBe(true)
    expect(store.isExpired).toBe(false)

    const saved = JSON.parse(localStorage.getItem('painel-web.v3.auth'))
    expect(saved.accessToken).toBe('access-token')

    vi.useRealTimers()
  })

  it('treats missing or past expiration dates as expired', () => {
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))

    const store = useAuthStore()

    expect(store.isExpired).toBe(true)

    store.expireDate = '2026-01-01T09:59:59.000Z'
    expect(store.isExpired).toBe(true)

    vi.useRealTimers()
  })

  it('clears token state and persisted auth on logout', () => {
    const store = useAuthStore()
    store.updateToken({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      expires_in: 900,
    })

    store.logout()

    expect(store.accessToken).toBeNull()
    expect(store.refreshToken).toBeNull()
    expect(store.expireDate).toBeNull()
    expect(localStorage.getItem('painel-web.v3.auth')).toBeNull()
  })
})
