<template>
  <div class="d-flex flex-column align-center">
    <span class="text-body-2">{{ label }}</span>
    <input class="w-full h-10" type="color" v-model="internalValue" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: String,
  label: String,
})

const emit = defineEmits(['update:modelValue'])

const internalValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style scoped></style>
