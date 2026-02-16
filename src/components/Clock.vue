<template>
  <div class="text-2xl text-white text-center">
    <div v-if="showDate">
      <span>{{ formattedDate }}</span>
    </div>

    <div>
      <span v-if="showHours">
        {{ hours }}
      </span>

      <span v-if="showMinutes">:</span>
      <span v-if="showMinutes">
        {{ minutes }}
      </span>

      <span v-if="showSeconds">:</span>
      <span v-if="showSeconds">
        {{ seconds }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import moment from 'moment'

// Definindo as Props (Equivalente ao props do Vue 2)
const props = defineProps({
  showHours: { type: Boolean, default: true },
  showMinutes: { type: Boolean, default: true },
  showSeconds: { type: Boolean, default: true },
  showDate: { type: Boolean, default: true },
  dateFormat: { type: String, default: 'MMMM Do YYYY' },
  locale: { type: String, default: 'pt-br' }, // Ajustado para sua preferência pt-br
  fontColor: { type: String, default: '#000000' },
})

// Estado Reativo (Equivalente ao data)
const date = ref(new Date())
let timer = null

// Propriedades Computadas (Equivalente ao computed)
const hours = computed(() => moment(date.value).format('HH'))
const minutes = computed(() => moment(date.value).format('mm'))
const seconds = computed(() => moment(date.value).format('ss'))
const formattedDate = computed(() => {
  moment.locale(props.locale)
  return moment(date.value).format(props.dateFormat)
})

// Lifecycle Hooks (Equivalente ao created/mounted)
onMounted(() => {
  timer = setInterval(() => {
    date.value = new Date()
  }, 1000)
})

// Boa prática: limpar o intervalo quando o componente for destruído
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped></style>
