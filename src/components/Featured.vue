<template>
  <div ref="root" class="featured-message">
    <p class="description" :style="{ color: fontColor }">
      {{ message.description || '---' }}
    </p>
    <h1 class="title" :style="{ color: fontColor }">
      {{ message.title || '---' }}
    </h1>
    <h2 class="subtitle" :style="{ color: fontColor }">
      {{ message.subtitle || '---' }}
    </h2>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import PQueue from 'p-queue';

// Props (Substitui o export default props)
const props = defineProps({
  message: {
    required: true,
  },
  fontColor: {
    type: String,
    default: '#000000',
  },
})

// Emit (Substitui o this.$emit)
const emit = defineEmits(['blink'])

// Referência ao elemento raiz (Substitui o this.$el)
const root = ref(null)

// Configuração da Fila (Mantendo a lógica original)
const queue = new PQueue({ concurrency: 1 });

// Funções de utilidade para o efeito de piscar
const toggleVisibility = (el) => {
  if (el) {
    el.style.visibility = el.style.visibility === 'hidden' ? 'visible' : 'hidden'
  }
}

const blinkElement = (el, count, resolve) => {
  toggleVisibility(el)

  if (count > 0) {
    setTimeout(() => blinkElement(el, count - 1, resolve), 200)
  } else {
    // Garante que o elemento fique visível ao final e resolve a Promise
    if (el) el.style.visibility = 'visible'
    setTimeout(resolve, 1000)
  }
}

// Método de animação
const blink = () => {
  emit('blink')
  return new Promise((resolve) => {
    blinkElement(root.value, 5, resolve)
  })
}

// Watcher para disparar a animação quando a mensagem mudar
watch(
  () => props.message,
  () => {
    queue.add(blink)
  },
  { deep: true },
) // deep: true caso apenas propriedades internas da mensagem mudem
</script>

<style scoped>
/* Estilos base */
/* .featured-message {
} */
</style>
