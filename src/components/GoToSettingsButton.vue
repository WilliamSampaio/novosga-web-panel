<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-fab
      v-bind="props"
      :to="{ name: 'settings' }"
      :app="true"
      color="black"
      location="top center"
      variant="flat"
      prepend-icon="mdi-chevron-left"
      extended
      class="transition-swing"
      :style="{
        opacity: isHovering ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: 'auto',
      }"
    >
      {{ $t('menu.settings') }}
    </v-fab>
  </v-hover>
</template>

<script setup></script>

<style scoped></style>
