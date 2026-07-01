import { describe, expect, it } from 'vitest'
import ptBR from '@/locales/pt_BR.json'
import en from '@/locales/en.json'
import es from '@/locales/es.json'

const referenceLocale = 'pt_BR'
const referenceKeys = Object.keys(ptBR).sort()

const locales = {
  en,
  es,
}

describe('locale messages', () => {
  it.each(Object.entries(locales))(
    'keeps %s keys in sync with pt_BR',
    (localeName, messages) => {
      const keys = Object.keys(messages).sort()
      const missing = referenceKeys.filter((key) => !keys.includes(key))
      const extra = keys.filter((key) => !referenceKeys.includes(key))

      expect(
        { missing, extra },
        `${localeName} must have the same keys as ${referenceLocale}`,
      ).toEqual({ missing: [], extra: [] })
    },
  )
})
