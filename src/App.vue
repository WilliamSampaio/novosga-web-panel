<template>
  <v-app id="inspire">
    <RouterView />

    <v-snackbar-queue
      v-model="messages.queue"
      :timeout="2000"
      location="bottom center"
      variant="flat"
      closable
    >
      <template v-slot:actions="{ props }">
        <v-btn icon="$close" variant="text" size="x-small" v-bind="props"></v-btn>
      </template>
    </v-snackbar-queue>
  </v-app>
</template>

<script setup>
import { useMessagesStore } from '@/stores/messages'
import { useSettingsStore } from './stores/settings'
import { onMounted, watch } from 'vue'
import { useTheme } from 'vuetify/lib/composables/theme'

const messages = useMessagesStore()
const settingsStore = useSettingsStore()

const theme = useTheme()

const applyTheme = () => {
  theme.change(settingsStore.darkTheme ? 'dark' : 'light')
}

watch(() => settingsStore.darkTheme, applyTheme)

onMounted(applyTheme)
</script>

<style scoped></style>
