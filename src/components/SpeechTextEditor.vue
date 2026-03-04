<template>
  <v-text-field
    v-model="panelStore.panel.speechText"
    prepend-icon="mdi-account-voice"
    density="compact"
    maxlength="100"
    :disabled="!settingsStore.speech"
  >
    <template v-slot:append>
      <v-btn variant="flat" color="success" append-icon="mdi-play" @click="testSpeechText">
        Ouvir
      </v-btn>
    </template>
  </v-text-field>

  <v-chip-group>
    <v-chip
      @click="
        () =>
          (panelStore.panel.speechText = String(panelStore.panel.speechText).trim() + ' $TICKET$ ')
      "
    >
      Ticket
    </v-chip>
    <v-chip
      @click="
        () =>
          (panelStore.panel.speechText = String(panelStore.panel.speechText).trim() + ' $CLIENT$ ')
      "
    >
      Client
    </v-chip>
    <v-chip
      @click="
        () =>
          (panelStore.panel.speechText =
            String(panelStore.panel.speechText).trim() + ' $CLIENT_OR_TICKET$ ')
      "
    >
      Client OR Ticket
    </v-chip>
    <v-chip
      @click="
        () =>
          (panelStore.panel.speechText = String(panelStore.panel.speechText).trim() + ' $LOCAL$ ')
      "
    >
      Local
    </v-chip>
    <v-chip
      @click="
        () =>
          (panelStore.panel.speechText = String(panelStore.panel.speechText).trim() + ' $SERVICE$ ')
      "
    >
      Service
    </v-chip>
  </v-chip-group>
</template>

<script setup>
import { useSpeech } from '@/composables/speech'
import { usePanelStore } from '@/stores/panel'
import { useSettingsStore } from '@/stores/settings'
import { onBeforeMount } from 'vue'

const panelStore = usePanelStore()
const settingsStore = useSettingsStore()

const { speakAll } = useSpeech()

const testSpeechText = () => {
  speakAll([
    panelStore.getParsedSpeechText({
      ticketCode: 'ABC',
      ticketNumber: 7,
      clientName: 'james bond',
      local: 'Local',
      localNumber: 99,
      service: 'Serviço',
    }),
  ])
}

onBeforeMount(() => {
  if (panelStore.panel.speechText === null) {
    panelStore.panel.speechText = panelStore.getCurrentPanelModel.text
  }
})
</script>
