<template>
  <span class="text-xl font-bold mb-5">{{ $t('history.title') }}</span>

  <span v-if="props.messages.length === 0" class="text-4xl font-bold text-gray-600">{{ $t('history.empty')
    }}</span>

  <ul v-else>
    <li class="mb-5" v-for="message in props.messages" :key="message.id">
      <div :class="`flex flex-col text-center ${message.prioridade ? 'text-red-700' : 'text-[#2f5ea9]'} `">
        <span class="text-4xl font-bold">
          {{ message.senha }}
        </span>
        <span class="text-4">
          {{ message.local }}
        </span>
      </div>
    </li>
  </ul>
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
