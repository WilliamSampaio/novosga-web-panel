<template>
  <component :is="panel" />
</template>

<script setup>
import { LIST_PANEL_MODELS } from '@/plugins/registry'
import { computed } from 'vue'

const props = defineProps({
  panel: { type: String, default: 'default', required: true },
  isPreview: { type: Boolean, default: false },
})

const panel = computed(() => {
  return LIST_PANEL_MODELS[props.panel][props.isPreview ? 'previewComponent' : 'component']
})
</script>
