import { createRouter, createWebHashHistory } from 'vue-router'

// Definimos as rotas
const routes = [
  {
    path: '/',
    name: 'home',
    // Lazy loading: carrega a página apenas quando acessada
    component: () => import('@/pages/Home.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/Settings.vue'),
  },
  {
    path: '/settings2',
    name: 'settings2',
    component: () => import('@/pages/settings2.vue'),
  },
  {
    // No Vue Router 4, o seletor '*' mudou para uma regex específica
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  // Para aplicações Electron, o Hash History é o mais seguro
  history: createWebHashHistory(),
  routes,
})

export default router
