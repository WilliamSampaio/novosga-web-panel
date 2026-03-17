const STORAGE_PREFIX = 'painel-web.v3.'

export default {
  /**
   * Recupera um item do localStorage e tenta converter de JSON.
   * @param {string} name
   * @param {*} defaultValue
   */
  get(name, defaultValue = null) {
    const key = STORAGE_PREFIX + name
    const item = localStorage.getItem(key)

    if (item === null) {
      return defaultValue
    }

    try {
      return JSON.parse(item)
    } catch (e) {
      console.error(`Erro ao parsear storage key "${key}":`, e)
      return defaultValue
    }
  },

  /**
   * Salva um item no localStorage convertendo para JSON string.
   * @param {string} name
   * @param {*} value
   */
  set(name, value) {
    try {
      const str = JSON.stringify(value)
      localStorage.setItem(STORAGE_PREFIX + name, str)
    } catch (e) {
      console.error(`Erro ao salvar no storage key "${name}":`, e)
    }
  },

  /**
   * Remove um item específico
   */
  remove(name) {
    localStorage.removeItem(STORAGE_PREFIX + name)
  },

  /**
   * Limpa todo o storage do prefixo (útil para logout/reset)
   */
  clear() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  },
}
