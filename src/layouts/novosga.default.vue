<template>
  <div>
    <div class="flex h-25 items-center justify-between bg-[#00519e] px-5">
      <img class="h-21 py-5 w-40" :src="logoHeaderUrl" />
      <span class="text-4xl font-bold text-white uppercase">{{ unidadeDescricao }}</span>
    </div>

    <div class="flex h-50 items-center justify-between bg-[#ffffff]">
      <div class="ml-5 flex h-40 w-150 flex-col">
        <span class="text-2xl font-bold text-black uppercase">senha{{ mainStore.message.prioridade ? ' (Prioridade)' :
          ''
          }}</span>
        <span :class="`text-5xl font-bold ${colorSenha} uppercase`">{{ mainStore.message.senha ?? '---' }}</span>
        <span class="text-2xl font-bold text-black uppercase">{{ mainStore.message.$data?.servico.descricao ?? '---'
          }}</span>
        <span class="text-5xl font-bold text-[#2f5ea9] uppercase">{{ mainStore.message.local ?? '---' }}</span>
      </div>
      <History v-if="lastMessage?.id" :messages="mainStore.history" />
    </div>

    <div class="flex h-25 items-center justify-between bg-[#00519e] px-5">
      <img class="h-21 py-5 w-40" :src="logoFooterLeftUrl" />
      <Clock :locale="mainStore.config.locale" :dateFormat="$t('date_format')" />
      <img class="h-21 py-5 w-40" :src="logoFooterRightUrl" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import { useSettingsStore } from '@/stores/settings'
import { useAlert } from '@/composables/audio'
import { useSpeech } from '@/composables/speech'

// Componentes (No Vue 3 com script setup, basta importar para usar)
import Clock from '@/components/Clock.vue'
import History from '@/components/History.vue'

const mainStore = useMainStore()
const settingsStore = useSettingsStore()

const { playAlert } = useAlert()
const { speakAll } = useSpeech()

const isCalling = ref(false)
const lastMessage = ref({})
const messageQueue = []

const logoHeaderUrl = computed(() => mainStore.config.themeOptions?.logo || '/images/logo_hemoam.svg')
const logoFooterLeftUrl = computed(() => mainStore.config.themeOptions?.logo || '/images/logo_hemoam.svg')
const logoFooterRightUrl = computed(() => mainStore.config.themeOptions?.logoFooterRight || '/images/logo-gov-horizontal-contraste.svg')

const unidadeDescricao = computed(() => {
  return settingsStore.unities.filter((u) => u.id === mainStore.config.unity)[0]?.nome || '---'
})

const colorSenha = computed(() => {
  return mainStore.message.prioridade ? 'text-red-700' : 'text-[#2f5ea9]'
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
