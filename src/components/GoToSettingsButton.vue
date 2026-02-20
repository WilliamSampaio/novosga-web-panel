<template>
  <div class="home">
    <div class="menu">
      <router-link to="/settings">
        <span class="icon">
          <i class="fa fa-cog"></i>
        </span>
        {{ $t('menu.settings') }}
      </router-link>
    </div>
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.home {
  .menu {
    position: fixed;
    top: 1rem;
    left: 1rem;
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
