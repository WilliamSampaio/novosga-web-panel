<template>
  <div class="absolute inset-0 z-50 flex flex-col bg-white overflow-hidden">
    <div
      class="flex h-32 px-5 items-center justify-between [&>*:only-child]:mx-auto"
      :style="{ backgroundColor: header.bgColor, color: header.textColor }"
    >
      <img v-if="panelStore.headerLeftLogoUrlIsDefined" class="w-60" :src="header.leftLogoUrl" />

      <span class="text-5xl font-bold uppercase">{{ unityDescription }}</span>
    </div>

    <div class="flex flex-1 flex-col px-8 py-10" :style="{ backgroundColor: main.bgColor }">
      <div class="flex items-start justify-between gap-8">
        <div class="flex min-w-0 flex-1 flex-col">
          <span class="text-4xl font-bold uppercase" :style="{ color: main.ticketLabelColor }">
            {{ ticketLabel }}
          </span>

          <span
            class="max-w-full break-words text-[8rem] leading-none font-black uppercase"
            :style="{ color: ticketColor }"
          >
            {{ featuredText }}
          </span>
        </div>

        <div
          class="flex min-w-96 flex-col items-center justify-center rounded-lg border-8 px-8 py-6"
          :style="{ borderColor: ticketColor, color: ticketColor }"
        >
          <span class="text-3xl font-bold uppercase">{{ $t('panel.alert.attendance') }}</span>
          <span class="text-6xl leading-none font-black uppercase">{{ currentTicket }}</span>
          <span class="mt-5 text-8xl leading-none font-black tabular-nums">{{ elapsedTime }}</span>
        </div>
      </div>

      <div class="mt-auto grid grid-cols-2 items-end gap-8">
        <div class="flex min-w-0 flex-col">
          <span
            class="max-w-full break-words text-5xl leading-tight font-bold uppercase"
            :style="{ color: main.serviceColor }"
          >
            {{ currentService }}
          </span>

          <span
            class="max-w-full break-words text-7xl leading-none font-black uppercase"
            :style="{ color: main.localColor }"
          >
            {{ currentLocal }}
          </span>
        </div>

        <div class="flex min-w-0 flex-col text-right">
          <span class="text-4xl font-bold uppercase" :style="{ color: main.ticketLabelColor }">
            {{ $t('panel.priority') }}
          </span>

          <span
            class="max-w-full break-words text-6xl leading-tight font-black uppercase"
            :style="{ color: ticketColor }"
          >
            {{ priorityText }}
          </span>
        </div>
      </div>
    </div>

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
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAlert } from '@/composables/audio'
import { useSpeech } from '@/composables/speech'
import { useMainStore } from '@/stores/main'
import { usePanelStore } from '@/stores/panel'
import { useSettingsStore } from '@/stores/settings'

import Clock from '@/components/Clock.vue'

const { t, locale } = useI18n()

const mainStore = useMainStore()
const panelStore = usePanelStore()
const settingsStore = useSettingsStore()
const { header, main, footer } = panelStore

const { playAlert } = useAlert()
const { speakAll } = useSpeech()

const ALERT_REMINDER_INTERVAL_MS = 15000

const elapsedSeconds = ref(0)
const isCalling = ref(false)
const lastMessage = ref({})
const activeMessageKey = ref(null)
const messageQueue = []
let elapsedTimer = null
let reminderTimer = null

const unityDescription = computed(() => {
  return settingsStore.unities.filter((u) => u.id === settingsStore.currentUnity)[0]?.nome || '---'
})

const currentTicket = computed(() => mainStore.message.ticket ?? t('panel.empty'))

const currentClientName = computed(() => mainStore.message.clientName || '')

const featuredText = computed(() => {
  if (currentClientName.value) return currentClientName.value

  return currentTicket.value
})

const currentService = computed(() => {
  return mainStore.message.$data?.servico.nome ?? t('panel.empty')
})

const currentLocal = computed(() => mainStore.message.local ?? t('panel.empty'))

const priorityText = computed(() => {
  if (!mainStore.message.priority) return t('panel.empty')

  return mainStore.message.priorityText || t('panel.priority')
})

const ticketLabel = computed(() => {
  return mainStore.message.priority
    ? `${t('panel.alert.attendance')}`
    : t('panel.alert.attendance')
})

const ticketColor = computed(() => {
  return mainStore.message.priority ? main.ticketPriorityColor : main.ticketColor
})

const elapsedTime = computed(() => {
  const minutes = Math.floor(elapsedSeconds.value / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (elapsedSeconds.value % 60).toString().padStart(2, '0')

  return `${minutes}:${seconds}`
})

const clearCallTimers = () => {
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }

  if (reminderTimer) {
    clearInterval(reminderTimer)
    reminderTimer = null
  }
}

const playReminderAlert = async () => {
  if (!activeMessageKey.value) return

  try {
    await playAlert(settingsStore.alertSound)
  } catch (error) {
    console.error('Erro no alerta sonoro recorrente:', error)
  }
}

const startCallTimers = (message) => {
  clearCallTimers()
  activeMessageKey.value = getMessageKey(message)
  elapsedSeconds.value = 0

  elapsedTimer = setInterval(() => {
    elapsedSeconds.value += 1
  }, 1000)

  reminderTimer = setInterval(() => {
    playReminderAlert()
  }, ALERT_REMINDER_INTERVAL_MS)
}

const getMessageKey = (message) => {
  return [message.type || 'ticket', message.ticket || message.id].join(':')
}

const playAudio = async () => {
  if (isCalling.value || messageQueue.length === 0) return

  isCalling.value = true
  lastMessage.value = messageQueue.shift()

  try {
    await playAlert(settingsStore.alertSound)

    if (settingsStore.speech) {
      const message = lastMessage.value
      const data = message.$data || {}

      const text = panelStore.getParsedSpeechText({
        ticketCode: data.siglaSenha || '',
        ticketNumber: data.numeroSenha || message.ticket || '',
        clientName: data.nomeCliente || message.clientName || '',
        local: data.local || '',
        localNumber: data.numeroLocal || '',
        service: data.servico?.nome || '',
      })

      await speakAll([text], locale.value)
    }
  } catch (error) {
    console.error('Erro na sequência de áudio:', error)
  } finally {
    isCalling.value = false
    if (messageQueue.length > 0) {
      playAudio()
    }
  }
}

const call = (message, { resetTimers = false } = {}) => {
  if (resetTimers) startCallTimers(message)

  messageQueue.push(message)
  playAudio()
}

watch(
  () => mainStore.message,
  (newVal) => {
    if (!newVal?.id) return

    const newMessageKey = getMessageKey(newVal)
    const isNewCurrentCall = newMessageKey !== activeMessageKey.value

    if (isNewCurrentCall || newVal.id !== lastMessage.value?.id) {
      call(newVal, { resetTimers: isNewCurrentCall })
    }
  },
)

onBeforeUnmount(() => {
  clearCallTimers()
})
</script>
