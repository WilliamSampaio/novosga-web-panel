<template>
  <span class="text-3xl font-bold uppercase" :style="{ color: props.historyLabelColor }">
    {{ $t('panel.history.title') }}
  </span>

  <span v-if="props.history.length === 0" class="text-5xl font-bold uppercase"
    :style="{ color: props.historyEmptyColor }">
    {{ $t('panel.empty') }}
  </span>

  <div class="w-full h-full flex flex-col items-center justify-around" v-else>

    <div v-for="ticket in props.history" :key="ticket.id" class="flex flex-col text-center" :style="{
      color: ticket.priority ? props.historyTicketPriorityColor : props.historyTicketColor
    }">

      <span class="text-7xl font-bold uppercase">
        {{ ticket.ticket }}
      </span>

      <span v-if="props.showTicketLocal" class="text-3xl font-bold uppercase">
        {{ ticket.local }}
      </span>

    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  history: {
    required: true,
  },
  showTicketLocal: {
    type: Boolean,
    default: true,
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
