import { beforeEach, describe, expect, it, vi } from 'vitest'
import storage from '@/composables/storage'

describe('storage composable', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and retrieves JSON values with the application prefix', () => {
    storage.set('settings', { locale: 'pt_BR', darkTheme: true })

    expect(localStorage.getItem('painel-web.v3.settings')).toBe(
      '{"locale":"pt_BR","darkTheme":true}',
    )
    expect(storage.get('settings')).toEqual({ locale: 'pt_BR', darkTheme: true })
  })

  it('returns the default value when the key does not exist', () => {
    expect(storage.get('missing', { fallback: true })).toEqual({ fallback: true })
  })

  it('returns the default value when persisted JSON is invalid', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem('painel-web.v3.settings', '{invalid-json')

    expect(storage.get('settings', { locale: 'pt_BR' })).toEqual({ locale: 'pt_BR' })
    expect(errorSpy).toHaveBeenCalledOnce()

    errorSpy.mockRestore()
  })

  it('removes one key or all keys owned by the app prefix', () => {
    storage.set('settings', { locale: 'pt_BR' })
    storage.set('panel', { model: 'default' })
    localStorage.setItem('external', 'kept')

    storage.remove('settings')
    expect(storage.get('settings')).toBeNull()
    expect(storage.get('panel')).toEqual({ model: 'default' })

    storage.clear()
    expect(storage.get('panel')).toBeNull()
    expect(localStorage.getItem('external')).toBe('kept')
  })
})
