import axios from 'axios'
import axiosRetry from 'axios-retry'

/**
 * Cliente API para o Novo SGA v2
 */
class Client {
  constructor(server, moduleName, retries = 5) {
    let host = String(server || '')

    if (host && !host.endsWith('/')) {
      host += '/'
    }

    if (moduleName) {
      host += moduleName + '/'
    }

    this.retries = retries
    // No Novo SGA v2 a base é sempre /api após o host/modulo
    this.baseURL = `${host}api`

    // Criamos uma instância dedicada para não poluir o axios global
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
    })

    // Configuração de Retry na instância específica
    axiosRetry(this.axiosInstance, {
      retries: this.retries,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        // Repete apenas em erros de rede ou 5xx
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response && error.response.status >= 500)
        )
      },
    })
  }

  /**
   * Método genérico de requisição usando async/await
   */
  async request(url, config = {}) {
    try {
      const response = await this.axiosInstance.request({
        url,
        ...config,
      })
      return response.data
    } catch (error) {
      let message = error.message

      if (error.response) {
        // Se a API retornou um erro estruturado
        const { data, statusText } = error.response
        message = statusText
        if (data && data.error_description) {
          message += `: ${data.error_description}`
        } else if (data && data.message) {
          message += `: ${data.message}`
        }
      }

      throw message
    }
  }

  // Métodos de atalho para a API

  info(token) {
    return this.request('', {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  unities(token) {
    return this.request('/unidades', {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  services(token, unityId) {
    return this.request(`/unidades/${unityId}/servicos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  messages(token, unity, services = []) {
    const id = typeof unity === 'object' ? unity.id : unity

    // Normaliza a lista de serviços para a query string
    const servicosQuery = services
      .map((s) => parseInt(s, 10))
      .filter((s) => s > 0)
      .join(',')

    return this.request(`/unidades/${id}/painel`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { servicos: servicosQuery },
    })
  }
}

export { Client }
