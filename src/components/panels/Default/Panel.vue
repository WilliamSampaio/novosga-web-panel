<template>
  <div class="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden">
    <!-- HEADER -->
    <div
      class="flex h-32 px-5 items-center justify-between [&>*:only-child]:mx-auto"
      :style="{ backgroundColor: header.bgColor, color: header.textColor }"
    >
      <img v-if="panelStore.headerLeftLogoUrlIsDefined" class="w-60" :src="header.leftLogoUrl" />

      <span class="text-5xl font-bold uppercase">{{ unityDescription }}</span>
    </div>

    <!-- MAIN -->
    <div
      class="flex flex-1 py-10 items-center justify-between"
      :style="{ backgroundColor: main.bgColor }"
    >
      <!-- CURRENT TICKET -->
      <div class="ml-5 flex w-3/4 h-full flex-col justify-between">
        <span class="text-5xl font-bold uppercase" :style="{ color: main.ticketLabelColor }">
          {{ ticketLabel }}
        </span>

        <div class="flex flex-col">
          <span class="text-8xl font-bold uppercase" :style="{ color: ticketColor }">
            {{ mainStore.message.ticket ?? $t('panel.empty') }}
          </span>

          <span
            v-if="mainStore.message.clientName"
            class="text-5xl font-bold uppercase"
            :style="{ color: ticketColor }"
          >
            {{ mainStore.message.clientName }}
          </span>
        </div>

        <span class="text-5xl font-bold uppercase" :style="{ color: main.serviceColor }">
          {{ mainStore.message.$data?.servico.nome ?? $t('panel.empty') }}
        </span>

        <span class="text-8xl font-bold uppercase" :style="{ color: main.localColor }">
          {{ mainStore.message.local ?? $t('panel.empty') }}
        </span>
      </div>

      <!-- HISTORY -->
      <div
        class="px-5 flex w-1/4 h-full flex-col items-center rounded-l-3xl"
        :style="{ backgroundColor: main.historyBgColor }"
      >
        <History
          :history="mainStore.history"
          :historyLabelColor="main.historyLabelColor"
          :historyEmptyColor="main.historyEmptyColor"
          :historyTicketColor="main.ticketColor"
          :historyTicketPriorityColor="main.ticketPriorityColor"
          :showTicketLocal="main.historyShowLocal"
        />
      </div>
    </div>

    <!-- FOOTER -->
    <div
      class="flex h-32 px-5 items-center justify-between [&>*:only-child]:mx-auto"
      :style="{ backgroundColor: footer.bgColor }"
    >
      <img v-if="panelStore.footerLeftLogoUrlIsDefined" class="w-60" :src="footer.leftLogoUrl" />

      <div class="text-4xl text-white text-center font-medium" :style="{ color: footer.textColor }">
        <Clock v-if="footer.showClock" :locale="locale" :fontColor="footer.textColor" />
      </div>

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

import Clock from '@/components/Clock.vue'
import History from './History.vue'

const { t, locale } = useI18n()

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
  return settingsStore.unities.filter((u) => u.id === settingsStore.currentUnity)[0]?.nome || '---'
})

const ticketLabel = computed(() => {
  return mainStore.message.priority
    ? `${t('panel.ticket')} (${t('panel.priority')})`
    : t('panel.ticket')
})

const ticketColor = computed(() => {
  return mainStore.message.priority ? main.ticketPriorityColor : main.ticketColor
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
    await playAlert(settingsStore.alertSound)

    // 2. Vocalização (Se habilitado)
    if (settingsStore.speech) {
      const message = lastMessage.value.$data

      const text = panelStore.getParsedSpeechText({
        ticketCode: message.siglaSenha,
        ticketNumber: message.numeroSenha,
        clientName: message.nomeCliente,
        local: message.local,
        localNumber: message.numeroLocal,
        service: message.servico.nome,
      })

      await speakAll([text], locale.value)
    }
  } catch (error) {
    console.error('Erro na sequência de áudio:', error)
  } finally {
    isCalling.value = false
    // Tenta chamar a próxima se houver fila
    if (messageQueue.length > 0) {
      playAudio()
    }
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
