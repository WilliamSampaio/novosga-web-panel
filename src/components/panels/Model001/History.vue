<template>
  <span class="mb-3 text-3xl font-bold uppercase" :style="{ color: props.historyLabelColor }">
    {{ $t('panel.history.title') }}
  </span>

  <span
    v-if="props.history.length === 0"
    class="text-5xl font-bold uppercase"
    :style="{ color: props.historyEmptyColor }"
  >
    {{ $t('panel.empty') }}
  </span>

  <div class="w-full h-full flex flex-col justify-between" v-else>
    <div
      class="flex justify-between"
      v-for="ticket in props.history.slice(0, 6)"
      :key="ticket.id"
      :style="{
        color: ticket.priority ? props.historyTicketPriorityColor : props.historyTicketColor,
      }"
    >
      <span class="w-[50%] text-4xl font-bold uppercase">
        {{ ticket.ticket }} -
        {{ ticket.clientName ? formatarNome(ticket.clientName, true) : $t('panel.empty') }}
      </span>
      <span class="w-[50%] text-4xl font-bold uppercase">
        {{ formatarNome(ticket.$data?.servico.descricao) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { formatarNome } from '@/util/functions'

const props = defineProps({
  history: {
    required: true,
  },
  historyLabelColor: {
    type: String,
    default: '#000000',
  },
  historyEmptyColor: {
    type: String,
    default: '#000000',
  },
  historyTicketColor: {
    type: String,
    default: '#000000',
  },
  historyTicketPriorityColor: {
    type: String,
    default: '#ff0000',
  },
})
</script>

<style scoped></style>
