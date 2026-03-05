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
        Redefinir Painel
      </v-btn>
    </template>

    <v-card>
      <v-card-item class="bg-error text-white">
        <v-card-title class="text-h6">
          <v-icon start>mdi-alert-octagon</v-icon>
          Atenção! Ação Crítica
        </v-card-title>
      </v-card-item>

      <v-card-text class="pt-4 text-body-1">
        Você está prestes a <strong>limpar todos os dados locais</strong> deste painel. <br /><br />
        Esta ação irá:
        <ul class="ml-4 mt-2">
          <li>Remover templates de voz personalizados.</li>
          <li>Resetar cores e logos configuradas.</li>
          <li>Deslogar a sessão atual.</li>
        </ul>
        <p class="mt-4 text-caption text-medium-emphasis">Essa operação não pode ser desfeita.</p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="dialog = false" :disabled="loading">
          Manter Configurações
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn color="error" variant="flat" :loading="loading" @click="handleReset">
          Sim, Redefinir Tudo
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
