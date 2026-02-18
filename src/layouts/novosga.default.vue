<template>
  <!-- <VideoPlayer v-if="panelStore.video.videoId" :videoId="panelStore.video.videoId" :isPlaylist="panelStore.video.isPlaylist" /> -->

  <div class="h-screen w-full flex flex-col bg-white overflow-hidden">

    <!-- HEADER -->
    <div class="flex h-32 px-5 items-center justify-between [&>*:only-child]:mx-auto"
      :style="{ backgroundColor: header.bgColor, color: header.textColor }">

      <img v-if="panelStore.headerLeftLogoUrlIsDefined" class="w-60" :src="header.leftLogoUrl" />

      <span class="text-5xl font-bold uppercase">{{ unityDescription }}</span>

    </div>

    <!-- MAIN -->
    <div class="flex flex-1 py-10 items-center justify-between bg-white" :style="{ backgroundColor: main.bgColor }">

      <!-- CURRENT TICKET -->
      <div class="ml-5 flex w-3/4 h-full flex-col justify-between">

        <span class="text-5xl font-bold uppercase" :style="{ color: main.ticketLabelColor }">
          {{ ticketLabel }}
        </span>

        <span class="text-9xl font-bold uppercase" :style="{ color: ticketColor }">
          {{ mainStore.message.senha ?? $t('panel.empty') }}
        </span>

        <span class="text-5xl font-bold uppercase" :style="{ color: main.serviceColor }">
          {{ mainStore.message.$data?.servico.descricao ?? $t('panel.empty') }}
        </span>

        <span class="text-8xl font-bold uppercase" :style="{ color: main.localColor }">
          {{ mainStore.message.local ?? $t('panel.empty') }}
        </span>

      </div>

      <!-- HISTORY -->
      <div class="px-5 flex w-1/4 h-full flex-col items-center rounded-l-3xl"
        :style="{ backgroundColor: main.historyBgColor }">

        <History :history="mainStore.history" :historyLabelColor="main.historyLabelColor"
          :historyEmptyColor="main.historyEmptyColor" :historyTicketColor="main.ticketColor"
          :historyTicketPriorityColor="main.ticketPriorityColor" :showTicketLocal="main.historyShowLocal" />

      </div>

    </div>

    <!-- FOOTER -->
    <div class="flex h-32 px-5 items-center justify-between [&>*:only-child]:mx-auto"
      :style="{ backgroundColor: footer.bgColor, color: footer.textColor }">

      <img v-if="panelStore.footerLeftLogoUrlIsDefined" class="w-60" :src="footer.leftLogoUrl" />

      <Clock v-if="footer.showClock" :locale="mainStore.config.locale" :dateFormat="$t('date_format')" />

      <img v-if="panelStore.footerRightLogoUrlIsDefined" class="w-60" :src="footer.rightLogoUrl" />

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import { usePanelStore } from '@/stores/panel'
import { useSettingsStore } from '@/stores/settings'
import { useAlert } from '@/composables/audio'
import { useSpeech } from '@/composables/speech'
import { useI18n } from 'vue-i18n'

// Componentes (No Vue 3 com script setup, basta importar para usar)
import Clock from '@/components/Clock.vue'
import History from '@/components/History.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'

const { t } = useI18n()

const mainStore = useMainStore()
const settingsStore = useSettingsStore()

const panelStore = usePanelStore()
const { header, main, footer } = panelStore

const { playAlert } = useAlert()
const { speakAll } = useSpeech()

const isCalling = ref(false)
const lastMessage = ref({})
const messageQueue = []

const unityDescription = computed(() => {
  return settingsStore.unities.filter((u) => u.id === mainStore.config.unity)[0]?.nome || '---'
})

const ticketLabel = computed(() => {
  return mainStore.message.prioridade ? `${t('panel.ticket')} (${t('panel.priority')})` : t('panel.ticket')
})

const ticketColor = computed(() => {
  return mainStore.message.prioridade ? main.ticketPriorityColor : main.ticketColor
})

/**
 * Lógica de Chamada (Áudio + Voz)
 */
const playAudio = async () => {
  if (isCalling.value || messageQueue.length === 0) return

  isCalling.value = true
  lastMessage.value = messageQueue.shift()

  try {
    // 1. Toca o Alerta Sonoro
    await playAlert(mainStore.config.alert)

    // 2. Vocalização (Se habilitado)
    if (mainStore.config.speech) {
      const msg = lastMessage.value.$data
      const texts = ['Senha']

      // Soletra a sigla (ex: A, B, C)
      msg.siglaSenha.split('').forEach((char) => texts.push(char))
      texts.push(msg.numeroSenha)
      texts.push(msg.local)
      texts.push(msg.numeroLocal)

      await speakAll(texts, mainStore.config.locale)
    }
  } catch (error) {
    console.error('Erro na sequência de áudio:', error)
  } finally {
    isCalling.value = false
    // Tenta chamar a próxima se houver fila
    if (messageQueue.length > 0) playAudio()
  }
}

const call = () => {
  messageQueue.push(mainStore.message)
  playAudio()
}

// Watcher para novas mensagens vindas da Store
watch(
  () => mainStore.message,
  (newVal) => {
    if (newVal && newVal.id !== lastMessage.value?.id) {
      call()
    }
  },
)
</script>

<style scoped></style>
