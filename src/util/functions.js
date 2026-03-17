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

export function formatarNome(nomeCompleto, apenasPrimeiroSobrenome = false) {
  const preposicoes = new Set(['de', 'do', 'da', 'dos', 'das', 'e'])

  // Limpa espaços extras e divide o nome
  const partes = nomeCompleto.trim().split(/\s+/)

  if (partes.length <= 1) return nomeCompleto

  const primeiroNome = partes[0]
  const ultimoNome = partes[partes.length - 1]

  // Filtra as partes do meio ignorando preposições
  const nomesMeio = partes.slice(1, -1).filter((nome) => !preposicoes.has(nome.toLowerCase()))

  if (apenasPrimeiroSobrenome) {
    // Retorna "Fulano Silva"
    return `${primeiroNome} ${ultimoNome}`
  }

  // Retorna "Fulano B. C. Silva"
  const meioAbreviado = nomesMeio.map((nome) => `${nome[0].toUpperCase()}.`).join(' ')

  return meioAbreviado
    ? `${primeiroNome} ${meioAbreviado} ${ultimoNome}`
    : `${primeiroNome} ${ultimoNome}`
}
