<template>
  <div v-if="showDate" :style="{ color: fontColor }">
    {{ formattedDate }}
  </div>

  <div :style="{ color: fontColor }">
    <span v-if="showHours">{{ hours }}</span>

    <span v-if="showMinutes">:</span>
    <span v-if="showMinutes">
      {{ minutes }}
    </span>

    <span v-if="showSeconds">:</span>
    <span v-if="showSeconds">
      {{ seconds }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  showHours: { type: Boolean, default: true },
  showMinutes: { type: Boolean, default: true },
  showSeconds: { type: Boolean, default: true },
  showDate: { type: Boolean, default: true },
  locale: { type: String, default: 'pt-BR' },
  fontColor: { type: String, default: '#000000' },
})

const now = ref(new Date())
let timer = null

const hours = computed(() => now.value.getHours().toString().padStart(2, '0'))
const minutes = computed(() => now.value.getMinutes().toString().padStart(2, '0'))
const seconds = computed(() => now.value.getSeconds().toString().padStart(2, '0'))

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat(props.locale.replace('_', '-'), {
    dateStyle: 'long',
  }).format(now.value)
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
