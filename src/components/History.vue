<template>
  <div class="history">
    <div v-if="messages.length === 0" class="empty">
      <p :style="{ color: fontColorNormal }">
        {{ $t ? $t('history.empty') : 'Histórico vazio' }}
      </p>
    </div>

    <div v-for="message in messages" class="message" :key="message.id">
      <span v-if="showMessageTitle" class="title" :style="{ color: getFontColor(message) }">
        {{ message.title }}
      </span>

      <span v-if="showMessageSubtitle" class="subtitle" :style="{ color: getFontColor(message) }">
        {{ message.subtitle }}
      </span>

      <span v-if="showMessageDescription" class="description" :style="{ color: getFontColor(message) }">
        {{ message.description }}
      </span>
    </div>
  </div>
</template>

<script setup>
// Props definidas com a nova macro defineProps
const props = defineProps({
  messages: {
    required: true,
  },
  fontColorNormal: {
    type: String,
    default: '#000000',
  },
  fontColorPriority: {
    type: String,
    default: '#FF0000',
  },
  showMessageTitle: {
    type: Boolean,
    default: true,
  },
  showMessageSubtitle: {
    type: Boolean,
    default: true,
  },
  showMessageDescription: {
    type: Boolean,
    default: false,
  },
});

// Método convertido em função simples
const getFontColor = (message) => {
  // Mantendo a lógica de verificação de peso para prioridade
  const peso = message.$data ? message.$data.peso : 0;
  return peso > 0 ? props.fontColorPriority : props.fontColorNormal;
};
</script>

<style scoped>
.history {
  /* Estilos específicos do histórico */
}

.message {
  margin-bottom: 0.5rem;
}
</style>
