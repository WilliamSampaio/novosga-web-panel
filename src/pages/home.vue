<template>
  <div class="h-screen w-full relative overflow-hidden bg-white">
    <GoToSettingsButton />

    <Panel />
  </div>
</template>

<script setup>
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
import { log } from '@/util/functions'
import { onBeforeMount, onBeforeUnmount, onMounted, onUnmounted } from 'vue'

import GoToSettingsButton from '@/components/GoToSettingsButton.vue'
import Panel from '@/components/Panel.vue'
import { useAuthStore } from '@/stores/auth'
import { useServerStore } from '@/stores/server'
import { useSettingsStore } from '@/stores/settings'

const router = useRouter()
const mainStore = useMainStore()
const authStore = useAuthStore()
const serverStore = useServerStore()
const settingsStore = useSettingsStore()

let eventSource = null
let timeoutId = null
let isRunning = false

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
    await checkAndRefreshToken().catch(() => {})
    startTokenMonitor()
  }, 60 * 1000)
}

/**
 * Conexão Real-time via Mercure (EventSource)
 */
const connect = async (attempts = 3) => {
  if (!serverStore.apiUrl || !settingsStore.currentUnity) {
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
      let serverUrl = serverStore.apiUrl.endsWith('/')
        ? serverStore.apiUrl
        : serverStore.apiUrl + '/'
      mercureUrl = mercureUrl.startsWith('/')
        ? serverUrl + mercureUrl.substring(1)
        : serverUrl + mercureUrl
    }

    const url = new URL(mercureUrl)
    url.searchParams.append('topic', `/unidades/${settingsStore.currentUnity}/painel`)

    eventSource = new EventSource(url)
    eventSource.onmessage = () => fetchMessages()

    log('Conectado ao Mercure com sucesso.')
  } catch (e) {
    log('Erro ao conectar ao Mercure: ' + e)
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

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.documentElement.style.overflow = 'auto'
  document.body.style.overflow = 'auto'
})
</script>

<style scoped></style>
