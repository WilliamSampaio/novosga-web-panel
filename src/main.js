import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useMainStore } from './stores/main'

import 'bulma/css/bulma.min.css'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicialização de estado
const mainStore = useMainStore()
if (mainStore.config.locale) {
  // Isso dispara a carga do dicionário JSON que convertemos no store/main.js
  mainStore.updateConfig(mainStore.config)
}

app.mount('#app')
