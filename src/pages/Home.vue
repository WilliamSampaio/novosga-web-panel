<template>
  <div class="home">
    <div class="menu">
      <router-link to="/settings">
        <span class="icon">
          <span class="mdi mdi-cog"></span>
        </span>
        {{ $t ? $t('menu.settings') : 'Configurações' }}
      </router-link>
    </div>

    <LayoutLoader />
  </div>
</template>

<script setup>
/**
 * No Vue 3 com <script setup>, basta importar o componente
 * para que ele fique disponível no template.
 */
import LayoutLoader from '@/components/LayoutLoader.vue';
</script>

<style scoped lang="scss">
/**
 * Estilos convertidos para SCSS e com 'scoped' para
 * não interferir na página de configurações.
 */
.home {
  .menu {
    position: fixed;
    top: 2vh;
    left: 2vw;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    border-radius: 8px;
    opacity: 0;
    z-index: 100;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 1);
    }

    a {
      color: #ffffff;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;

      .icon {
        margin-right: 5px;
      }
    }
  }
}
</style>
