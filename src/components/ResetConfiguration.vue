<template>
  <v-dialog v-model="dialog" max-width="450" persistent>
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        variant="flat"
        color="error"
        prepend-icon="mdi-delete"
        size="large"
      >
        {{ $t('reset.button.open') }}
      </v-btn>
    </template>

    <v-card>
      <v-card-item class="bg-error text-white">
        <v-card-title class="text-h6">
          <v-icon start>mdi-alert-octagon</v-icon>
          {{ $t('reset.dialog.title') }}
        </v-card-title>
      </v-card-item>

      <v-card-text class="pt-4 text-body-1">
        <span v-html="$t('reset.dialog.description')"></span> <br /><br />
        {{ $t('reset.dialog.action_intro') }}
        <ul class="ml-4 mt-2">
          <li>{{ $t('reset.dialog.action_voice_templates') }}</li>
          <li>{{ $t('reset.dialog.action_colors_logos') }}</li>
          <li>{{ $t('reset.dialog.action_logout') }}</li>
        </ul>
        <p class="mt-4 text-caption text-medium-emphasis">
          {{ $t('reset.dialog.irreversible') }}
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="dialog = false" :disabled="loading">
          {{ $t('reset.button.keep') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn color="error" variant="flat" :loading="loading" @click="handleReset">
          {{ $t('reset.button.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import storage from '@/composables/storage'
import { ref } from 'vue'

const dialog = ref(false)
const loading = ref(false)

const handleReset = () => {
  loading.value = true

  setTimeout(() => {
    storage.clear()
    localStorage.clear()
    sessionStorage.clear()

    window.location.reload()
  }, 1000)
}
</script>
