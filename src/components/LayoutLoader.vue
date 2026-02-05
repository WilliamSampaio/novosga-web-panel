<template>
  <component :is="currentThemeComponent" />
</template>

<script setup>
import { ref, shallowRef, computed, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { useAuthStore } from '@/stores/auth'
import { log } from '@/util/functions'

// Importação dos layouts disponíveis
import DefaultLayout from '@/layouts/novosga.default.vue'

const router = useRouter()
const mainStore = useMainStore()
const authStore = useAuthStore()

const currentThemeComponent = shallowRef(DefaultLayout)
let eventSource = null
let timeoutId = null
let isRunning = false

/**
 * Resolve qual componente de tema usar
 */
const themeName = computed(() => mainStore.theme || 'Default')

// Watcher para trocar o layout se o tema mudar nas configurações
watch(themeName, (newTheme) => {
  try {
    // Se você tiver múltiplos temas, pode mapeá-los aqui
    // Ex: if (newTheme === 'Dark') currentThemeComponent.value = DarkLayout
    currentThemeComponent.value = DefaultLayout
  } catch (e) {
    currentThemeComponent.value = DefaultLayout
  }
}, { immediate: true })

/**
 * Gerenciamento de Token (Verifica se precisa renovar ou gerar novo)
 */
const checkAndRefreshToken = async () => {
  try {
    if (authStore.isAuthenticated && authStore.isExpired) {
      log('Token expirado, tentando refresh...')
      await authStore.refresh()
    } else if (!authStore.isAuthenticated) {
      log('Não autenticado, gerando novo token...')
      await authStore.token()
    }
  } catch (error) {
    log('Erro crítico de autenticação: ' + error)
    router.push('/settings')
    throw error
  }
}

/**
 * Busca as mensagens e inicia o loop de verificação de token
 */
const fetchMessages = async () => {
  if (!isRunning) {
    isRunning = true
    startTokenMonitor()
  }

  try {
    await mainStore.fetchMessages()
  } catch (e) {
    log('Erro ao buscar mensagens: ' + e)
    // Se falhar, limpa o token e tenta de novo (pode ser credencial inválida)
    authStore.updateToken(null)
    await checkAndRefreshToken()
  }
}

/**
 * Loop que verifica a validade do token a cada 1 minuto
 */
const startTokenMonitor = () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(async () => {
    if (!isRunning) return
    log('Monitor: Verificando validade do token...')
    await checkAndRefreshToken().catch(() => { })
    startTokenMonitor()
  }, 60 * 1000)
}

/**
 * Conexão Real-time via Mercure (EventSource)
 */
const connect = async (attempts = 3) => {
  const config = mainStore.config

  if (!config?.server || !config?.unity) {
    log('Painel não configurado. Redirecionando...')
    router.push('/settings')
    return
  }

  try {
    await checkAndRefreshToken()
    await mainStore.fetchApiInfo()

    if (eventSource) eventSource.close()

    // Lógica de montagem da URL do Mercure
    let mercureUrl = mainStore.apiInfo.mercureUrl || ''
    if (!mercureUrl.toLowerCase().startsWith('http')) {
      let serverUrl = config.server.endsWith('/') ? config.server : config.server + '/'
      mercureUrl = mercureUrl.startsWith('/')
        ? serverUrl + mercureUrl.substring(1)
        : serverUrl + mercureUrl
    }

    const url = new URL(mercureUrl)
    url.searchParams.append('topic', `/unidades/${config.unity}/painel`)

    eventSource = new EventSource(url)
    eventSource.onmessage = () => fetchMessages()

    log('Conectado ao Mercure com sucesso.')
  } catch (e) {
    if (attempts > 0) {
      log(`Falha na conexão. Tentando novamente... (${attempts})`)
      setTimeout(() => connect(attempts - 1), 2000)
    }
  }

  // Carga inicial de dados
  fetchMessages()
}

onBeforeMount(() => {
  connect()
})

onBeforeUnmount(() => {
  isRunning = false
  clearTimeout(timeoutId)
  if (eventSource) eventSource.close()
})
</script>
