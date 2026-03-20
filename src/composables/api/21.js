import axios from 'axios'
import axiosRetry from 'axios-retry'

class Client {
  constructor(server, moduleName, retries = 5) {
    const host = String(server || '').replace(/\/+$/, '')
    const module = moduleName ? `/${moduleName.replace(/^\/+|\/+$/g, '')}` : ''

    this.baseURL = `${host}${module}/api`
    this.retries = retries

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
    })

    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const { useAuthStore } = await import('@/stores/auth')
        const authStore = useAuthStore()

        if (authStore.accessToken) {
          config.headers.Authorization = `Bearer ${authStore.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const { useAuthStore } = await import('@/stores/auth')
            const authStore = useAuthStore()

            await authStore.refresh()
            originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
            return this.axiosInstance(originalRequest)
          } catch (refreshError) {
            return Promise.reject(refreshError)
          }
        }
        return Promise.reject(error)
      },
    )

    axiosRetry(this.axiosInstance, {
      retries: this.retries,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500
      },
    })
  }

  async request(url, config = {}) {
    try {
      const response = await this.axiosInstance.request({ url, ...config })
      return response.data
    } catch (error) {
      const message =
        error.response?.data?.error_description ||
        error.response?.data?.message ||
        error.message ||
        'Erro desconhecido na API'
      throw new Error(message)
    }
  }

  info() {
    return this.request('')
  }
  unities() {
    return this.request('/unidades')
  }
  services(unityId) {
    return this.request(`/unidades/${unityId}/servicos`)
  }

  messages(unity, services = []) {
    const id = typeof unity === 'object' ? unity.id : unity
    const servicosQuery = services
      .map((s) => parseInt(s, 10))
      .filter((s) => s > 0)
      .join(',')

    return this.request(`/unidades/${id}/painel`, {
      params: { servicos: servicosQuery },
    })
  }
}

export { Client }
