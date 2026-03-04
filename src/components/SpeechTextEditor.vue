<template>
  <v-text-field
    v-model="panelStore.panel.speechText"
    label="Template da chamada"
    prepend-icon="mdi-account-voice"
    density="compact"
    maxlength="100"
    :disabled="!settingsStore.speech"
    clearable
  >
    <template v-slot:append>
      <v-btn variant="flat" color="success" append-icon="mdi-play" @click="testSpeechText">
        Ouvir
      </v-btn>
    </template>
  </v-text-field>

  <div>
    <v-chip
      v-for="tag in tags"
      :key="tag.key"
      @click="
        () => (panelStore.panel.speechText = (panelStore.panel.speechText || '') + ` ${tag.key} `)
      "
      :prepend-icon="tag.icon"
      :color="tag.color"
      variant="tonal"
      type="primary"
      class="mx-1 my-1"
    >
      {{ tag.text }}
    </v-chip>
  </div>
</template>

<script setup>
import { useSpeech } from '@/composables/speech'
import { usePanelStore } from '@/stores/panel'
import { useSettingsStore } from '@/stores/settings'
import { onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const panelStore = usePanelStore()
const settingsStore = useSettingsStore()

const tags = [
  { text: t('panel.ticket'), key: '$TICKET$', icon: 'mdi-invoice-list-outline', color: 'primary' },
  {
    text: t('panel.client'),
    key: '$CLIENT$',
    icon: 'mdi-account-injury-outline',
    color: 'primary',
  },
  {
    text: t('panel.client_or_ticket'),
    key: '$CLIENT_OR_TICKET$',
    icon: 'mdi-gate-or',
    color: 'primary',
  },
  { text: t('panel.local'), key: '$LOCAL$', icon: 'mdi-map-marker-outline', color: 'primary' },
  { text: t('panel.service'), key: '$SERVICE$', icon: 'mdi-face-agent', color: 'primary' },
]

const { speakAll } = useSpeech()

const testSpeechText = () => {
  speakAll([
    panelStore.getParsedSpeechText({
      ticketCode: 'ABC',
      ticketNumber: 7,
      clientName: 'James Bond',
      local: 'Guichê',
      localNumber: 1,
      service: 'Triagem',
    }),
  ])
}

onBeforeMount(() => {
  if (panelStore.panel.speechText === null) {
    panelStore.panel.speechText = panelStore.getCurrentPanelModel.text
  }
})
</script>
