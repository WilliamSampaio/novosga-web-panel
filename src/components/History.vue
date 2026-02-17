<template>
  <span class="text-3xl font-bold uppercase">{{ $t('history.title') }}</span>

  <span v-if="props.messages.length === 0" class="text-5xl font-bold uppercase text-gray-600">{{ $t('history.empty')
  }}</span>

  <div class="w-full h-full flex flex-col items-center justify-around" v-else>

    <div v-for="message in props.messages" :key="message.id"
      :class="`flex flex-col text-center ${message.prioridade ? 'text-red-700' : 'text-[#2f5ea9]'} `">
      <span class="text-7xl font-bold uppercase">
        {{ message.senha }}
      </span>
      <span class="text-3xl font-bold uppercase">
        {{ message.local }}
      </span>
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  messages: {
    required: true,
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
})
</script>

<style scoped></style>
