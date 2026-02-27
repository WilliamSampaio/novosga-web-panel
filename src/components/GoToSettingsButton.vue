<template>
  <v-fab
    class="menu"
    :to="{ name: 'settings' }"
    :absolute="false"
    :app="true"
    color="black"
    location="top center"
    variant="flat"
    text="Ir para o Painel"
    prepend-icon="mdi-chevron-left"
    extended
  >
    {{ $t('menu.settings') }}
  </v-fab>
</template>

<script setup></script>

<style scoped lang="scss">
.menu {
  position: fixed;
  top: 1rem;
  left: 1rem;
  opacity: 0;
  z-index: 100;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }
}
</style>
