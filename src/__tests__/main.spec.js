import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useMainStore } from '@/stores/main'

describe('main store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('normalizes raw API messages for panel rendering', () => {
    const store = useMainStore()

    const message = store.normalizeMessage({
      id: 10,
      siglaSenha: 'A',
      numeroSenha: 7,
      nomeCliente: 'Maria',
      local: 'Guiche',
      numeroLocal: 2,
      prioridade: 'Prioridade',
      peso: 2,
    })

    expect(message).toMatchObject({
      id: 10,
      type: 'ticket',
      ticket: 'A007',
      clientName: 'Maria',
      local: 'Guiche 002',
      priority: true,
      priorityText: 'Prioridade',
    })
  })

  it('uses message weight to detect priority tickets', () => {
    const store = useMainStore()

    const message = store.normalizeMessage({
      id: 11,
      siglaSenha: 'B',
      numeroSenha: 8,
      nomeCliente: '',
      local: 'Mesa',
      numeroLocal: 1,
      prioridade: 'Prioridade',
      peso: 1,
    })

    expect(message).toMatchObject({
      ticket: 'B008',
      local: 'Mesa 001',
      priority: false,
      priorityText: 'Prioridade',
    })
  })

  it('does not add the same current message twice', () => {
    const store = useMainStore()
    const message = { id: 1, ticket: 'A001', type: 'ticket' }

    store.newMessage(message)
    store.newMessage(message)

    expect(store.messages).toHaveLength(1)
  })

  it('moves repeated ticket/type to the top instead of duplicating it in history', () => {
    const store = useMainStore()

    store.newMessage({ id: 1, ticket: 'A001', type: 'ticket' })
    store.newMessage({ id: 2, ticket: 'B001', type: 'ticket' })
    store.newMessage({ id: 3, ticket: 'A001', type: 'ticket' })

    expect(store.messages.map((message) => message.id)).toEqual([3, 2])
  })

  it('keeps only the latest ten messages', () => {
    const store = useMainStore()

    for (let id = 1; id <= 11; id += 1) {
      store.newMessage({ id, ticket: `A${String(id).padStart(3, '0')}`, type: 'ticket' })
    }

    expect(store.messages).toHaveLength(10)
    expect(store.message.id).toBe(11)
    expect(store.history.at(-1).id).toBe(2)
  })
})
