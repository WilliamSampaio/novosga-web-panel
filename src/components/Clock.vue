<template>
  <div class="clock">
    <div class="date" v-if="showDate">
      <span :style="{ color: fontColor }">{{ formattedDate }}</span>
    </div>

    <div class="time">
      <span v-if="showHours" class="hours" :style="{ color: fontColor }">
        {{ hours }}
      </span>

      <span v-if="showMinutes" class="separator" :style="{ color: fontColor }">:</span>
      <span v-if="showMinutes" class="minutes" :style="{ color: fontColor }">
        {{ minutes }}
      </span>

      <span v-if="showSeconds" class="separator" :style="{ color: fontColor }">:</span>
      <span v-if="showSeconds" class="seconds" :style="{ color: fontColor }">
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

<style scoped>
/* Adicione seu CSS aqui se necessário */
.separator {
  padding: 0 2px;
}
</style>
