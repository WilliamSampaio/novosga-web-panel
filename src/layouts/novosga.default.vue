<template>
  <div class="novosga-default layout-content"
    :style="{ backgroundColor: getColor('pageBgColor'), color: getColor('pageFontColor') }">
    <div class="columns is-gapless">
      <div class="column is-multiline featured-column">
        <header class="column">
          <Featured v-if="lastMessage?.id" :message="lastMessage"
            :fontColor="getColor('featuredFontColor', 'pageFontColor')" />
        </header>
        <footer class="column"
          :style="{ backgroundColor: getColor('footerBgColor'), color: getColor('footerFontColor') }">
          <img :src="logoUrl" class="is-pulled-left">
          <h1 v-if="mainStore.config.themeOptions?.footerText" class="is-pulled-left"
            :style="{ color: getColor('footerFontColor') }">
            {{ mainStore.config.themeOptions.footerText }}
          </h1>
        </footer>
      </div>

      <div class="column is-one-quarter history-column"
        :style="{ backgroundColor: getColor('sidebarBgColor'), color: getColor('sidebarFontColor') }">
        <header>
          <h2 class="title" :style="{ color: getColor('sidebarFontColor') }">
            {{ $t ? $t('history.title') : 'Histórico' }}
          </h2>
          <History v-if="lastMessage?.id" :messages="mainStore.history"
            :fontColorNormal="mainStore.config.historyFontColorNormal || mainStore.config.sidebarFontColorNormal"
            :fontColorPriority="mainStore.config.historyFontColorPriority || mainStore.config.sidebarFontColorPriority" />
        </header>
        <footer :style="{ backgroundColor: getColor('clockBgColor'), color: getColor('clockFontColor') }">
          <Clock :locale="mainStore.config.locale" :dateFormat="$t ? $t('date_format') : 'DD/MM/YYYY'"
            :fontColor="getColor('clockFontColor')" />
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMainStore } from '@/stores/main'
import { useAlert } from '@/composables/audio'
import { useSpeech } from '@/composables/speech'

// Componentes (No Vue 3 com script setup, basta importar para usar)
import Clock from '@/components/Clock.vue'
import Featured from '@/components/Featured.vue'
import History from '@/components/History.vue'

const mainStore = useMainStore()
const { playAlert } = useAlert()
const { speakAll } = useSpeech()

const isCalling = ref(false)
const lastMessage = ref({})
const messageQueue = []

const logoUrl = computed(() => mainStore.config.themeOptions?.logo || '/images/logo.png')

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
      msg.siglaSenha.split('').forEach(char => texts.push(char))
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

/**
 * Gerenciador de Cores Dinâmicas (Normal vs Prioridade)
 */
const getColor = (prefix, fallback) => {
  const peso = lastMessage.value?.$data ? lastMessage.value.$data.peso : 0
  const suffix = peso > 0 ? 'Priority' : 'Normal'
  return mainStore.config[prefix + suffix] || mainStore.config[(fallback || prefix) + suffix]
}

// Watcher para novas mensagens vindas da Store
watch(() => mainStore.message, (newVal) => {
  if (newVal && newVal.id !== lastMessage.value?.id) {
    call()
  }
})
</script>

<style scoped lang="scss">
/* O seu CSS original foi mantido, apenas trocado para 'scoped' e 'scss'
   para garantir que não vaze para outros temas. */
.novosga-default {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .columns {
    height: 100%;
  }

  .featured-column {
    >header {
      height: 80vh;
    }

    >footer {
      height: 20vh;
      padding: 5vh;
      display: flex;
      align-items: center;

      img {
        height: 10vh;
      }

      h1 {
        font-size: 5vh;
        margin-left: 2rem;
      }
    }
  }

  .history-column {
    height: 100vh;
    display: flex;
    flex-direction: column;

    >header {
      flex: 1;
      padding: 1rem;
      overflow: hidden;
    }

    >footer {
      height: 20vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
