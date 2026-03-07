<template>
  <div class="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden">
    <div
      class="flex h-32 px-5 items-center justify-between [&>*:only-child]:mx-auto"
      :style="{ backgroundColor: header.bgColor, color: header.textColor }"
    >
      <img v-if="panelStore.headerLeftLogoUrlIsDefined" class="w-60" :src="header.leftLogoUrl" />
      <span class="text-5xl font-bold uppercase">{{ unityDescription }}</span>
    </div>

    <div class="h-full flex flex-col justify-between" :style="{ backgroundColor: main.bgColor }">
      <div class="ma-5 h-1/2 flex flex-col justify-between">
        <div class="flex flex-col">
          <span
            v-if="mainStore.message.clientName"
            class="text-5xl font-bold uppercase"
            :style="{ color: main.ticketLabelColor }"
          >
            {{ ticketLabel }} {{ mainStore.message.ticket ?? $t('panel.empty') }}
          </span>
          <span
            v-else
            class="text-5xl font-bold uppercase"
            :style="{ color: main.ticketLabelColor }"
          >
            {{ ticketLabel }}
          </span>

          <span class="text-8xl font-bold uppercase" :style="{ color: ticketColor }">
            {{
              mainStore.message.clientName
                ? formatarNome(mainStore.message.clientName)
                : mainStore.message.ticket
            }}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-5xl font-bold uppercase" :style="{ color: main.serviceColor }">
            {{ mainStore.message.$data?.servico.nome ?? $t('panel.empty') }}
          </span>
          <span class="text-8xl font-bold uppercase" :style="{ color: main.localColor }">
            {{ mainStore.message.local ?? $t('panel.empty') }}
          </span>
        </div>
      </div>

      <div
        class="pa-3 h-1/2 flex flex-col items-center rounded-t-3xl"
        :style="{ backgroundColor: main.historyBgColor }"
      >
        <History
          :history="mainStore.history"
          :historyLabelColor="main.historyLabelColor"
          :historyEmptyColor="main.historyEmptyColor"
          :historyTicketColor="main.ticketColor"
          :historyTicketPriorityColor="main.ticketPriorityColor"
        />
      </div>
    </div>

    <div
      class="flex h-32 px-5 items-center justify-between [&>*:only-child]:mx-auto"
      :style="{ backgroundColor: footer.bgColor }"
    >
      <img v-if="panelStore.footerLeftLogoUrlIsDefined" class="w-60" :src="footer.leftLogoUrl" />

      <div class="text-4xl text-white text-center font-medium" :style="{ color: footer.textColor }">
        <Clock
          v-if="footer.showClock"
          :locale="locale"
          :dateFormat="$t('panel.date_format')"
          :fontColor="footer.textColor"
        />
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
import { formatarNome } from '@/util/functions'
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
  return settingsStore.unities.find((u) => u.id === settingsStore.currentUnity)?.nome || '---'
})

const ticketLabel = computed(() => {
  return mainStore.message.priority
    ? `(${t('panel.priority')}) ${t('panel.ticket')}`
    : t('panel.ticket')
})

const ticketColor = computed(() => {
  return mainStore.message.priority ? main.ticketPriorityColor : main.ticketColor
})

const playAudio = async () => {
  if (isCalling.value || messageQueue.length === 0) return

  isCalling.value = true
  lastMessage.value = messageQueue.shift()

  try {
    await playAlert(settingsStore.alertSound)

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
    if (messageQueue.length > 0) playAudio()
  }
}

const call = () => {
  messageQueue.push(mainStore.message)
  playAudio()
}

watch(
  () => mainStore.message,
  (newVal) => {
    if (newVal && newVal.id !== lastMessage.value?.id) {
      call()
    }
  },
)
</script>
