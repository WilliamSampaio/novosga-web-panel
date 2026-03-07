<template>
  <div class="h-screen w-full relative overflow-hidden bg-white">
    <GoToSettingsButton />
    <PanelLoader :panel="panelStore.panel.model" />
  </div>
</template>

<script setup>
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
import { log } from '@/util/functions'
import { onBeforeMount, onBeforeUnmount, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

import GoToSettingsButton from '@/components/GoToSettingsButton.vue'
import { useAuthStore } from '@/stores/auth'
import { usePanelStore } from '@/stores/panel'
import { useServerStore } from '@/stores/server'
import { useSettingsStore } from '@/stores/settings'
import PanelLoader from '@/components/panels/PanelLoader.vue'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const mainStore = useMainStore()
const panelStore = usePanelStore()
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
      log(t('logs.token_expired'))
      await authStore.refresh()
    } else if (!authStore.isAuthenticated) {
      log(t('logs.not_authenticated'))
      await authStore.token()
    }
  } catch (error) {
    log(t('logs.auth_error') + error)
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
    log(t('logs.fetch_error') + e)
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
    log(t('logs.monitor_token'))
    await checkAndRefreshToken().catch(() => {})
    startTokenMonitor()
  }, 60 * 1000)
}

/**
 * Conexão Real-time via Mercure (EventSource)
 */
const connect = async (attempts = 3) => {
  if (!serverStore.apiUrl || !settingsStore.currentUnity) {
    log(t('logs.not_configured'))
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

    log(t('logs.mercure_connected'))
  } catch (e) {
    log(t('logs.mercure_error') + e)
    if (attempts > 0) {
      log(t('logs.mercure_retry', { attempts }))
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
