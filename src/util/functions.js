/**
 * Detecta automaticamente se o app está em modo de desenvolvimento.
 * No Vite, import.meta.env.DEV é true durante o desenvolvimento.
 */
const debug = import.meta.env.DEV

export function log(...args) {
  if (debug) {
    // Usando o operador spread (...) que é mais moderno que o .apply()
    console.log('[Novo SGA]', ...args)
  }
}
